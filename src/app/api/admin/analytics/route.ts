import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { VisitorLog } from '@/models/VisitorLog';
import { Order } from '@/models/Order';
import { cache } from '@/lib/cache';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || !['ADMIN', 'SUPER_ADMIN', 'admin'].includes(role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cacheKey = 'admin:analytics:dashboard:v1';

    const analytics = await cache.getOrSet(
      cacheKey,
      60, // 60s cache TTL
      async () => {
        await connectDB();

        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. Core Metrics
        const [totalPageViews, todayPageViews, uniqueIpsResult, activeIpsResult, totalOrdersCount] =
          await Promise.all([
            VisitorLog.countDocuments(),
            VisitorLog.countDocuments({ createdAt: { $gte: startOfToday } }),
            VisitorLog.distinct('ip'),
            VisitorLog.distinct('ip', { createdAt: { $gte: fifteenMinutesAgo } }),
            Order.countDocuments(),
          ]);

        const totalUniqueVisitors = uniqueIpsResult.length;
        const activeUsersCount = activeIpsResult.length;

        // 2. Top Visited Pages
        const topPagesAggregation = await VisitorLog.aggregate([
          { $group: { _id: '$path', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 6 },
        ]);

        // 3. Device Type Breakdown
        const deviceAggregation = await VisitorLog.aggregate([
          { $group: { _id: '$deviceType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]);

        // 4. Recent Live Visitor Logs (last 20 visits with field projection)
        const recentLogs = await VisitorLog.find()
          .sort({ createdAt: -1 })
          .limit(20)
          .select('ip path deviceType country city createdAt')
          .lean();

        return {
          totalPageViews,
          todayPageViews,
          totalUniqueVisitors,
          activeUsersCount,
          totalOrdersCount,
          topPages: topPagesAggregation.map((item) => ({ path: item._id, views: item.count })),
          deviceBreakdown: deviceAggregation.map((item) => ({
            device: item._id || 'Desktop',
            count: item.count,
          })),
          recentLogs,
        };
      },
      120 // SWR window 120s
    );

    const res = NextResponse.json({ analytics });
    res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return res;
  } catch (error: any) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
