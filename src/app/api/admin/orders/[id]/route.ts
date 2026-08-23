/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    await connectDB();

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const previousOrderStatus = existingOrder.orderStatus;

    const updateData: any = {};
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.orderStatus) updateData.orderStatus = body.orderStatus;
    if (body.documentUrl !== undefined) updateData.documentUrl = body.documentUrl;
    if (body.documentName !== undefined) updateData.documentName = body.documentName;

    const order = await Order.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Auto-notify the customer ONLY if order status actually changed
    if (body.orderStatus && body.orderStatus !== previousOrderStatus && order.userId) {
      const { notifyOrderStatusChange } = await import('@/lib/notificationTriggers');
      notifyOrderStatusChange(
        order._id.toString(),
        order.userId.toString(),
        body.orderStatus,
        order.createdAt
      ).catch(console.error);
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}
