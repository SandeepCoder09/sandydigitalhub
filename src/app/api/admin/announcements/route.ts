/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Announcement } from '@/models/Announcement';
import { cache } from '@/lib/cache';
import { dispatchJob } from '@/lib/jobs';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

// GET /api/admin/announcements — list all (admin only), newest first
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status && status !== 'ALL') query.status = status;

    const [announcements, total] = await Promise.all([
      Announcement.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Announcement.countDocuments(query),
    ]);

    return NextResponse.json({
      announcements,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('[GET /api/admin/announcements]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/announcements — create new announcement
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const {
      title, body: bodyText, type, targetAudience, targetPartnerId,
      priority, status, scheduledAt, expiresAt, pinned,
    } = body;

    if (!title?.trim() || !bodyText?.trim()) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const publishNow = status === 'PUBLISHED';
    const announcement = await Announcement.create({
      title: title.trim(),
      body: bodyText.trim(),
      type: type || 'GENERAL',
      targetAudience: targetAudience || 'ALL',
      targetPartnerId: targetPartnerId || null,
      priority: priority || 'NORMAL',
      status: status || 'DRAFT',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      publishedAt: publishNow ? new Date() : null,
      createdBy: (session.user as any).id || session.user.email,
      pinned: pinned || false,
      readBy: [],
    });

    if (publishNow) {
      // Invalidate caches immediately
      cache.invalidateAnnouncements();

      // Dispatch background worker to generate targeted user notifications
      await dispatchJob(
        'ANNOUNCEMENT_DELIVERY',
        {
          announcementId: (announcement._id as any).toString(),
          targetAudience: announcement.targetAudience,
          targetPartnerId: announcement.targetPartnerId,
          title: announcement.title,
          body: announcement.body,
        },
        { idempotencyKey: `ann-publish-${announcement._id}` }
      ).catch((err) => console.error('[Announcements] Background dispatch error:', err));
    }

    return NextResponse.json({ success: true, announcement }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/admin/announcements]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
