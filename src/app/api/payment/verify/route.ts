import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readData, writeData } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      
      // Save order to JSON DB
      const orders = readData('orders.json');
      const newOrder = {
        id: Date.now().toString(),
        razorpay_order_id,
        razorpay_payment_id,
        status: 'Paid',
        ...orderDetails,
        createdAt: new Date().toISOString()
      };
      
      orders.push(newOrder);
      writeData('orders.json', orders);

      return NextResponse.json({ message: 'Payment verified successfully', order: newOrder }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
