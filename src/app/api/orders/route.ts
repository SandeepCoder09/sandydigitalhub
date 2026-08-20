/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Partner } from '@/models/Partner';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { calculateOrderCommission } from '@/lib/tenant';
import Razorpay from 'razorpay';
import { SiteControl } from '@/models/SiteControl';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      items,
      subtotal,
      tax = 0,
      total,
      paymentMethod = 'pay_at_shop',
      notes,
      documentUrl,
      documentName,
      partnerId,
      customerName,
      customerPhone,
      customerEmail,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart or requested service items are required' }, { status: 400 });
    }

    await connectDB();

    // Check SiteControl allowFileUploads setting
    const siteControl = await SiteControl.findOne().lean();
    if (siteControl && siteControl.allowFileUploads === false && documentUrl) {
      return NextResponse.json(
        { message: 'File and photo uploads are currently restricted by Admin Firewall settings.' },
        { status: 403 }
      );
    }

    // Resolve or find User ID
    let effectiveUserId = session?.user?.id;
    if (!effectiveUserId) {
      if (!customerPhone && !customerEmail) {
        return NextResponse.json({ message: 'Customer phone or login required' }, { status: 400 });
      }

      // Find or create customer
      const lookupQuery = customerPhone ? { mobile: customerPhone } : { email: customerEmail };
      let customer = await User.findOne(lookupQuery);
      if (!customer) {
        customer = await User.create({
          name: customerName || 'Valued Customer',
          email: customerEmail || `customer_${Date.now()}@sandydigitalhub.com`,
          mobile: customerPhone || `+91${Date.now().toString().slice(-10)}`,
          role: 'CUSTOMER',
          partnerId: partnerId || null,
          status: 'ACTIVE',
        });
      }
      effectiveUserId = customer._id.toString();
    }

    // Commission & Partner calculation
    let commission = { partnerEarnings: 0, platformFee: 0 };
    if (partnerId) {
      const partner = await Partner.findOne({ partnerId });
      if (partner) {
        commission = calculateOrderCommission(total, partner.commission);
        partner.totalOrdersCount = (partner.totalOrdersCount || 0) + 1;
        partner.totalRevenue = (partner.totalRevenue || 0) + total;
        partner.partnerEarnings = (partner.partnerEarnings || 0) + commission.partnerEarnings;
        await partner.save();
      }
    }

    if (paymentMethod === 'pay_at_shop') {
      const order = await Order.create({
        userId: effectiveUserId,
        partnerId: partnerId || null,
        customerName: customerName || session?.user?.name,
        customerPhone: customerPhone || (session?.user as any)?.mobile,
        customerEmail: customerEmail || session?.user?.email,
        services: items,
        subtotal: subtotal || total,
        tax: tax || 0,
        total,
        commission,
        paymentMethod: 'pay_at_shop',
        paymentStatus: 'PENDING',
        orderStatus: 'AWAITING_CUSTOMER_VISIT',
        notes,
        documentUrl,
        documentName,
        timeline: [
          {
            status: 'CREATED',
            timestamp: new Date(),
            note: partnerId ? `Request submitted via partner center (${partnerId})` : 'Request submitted on central platform',
            updatedBy: 'Customer Portal',
          },
        ],
      });

      return NextResponse.json(
        {
          orderId: order._id,
          message: 'Service request created successfully',
        },
        { status: 201 }
      );
    }

    // Razorpay Online Order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy',
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: 'receipt_' + Date.now().toString(),
    });

    const order = await Order.create({
      userId: effectiveUserId,
      partnerId: partnerId || null,
      customerName: customerName || session?.user?.name,
      customerPhone: customerPhone || (session?.user as any)?.mobile,
      customerEmail: customerEmail || session?.user?.email,
      services: items,
      subtotal: subtotal || total,
      tax: tax || 0,
      total,
      commission,
      paymentMethod: 'online',
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      notes,
      documentUrl,
      documentName,
      timeline: [
        {
          status: 'CREATED',
          timestamp: new Date(),
          note: 'Online order initiated with Razorpay gateway',
          updatedBy: 'Customer Portal',
        },
      ],
    });

    return NextResponse.json(
      {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: error.message || 'Error creating order' }, { status: 500 });
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
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') {
      orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email mobile');
    } else {
      orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
