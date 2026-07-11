import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, subtotal, tax, total, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    if (!paymentMethod || !['online', 'pay_at_shop'].includes(paymentMethod)) {
      return NextResponse.json({ message: 'Invalid payment method' }, { status: 400 });
    }

    await connectDB();

    if (paymentMethod === 'pay_at_shop') {
      const order = await Order.create({
        userId: session.user.id,
        services: items,
        subtotal,
        tax,
        total,
        paymentMethod: 'pay_at_shop',
        paymentStatus: 'PENDING',
        orderStatus: 'AWAITING_CUSTOMER_VISIT',
      });
      return NextResponse.json({ 
        orderId: order._id, 
        message: 'Order created successfully'
      }, { status: 201 });
    }

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now().toString(),
    });

    // Save Order in DB
    const order = await Order.create({
      userId: session.user.id,
      services: items,
      subtotal,
      tax,
      total,
      paymentMethod: 'online',
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
    });

    return NextResponse.json({ 
      orderId: order._id, 
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let orders;
    if (session.user.role === 'ADMIN') {
      orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email mobile');
    } else {
      orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
