import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Partner } from '@/models/Partner';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { verifyPartnerAccess, calculateOrderCommission } from '@/lib/tenant';

// GET /api/partner/requests - List requests scoped to partner
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized: Partner login required' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const query: any = { partnerId: access.partnerId };

    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }

    if (search.trim()) {
      query.$or = [
        { customerName: { $regex: search.trim(), $options: 'i' } },
        { customerPhone: { $regex: search.trim(), $options: 'i' } },
        { 'services.title': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error in GET /api/partner/requests:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch requests' }, { status: 500 });
  }
}

// POST /api/partner/requests - Create walk-in request from partner dashboard
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized: Partner login required' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const { customerName, customerPhone, customerEmail, serviceTitle, price, notes } = body;

    if (!customerName || !customerPhone || !serviceTitle) {
      return NextResponse.json(
        { error: 'Customer Name, Phone, and Service Title are required' },
        { status: 400 }
      );
    }

    const partner = await Partner.findOne({ partnerId: access.partnerId });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Resolve or create customer account
    let customer = await User.findOne({ mobile: customerPhone });
    if (!customer) {
      customer = await User.create({
        name: customerName,
        email: customerEmail || `customer_${Date.now()}@sandydigitalhub.com`,
        mobile: customerPhone,
        role: 'CUSTOMER',
        partnerId: access.partnerId,
        status: 'ACTIVE',
      });
    }

    const numericPrice = Number(price) || 50;
    const commission = calculateOrderCommission(numericPrice, partner.commission);

    // Create Order with partnerId
    const order = await Order.create({
      userId: customer._id,
      partnerId: access.partnerId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      services: [
        {
          serviceId: customer._id, // placeholder for walk-in custom service
          title: serviceTitle,
          price: numericPrice,
          quantity: 1,
        },
      ],
      subtotal: numericPrice,
      tax: 0,
      total: numericPrice,
      commission,
      paymentMethod: 'pay_at_shop',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      notes: notes || 'Walk-in counter request created by Partner Staff',
      timeline: [
        {
          status: 'CREATED',
          timestamp: new Date(),
          note: 'Walk-in request logged at center counter',
          updatedBy: session?.user?.name || 'Partner Staff',
        },
      ],
    });

    // Update partner counters
    partner.totalOrdersCount = (partner.totalOrdersCount || 0) + 1;
    partner.totalRevenue = (partner.totalRevenue || 0) + numericPrice;
    partner.partnerEarnings = (partner.partnerEarnings || 0) + commission.partnerEarnings;
    await partner.save();

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/partner/requests:', error);
    return NextResponse.json({ error: error.message || 'Failed to create request' }, { status: 500 });
  }
}
