import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { UserNotification } from '@/models/UserNotification';
import { Announcement } from '@/models/Announcement';
import { ChatMessage } from '@/models/ChatMessage';
import { cache } from '@/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ unreadCount: 0, adminChatCount: 0 });
    }

    const userId = (session.user as any).id as string;
    const userRole = (session.user as any).role as string;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

    const cacheKey = cache.buildKey('notifications:unread-count', { userId, role: userRole });

    const counts = await cache.getOrSet(
      cacheKey,
      15, // 15s cache TTL
      async () => {
        await connectDB();

        // 1. Fast indexed count of unread personal notifications
        const personalUnread = await UserNotification.countDocuments({
          userId,
          isRead: false,
        });

        // 2. Fast count of unread announcements matching this user's role
        const audienceClauses: any[] = [{ targetAudience: 'ALL' }];
        if (userRole === 'CUSTOMER') audienceClauses.push({ targetAudience: 'CUSTOMER' });
        if (['PARTNER_ADMIN', 'PARTNER_STAFF'].includes(userRole)) audienceClauses.push({ targetAudience: 'PARTNER' });
        if (isAdmin) audienceClauses.push({ targetAudience: 'ADMIN' });

        const unreadAnnouncements = await Announcement.countDocuments({
          status: 'PUBLISHED',
          $or: audienceClauses,
          readBy: { $ne: userId },
          $and: [
            {
              $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } },
              ],
            },
          ],
        });

        // 3. Admin chat alert count (only for admins)
        let adminChatCount = 0;
        if (isAdmin) {
          try {
            adminChatCount = await ChatMessage.countDocuments({ isAgentRequest: true, status: 'OPEN' });
          } catch {}
        }

        return {
          unreadCount: personalUnread + unreadAnnouncements,
          adminChatCount,
        };
      },
      15 // SWR
    );

    const res = NextResponse.json(counts);
    res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return res;
  } catch (error: any) {
    return NextResponse.json({ unreadCount: 0, adminChatCount: 0 }, { status: 200 });
  }
}
