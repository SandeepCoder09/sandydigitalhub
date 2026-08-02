import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const { trackingId, phone } = await req.json();

    if (!trackingId && !phone) {
      return NextResponse.json({ error: 'Order ID or registered Phone Number is required' }, { status: 400 });
    }

    await connectDB();

    let query: any = {};

    if (trackingId && trackingId.trim()) {
      const cleanId = trackingId.trim();
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        query._id = cleanId;
      } else {
        query.$or = [
          { razorpayOrderId: cleanId },
          { razorpayPaymentId: cleanId },
        ];
      }
    } else if (phone && phone.trim()) {
      const cleanPhone = phone.trim();
      const matchedUser = await User.findOne({ phone: cleanPhone });
      if (!matchedUser) {
        return NextResponse.json({ error: 'No orders found matching this phone number.' }, { status: 404 });
      }
      query.userId = matchedUser._id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name phone email')
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'No orders found with provided tracking details.' }, { status: 404 });
    }

    // Map order fields for safe public tracking response
    const formattedOrders = orders.map((o: any) => ({
      orderId: o._id.toString(),
      createdAt: o.createdAt,
      services: o.services,
      total: o.total,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      documentUrl: o.documentUrl,
      documentName: o.documentName,
      customerName: o.userId?.name ? `${o.userId.name.slice(0, 3)}***` : 'Customer',
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (err: any) {
    console.error('Track order API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
