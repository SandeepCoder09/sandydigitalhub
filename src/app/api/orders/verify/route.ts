import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Transaction } from '@/models/Transaction';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    await connectDB();

    if (isAuthentic) {
      const order = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        razorpayPaymentId: razorpay_payment_id
      }, { new: true });

      if (order) {
        await Transaction.create({
          orderId: order._id,
          amount: order.total,
          paymentId: razorpay_payment_id,
          status: 'SUCCESS'
        });
      }

      return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
    } else {
      await Transaction.create({
        orderId,
        amount: 0,
        paymentId: razorpay_payment_id || 'FAILED',
        status: 'FAILED'
      });
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ message: 'Error verifying payment' }, { status: 500 });
  }
}
