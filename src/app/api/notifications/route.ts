/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { UserNotification } from '@/models/UserNotification';
import { Announcement } from '@/models/Announcement';

// GET /api/notifications — fetch the logged-in user's notification feed
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const userRole = (session.user as any).role as string;
    const userPartnerId = (session.user as any).partnerId as string | null;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    // 1. Fetch personal notifications
    const personalNotifs = await UserNotification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // 2. Determine audience match for this user
    const audienceFilter: any = {
      status: 'PUBLISHED',
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    // Build audience eligibility
    const audienceClauses: any[] = [{ targetAudience: 'ALL' }];

    if (userRole === 'CUSTOMER') audienceClauses.push({ targetAudience: 'CUSTOMER' });
    if (['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole)) {
      audienceClauses.push({ targetAudience: 'PARTNER' });
      if (userPartnerId) {
        audienceClauses.push({ targetAudience: 'PARTNER', targetPartnerId: userPartnerId });
      }
    }
    if (['ADMIN', 'SUPER_ADMIN'].includes(userRole)) audienceClauses.push({ targetAudience: 'ADMIN' });

    audienceFilter.$and = [
      { $or: audienceClauses },
      audienceFilter.$or ? { $or: audienceFilter.$or } : {},
    ];
    delete audienceFilter.$or;

    const announcements = await Announcement.find({
      status: 'PUBLISHED',
      $or: audienceClauses,
      $and: [
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
          ],
        },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();

    // 3. Merge: mark announcements as read if userId is in readBy
    const mergedAnnouncements = announcements.map((a) => ({
      id: `ann-${a._id}`,
      type: 'ANNOUNCEMENT',
      category: a.type,
      title: a.title,
      body: a.body,
      priority: a.priority,
      pinned: a.pinned,
      isRead: (a.readBy || []).includes(userId),
      createdAt: a.publishedAt || a.createdAt,
      link: null,
      relatedType: 'ANNOUNCEMENT',
      isAnnouncement: true,
    }));

    const mergedPersonal = personalNotifs.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      category: n.type,
      title: n.title,
      body: n.body,
      priority: 'NORMAL',
      pinned: false,
      isRead: n.isRead,
      createdAt: n.createdAt,
      link: n.link,
      relatedId: n.relatedId,
      relatedType: n.relatedType,
      isAnnouncement: false,
    }));

    // Combine and sort by date
    const all = [...mergedPersonal, ...mergedAnnouncements].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unreadCount = all.filter((n) => !n.isRead).length;

    return NextResponse.json({
      notifications: all.slice(0, limit),
      unreadCount,
    });
  } catch (error: any) {
    console.error('[GET /api/notifications]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notifications/announcements as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const body = await req.json();
    const { ids, markAll, announcementIds, personalIds } = body;

    await connectDB();

    if (markAll) {
      // Mark all personal notifications read
      await UserNotification.updateMany({ userId, isRead: false }, { isRead: true });

      // Mark all visible announcements as read by adding userId to readBy
      await Announcement.updateMany(
        { status: 'PUBLISHED', readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
    } else {
      // Mark specific personal notifications
      if (personalIds?.length) {
        await UserNotification.updateMany(
          { _id: { $in: personalIds }, userId },
          { isRead: true }
        );
      }

      // Mark specific announcements as read
      if (announcementIds?.length) {
        await Announcement.updateMany(
          { _id: { $in: announcementIds } },
          { $addToSet: { readBy: userId } }
        );
      }

      // Legacy: handle combined ids array
      if (ids?.length) {
        const annIds = ids.filter((id: string) => id.startsWith('ann-')).map((id: string) => id.replace('ann-', ''));
        const persIds = ids.filter((id: string) => !id.startsWith('ann-'));

        if (persIds.length) {
          await UserNotification.updateMany({ _id: { $in: persIds }, userId }, { isRead: true });
        }
        if (annIds.length) {
          await Announcement.updateMany({ _id: { $in: annIds } }, { $addToSet: { readBy: userId } });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[PATCH /api/notifications]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
