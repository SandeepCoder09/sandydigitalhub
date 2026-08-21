/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Announcement } from '@/models/Announcement';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

// PATCH /api/admin/announcements/[id] — update an announcement
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Allow field updates
    if (body.title !== undefined) announcement.title = body.title;
    if (body.body !== undefined) announcement.body = body.body;
    if (body.type !== undefined) announcement.type = body.type;
    if (body.targetAudience !== undefined) announcement.targetAudience = body.targetAudience;
    if (body.targetPartnerId !== undefined) announcement.targetPartnerId = body.targetPartnerId;
    if (body.priority !== undefined) announcement.priority = body.priority;
    if (body.pinned !== undefined) announcement.pinned = body.pinned;
    if (body.expiresAt !== undefined) announcement.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.scheduledAt !== undefined) announcement.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;

    // Handle status transitions
    if (body.status !== undefined) {
      announcement.status = body.status;
      if (body.status === 'PUBLISHED' && !announcement.publishedAt) {
        announcement.publishedAt = new Date();
      }
    }

    await announcement.save();
    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    console.error('[PATCH /api/admin/announcements/[id]]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/announcements/[id] — permanently delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (error: any) {
    console.error('[DELETE /api/admin/announcements/[id]]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
