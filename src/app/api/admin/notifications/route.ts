import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { SecurityLog } from '@/models/SecurityLog';
import { ChatMessage } from '@/models/ChatMessage';
import { formatOrderId } from '@/lib/utils';

function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // 1. Fetch recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('userId', 'name email mobile')
      .lean();

    // 2. Fetch recent registered customers
    const recentUsers = await User.find({ role: 'CUSTOMER' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    // 3. Fetch security alerts
    const recentSecurity = await SecurityLog.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // 4. Fetch live chat messages requesting admin
    const pendingChatMessages = await ChatMessage.find({ needsAdmin: true, adminRead: false })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const notifications: Array<{
      id: string;
      category: 'PAYMENT' | 'ORDER' | 'CUSTOMER' | 'SERVICE' | 'SYSTEM';
      title: string;
      desc: string;
      time: string;
      rawDate: string;
      read: boolean;
      link: string;
    }> = [];

    // Map Orders & Payments
    recentOrders.forEach((o: any) => {
      const brandedId = formatOrderId(o._id, o.createdAt);
      const customerName = o.userId?.name || 'Customer';
      const serviceTitle = o.services?.[0]?.title || 'Digital Service';
      const serviceCount = o.services?.length || 1;
      const serviceSummary = serviceCount > 1 ? `${serviceTitle} + ${serviceCount - 1} more` : serviceTitle;

      if (o.paymentStatus === 'PAID') {
        notifications.push({
          id: `pay-${o._id}`,
          category: 'PAYMENT',
          title: `Payment Received (₹${o.total})`,
          desc: `UPI payment verified for Order ${brandedId} · ${customerName}`,
          time: formatRelativeTime(o.updatedAt || o.createdAt),
          rawDate: o.updatedAt || o.createdAt,
          read: o.orderStatus === 'COMPLETED',
          link: `/admin/orders?search=${encodeURIComponent(brandedId)}`,
        });
      } else {
        notifications.push({
          id: `order-${o._id}`,
          category: 'ORDER',
          title: `New Service Booking (${brandedId})`,
          desc: `${customerName} requested ${serviceSummary} (₹${o.total})`,
          time: formatRelativeTime(o.createdAt),
          rawDate: o.createdAt,
          read: o.orderStatus === 'COMPLETED',
          link: `/admin/orders?search=${encodeURIComponent(brandedId)}`,
        });
      }
    });

    // Map Customer Chat Requests
    pendingChatMessages.forEach((m: any) => {
      notifications.push({
        id: `chat-${m._id}`,
        category: 'SERVICE',
        title: `Live Support Request`,
        desc: `${m.senderName || 'Visitor'} requested human assistance in live chat`,
        time: formatRelativeTime(m.createdAt),
        rawDate: m.createdAt,
        read: false,
        link: '/admin/chat',
      });
    });

    // Map Registered Customers
    recentUsers.forEach((u: any) => {
      notifications.push({
        id: `user-${u._id}`,
        category: 'CUSTOMER',
        title: `New Customer Registered`,
        desc: `${u.name || 'Customer'} created an account (${u.email})`,
        time: formatRelativeTime(u.createdAt),
        rawDate: u.createdAt,
        read: false,
        link: `/admin/users?search=${encodeURIComponent(u.email || u.name || '')}`,
      });
    });

    // Map Security logs
    recentSecurity.forEach((s: any) => {
      notifications.push({
        id: `sec-${s._id}`,
        category: 'SYSTEM',
        title: `Security Log: ${s.action || s.event || 'Audit'}`,
        desc: `Action recorded from IP ${s.ip || 'system'} on ${s.endpoint || s.path || '/admin'}`,
        time: formatRelativeTime(s.createdAt || s.timestamp),
        rawDate: s.createdAt || s.timestamp,
        read: true,
        link: '/admin/security-logs',
      });
    });

    // Sort all by timestamp descending
    notifications.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
