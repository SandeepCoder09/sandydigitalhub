import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { VisitorLog } from '@/models/VisitorLog';
import { SecurityLog } from '@/models/SecurityLog';
import { SiteControl } from '@/models/SiteControl';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    await connectDB();

    // Gather Live System Context
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: 'PAID' }).lean();
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalUsers = await User.countDocuments();
    const siteControl = await SiteControl.findOne().lean();
    const visitorCount = await VisitorLog.countDocuments();
    const criticalThreats = await SecurityLog.countDocuments({ severity: 'CRITICAL' });

    const q = query.toLowerCase().trim();
    let reply = '';
    let quickActions: string[] = [];

    if (q.includes('sales') || q.includes('revenue') || q.includes('order')) {
      reply = `📊 **Sales & Revenue Summary**:\n- Total Orders Placed: **${totalOrders}**\n- Total Revenue Collected: **₹${totalRevenue.toFixed(2)}**\n- Paid Orders: **${paidOrders.length}**\n- Total Registered Customers: **${totalUsers}**`;
      quickActions = ['Check security firewall status', 'What are top visited pages?'];
    } else if (q.includes('security') || q.includes('firewall') || q.includes('lockdown') || q.includes('threat')) {
      const isLockdown = siteControl?.isEmergencyLockdown ? '🚨 ACTIVE' : '✅ NORMAL';
      const fileUploads = siteControl?.allowFileUploads ? 'Allowed' : 'Restricted';
      const blockedPagesCount = siteControl?.blockedPages?.length || 0;
      const blockedIpsCount = siteControl?.blockedIps?.length || 0;

      reply = `🛡️ **Firewall & Security Status**:\n- Lockdown Mode: **${isLockdown}**\n- File Uploads: **${fileUploads}**\n- Blocked Page Routes: **${blockedPagesCount}**\n- Blocked IP Addresses: **${blockedIpsCount}**\n- Critical Threats Logged: **${criticalThreats}**`;
      quickActions = ['Show today sales & order summary', 'What are top visited pages?'];
    } else if (q.includes('visitor') || q.includes('traffic') || q.includes('top page') || q.includes('analytics')) {
      reply = `📈 **Traffic Analytics Overview**:\n- Total Lifetime Page Views: **${visitorCount}**\n- Total Registered Users: **${totalUsers}**\n- Site Protection: **Active**`;
      quickActions = ['Show today sales & order summary', 'Check security firewall status'];
    } else {
      reply = `🤖 **SUZU AI Admin Agent at your service!**\n\nI have real-time access to your store metrics:\n- 🛒 Total Orders: **${totalOrders}**\n- 💰 Total Revenue: **₹${totalRevenue.toFixed(2)}**\n- 👥 Registered Users: **${totalUsers}**\n- 🛡️ Firewall Status: **${siteControl?.isEmergencyLockdown ? 'Lockdown Active' : 'Active & Protecting'}**\n\nHow can I assist you with store management today?`;
      quickActions = ['Show today sales & order summary', 'Check security firewall status', 'What are top visited pages?'];
    }

    return NextResponse.json({
      reply,
      quickActions,
      context: {
        totalOrders,
        totalRevenue,
        totalUsers,
        isLockdown: !!siteControl?.isEmergencyLockdown,
      }
    });
  } catch (error: any) {
    console.error('Error in SUZU agent API:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
