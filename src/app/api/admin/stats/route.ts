/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { Service } from '@/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalServices = await Service.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const revenue = revenueResult[0]?.totalRevenue || 0;

    return NextResponse.json({
      revenue,
      totalOrders,
      totalUsers,
      totalServices
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
  }
}
