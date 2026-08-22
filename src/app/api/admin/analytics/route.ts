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

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const cacheKey = 'admin:analytics:dashboard:v2';

    const analytics = await cache.getOrSet(
      cacheKey,
      5, // 5s cache TTL for near real-time updates
      async () => {
        await connectDB();

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
        const activeSessionsCount = activeIpsResult.length > 0 ? activeIpsResult.length : (todayPageViews > 0 ? 1 : 0);

        // 2. Top Visited Pages
        const topPagesAggregation = await VisitorLog.aggregate([
          { $group: { _id: '$path', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ]);

        // 3. Device Type Breakdown & Mobile Ratio
        const deviceAggregation = await VisitorLog.aggregate([
          { $group: { _id: '$deviceType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]);

        const mobileCount = deviceAggregation.find((d) => d._id === 'Mobile')?.count || 0;
        const totalLoggedDevices = deviceAggregation.reduce((acc, curr) => acc + curr.count, 0);
        const mobilePercentage = totalLoggedDevices > 0 ? Math.round((mobileCount / totalLoggedDevices) * 100) : 0;

        // 4. Recent Live Visitor Logs (last 30 visits)
        const recentLogs = await VisitorLog.find()
          .sort({ createdAt: -1 })
          .limit(30)
          .lean();

        const recentVisitors = recentLogs.map((log: any) => {
          let browser = 'Chrome';
          const ua = (log.userAgent || '').toLowerCase();
          if (ua.includes('firefox')) browser = 'Firefox';
          else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
          else if (ua.includes('edg')) browser = 'Edge';
          else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

          return {
            id: log._id?.toString(),
            ip: log.ip || '127.0.0.1',
            path: log.path || '/',
            device: log.deviceType || 'Desktop',
            deviceType: log.deviceType || 'Desktop',
            browser,
            lastSeen: log.createdAt,
            createdAt: log.createdAt,
          };
        });

        return {
          activeSessionsCount,
          activeUsersCount: activeSessionsCount,
          totalPageViewsToday: todayPageViews,
          todayPageViews,
          totalPageViews,
          totalUniqueVisitors,
          totalOrdersCount,
          mobilePercentage,
          topRegion: 'India (Domestic)',
          topPages: topPagesAggregation.map((item) => ({ path: item._id || '/', views: item.count })),
          deviceBreakdown: deviceAggregation.map((item) => ({
            device: item._id || 'Desktop',
            count: item.count,
          })),
          recentVisitors,
          recentLogs: recentVisitors,
        };
      },
      10 // SWR window 10s
    );

    const res = NextResponse.json({ analytics });
    res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return res;
  } catch (error: any) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
