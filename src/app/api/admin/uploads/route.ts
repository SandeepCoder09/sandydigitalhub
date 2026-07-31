import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { ChatMessage } from '@/models/ChatMessage';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // 1. Fetch all checkout orders with attached documents
    const ordersWithFiles = await Order.find({
      documentUrl: { $exists: true, $ne: '' },
    })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Format order uploads
    const formattedOrderUploads = ordersWithFiles.map((order: any) => ({
      _id: order._id,
      source: 'Checkout Order',
      user: order.userId || { name: 'Rahul Sharma', email: 'rahulsharma@example.com' },
      documentUrl: order.documentUrl,
      documentName: order.documentName || 'checkout_attached_document',
      serviceName: order.services?.[0]?.title || 'Order Attached File',
      orderId: order._id,
      createdAt: order.createdAt,
    }));

    // 2. Fetch any chat messages containing uploaded images/attachments
    const chatMediaMessages = await ChatMessage.find({
      $or: [
        { message: { $regex: '^data:image/' } },
        { message: { $regex: 'http.*\\.(jpg|png|webp|gif|pdf)' } }
      ]
    })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    const formattedChatUploads = chatMediaMessages.map((msg: any) => ({
      _id: msg._id,
      source: 'Support Chat',
      user: msg.userId || { name: msg.senderName || 'Rahul Sharma', email: 'rahulsharma@example.com' },
      documentUrl: msg.message,
      documentName: 'chat_uploaded_image',
      serviceName: 'Live Support Chat Attachment',
      createdAt: msg.createdAt,
    }));

    // Combine all uploads sorted by date
    const allUploads = [...formattedOrderUploads, ...formattedChatUploads].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ uploads: allUploads });
  } catch (error: any) {
    console.error('Error fetching admin user uploads:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
