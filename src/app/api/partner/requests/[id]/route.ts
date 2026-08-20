import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { verifyPartnerAccess } from '@/lib/tenant';

// GET /api/partner/requests/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const order = await Order.findOne({
      _id: id,
      partnerId: access.partnerId, // Enforces strict tenant isolation
    }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Request not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error in GET /api/partner/requests/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch request' }, { status: 500 });
  }
}

// PATCH /api/partner/requests/[id] - Update status, notes, or assigned staff
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const access = verifyPartnerAccess(session);
    if (!access.authorized || !access.partnerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const order = await Order.findOne({
      _id: id,
      partnerId: access.partnerId, // Enforces strict tenant isolation
    });

    if (!order) {
      return NextResponse.json({ error: 'Request not found or unauthorized' }, { status: 404 });
    }

    const previousStatus = order.orderStatus;

    if (body.orderStatus && body.orderStatus !== previousStatus) {
      order.orderStatus = body.orderStatus;
      order.timeline = order.timeline || [];
      order.timeline.push({
        status: body.orderStatus,
        timestamp: new Date(),
        note: body.statusNote || `Status updated to ${body.orderStatus}`,
        updatedBy: session?.user?.name || 'Partner Staff',
      });
    }

    if (body.notes !== undefined) {
      order.notes = body.notes;
    }

    if (body.paymentStatus !== undefined) {
      order.paymentStatus = body.paymentStatus;
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error in PATCH /api/partner/requests/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update request' }, { status: 500 });
  }
}
