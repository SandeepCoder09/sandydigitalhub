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

    let orders: any[] = [];

    if (trackingId && trackingId.trim()) {
      const cleanId = trackingId.trim();
      
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        orders = await Order.find({ _id: cleanId })
          .sort({ createdAt: -1 })
          .populate('userId', 'name phone email')
          .lean();
      } else {
        // Handle branded order IDs like SDH-20260803-37DBC7 or short hash 37DBC7
        let shortCode = cleanId.trim();
        if (shortCode.toUpperCase().startsWith('SDH-')) {
          const parts = shortCode.split('-');
          shortCode = parts[parts.length - 1]; // Extract XXXXXX
        }

        const allOrders = await Order.find()
          .sort({ createdAt: -1 })
          .populate('userId', 'name phone email')
          .lean();

        orders = allOrders.filter((o: any) => {
          const rawId = o._id.toString();
          const razorpayOrder = o.razorpayOrderId || '';
          const razorpayPayment = o.razorpayPaymentId || '';
          const shortHash6 = rawId.slice(-6).toUpperCase();
          const shortHash4 = rawId.slice(-4).toUpperCase();
          const cleanUpper = cleanId.toUpperCase();
          const shortUpper = shortCode.toUpperCase();

          return (
            rawId.toUpperCase() === cleanUpper ||
            razorpayOrder === cleanId ||
            razorpayPayment === cleanId ||
            shortHash4 === shortUpper ||
            shortHash6 === shortUpper ||
            cleanUpper.includes(shortHash4)
          );
        });
      }
    } else if (phone && phone.trim()) {
      const cleanPhone = phone.trim();
      const matchedUser = await User.findOne({ phone: cleanPhone });
      if (!matchedUser) {
        return NextResponse.json({ error: 'No orders found matching this phone number.' }, { status: 404 });
      }
      orders = await Order.find({ userId: matchedUser._id })
        .sort({ createdAt: -1 })
        .populate('userId', 'name phone email')
        .lean();
    }

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
