import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { verifyPartnerAccess } from '@/lib/tenant';

// GET /api/partner/dashboard - Get tenant dashboard summary
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: access.error || 'Unauthorized: Partner login required' }, { status: 403 });
    }

    await connectDB();

    const partner = await Partner.findOne({ partnerId: access.partnerId }).lean();
    if (!partner) {
      return NextResponse.json({ error: 'Partner record not found' }, { status: 404 });
    }

    // Check if partner is suspended
    if (partner.status === 'SUSPENDED') {
      return NextResponse.json({
        partner,
        isSuspended: true,
        suspensionReason: partner.statusReason || 'Center suspended by platform administrator.',
      });
    }

    // Calculate metrics for this partner
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrdersCount = await Order.countDocuments({
      partnerId: access.partnerId,
      createdAt: { $gte: today },
    });

    const pendingOrdersCount = await Order.countDocuments({
      partnerId: access.partnerId,
      orderStatus: { $in: ['PENDING', 'AWAITING_CUSTOMER_VISIT', 'PROCESSING'] },
    });

    const completedOrdersCount = await Order.countDocuments({
      partnerId: access.partnerId,
      orderStatus: 'COMPLETED',
    });

    const totalStaffCount = await User.countDocuments({
      partnerId: access.partnerId,
    });

    // Recent requests
    const recentOrders = await Order.find({ partnerId: access.partnerId })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return NextResponse.json({
      partner,
      metrics: {
        todayOrders: todayOrdersCount,
        pendingOrders: pendingOrdersCount,
        completedOrders: completedOrdersCount,
        totalStaff: totalStaffCount,
        totalRevenue: partner.totalRevenue || 0,
        partnerEarnings: partner.partnerEarnings || 0,
      },
      onboarding: partner.onboarding || [],
      recentOrders,
    });
  } catch (error: any) {
    console.error('Error in GET /api/partner/dashboard:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch dashboard' }, { status: 500 });
  }
}
