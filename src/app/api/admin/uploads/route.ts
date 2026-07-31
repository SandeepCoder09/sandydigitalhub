import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const ordersWithFiles = await Order.find({
      documentUrl: { $exists: true, $ne: '' },
    })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ uploads: ordersWithFiles });
  } catch (error: any) {
    console.error('Error fetching admin user uploads:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
