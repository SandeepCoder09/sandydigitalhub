/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Partner } from '@/models/Partner';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { calculateOrderCommission } from '@/lib/tenant';
import { SiteControl } from '@/models/SiteControl';
import { handleApiError, AppError } from '@/lib/errors';
import cache from '@/lib/cache';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
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
      throw AppError.badRequest('Cart or requested service items are required');
    }

    if (!total || total < 0) {
      throw AppError.badRequest('Invalid order total amount');
    }

    await connectDB();

    // Check SiteControl allowFileUploads setting
    const siteControl = await SiteControl.findOne().lean();
    if (siteControl && siteControl.allowFileUploads === false && documentUrl) {
      throw AppError.forbidden('File uploads are currently restricted by Admin settings.');
    }

    // Resolve or find User ID
    let effectiveUserId = session?.user?.id;
    if (!effectiveUserId) {
      if (!customerPhone && !customerEmail) {
        throw AppError.badRequest('Customer phone number or account login is required.');
      }

      const lookupQuery = customerPhone ? { mobile: customerPhone.trim() } : { email: customerEmail.trim().toLowerCase() };
      let customer = await User.findOne(lookupQuery);
      if (!customer) {
        customer = await User.create({
          name: (customerName || 'Valued Customer').trim(),
          email: customerEmail ? customerEmail.trim().toLowerCase() : `customer_${Date.now()}@sandydigitalhub.com`,
          mobile: customerPhone ? customerPhone.trim() : `+91${Date.now().toString().slice(-10)}`,
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
        notes: notes ? String(notes).trim().slice(0, 1000) : undefined,
        documentUrl,
        documentName,
        timeline: [
          {
            status: 'CREATED',
            timestamp: new Date(),
            note: 'Order created with Pay-at-Shop mode',
            updatedBy: 'Customer Portal',
          },
        ],
      });

      return NextResponse.json(
        {
          success: true,
          orderId: order._id,
          customOrderId: order.customOrderId,
          status: order.orderStatus,
          message: 'Order created successfully. Please visit the center to complete documentation.',
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
      notes: notes ? String(notes).trim().slice(0, 1000) : undefined,
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

    // Invalidate order & analytics cache
    cache.invalidateOrders(effectiveUserId, partnerId);

    const res = NextResponse.json(
      {
        success: true,
        orderId: order._id,
        customOrderId: order.customOrderId,
        total: order.total,
        order,
      },
      { status: 201 }
    );
    res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return res;
  } catch (error: any) {
    return handleApiError(error, 'POST /api/orders');
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw AppError.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status')?.trim();
    const search = searchParams.get('search')?.trim();

    await connectDB();

    const filter: any = {};

    // Enforce Tenant & Role Isolation
    const userRole = (session.user as any).role;
    const userPartnerId = (session.user as any).partnerId;
    const userId = (session.user as any).id;

    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      // Super Admin can view all or filter by partner
      const partnerParam = searchParams.get('partnerId');
      if (partnerParam) filter.partnerId = partnerParam;
    } else if (userRole === 'PARTNER_ADMIN' || userRole === 'PARTNER_STAFF') {
      // Must be locked strictly to their assigned partner
      if (!userPartnerId) {
        throw AppError.forbidden('User is not assigned to any authorized partner center');
      }
      filter.partnerId = userPartnerId;
    } else {
      // Regular Customer
      filter.userId = userId;
    }

    if (status && status !== 'ALL') {
      filter.orderStatus = status;
    }

    if (search) {
      filter.$or = [
        { customOrderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('customOrderId customerName customerPhone services total paymentStatus orderStatus paymentMethod createdAt timeline notes')
      .lean();

    const response = NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    return response;
  } catch (error: any) {
    return handleApiError(error, 'GET /api/orders');
  }
}
