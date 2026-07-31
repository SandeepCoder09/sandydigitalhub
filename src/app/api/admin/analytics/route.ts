import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { VisitorLog } from '@/models/VisitorLog';
import { Order } from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Core Metrics
    const totalPageViews = await VisitorLog.countDocuments();
    const todayPageViews = await VisitorLog.countDocuments({ createdAt: { $gte: startOfToday } });
    
    // Unique IPs count
    const uniqueIpsResult = await VisitorLog.distinct('ip');
    const totalUniqueVisitors = uniqueIpsResult.length;

    // Active Users (in last 15 mins)
    const activeIpsResult = await VisitorLog.distinct('ip', { createdAt: { $gte: fifteenMinutesAgo } });
    const activeUsersCount = activeIpsResult.length;

    // 2. Top Visited Pages
    const topPagesAggregation = await VisitorLog.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // 3. Device Type Breakdown
    const deviceAggregation = await VisitorLog.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 4. Conversion Stats (Visitors to Orders ratio)
    const totalOrdersCount = await Order.countDocuments();

    // 5. Recent Live Visitor Logs (last 20 visits)
    const recentLogs = await VisitorLog.find()
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    return NextResponse.json({
      analytics: {
        totalPageViews,
        todayPageViews,
        totalUniqueVisitors,
        activeUsersCount,
        totalOrdersCount,
        topPages: topPagesAggregation.map(item => ({ path: item._id, views: item.count })),
        deviceBreakdown: deviceAggregation.map(item => ({ device: item._id || 'Desktop', count: item.count })),
        recentLogs,
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
