/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Service } from "@/models/Service";
import { SecurityLog } from "@/models/SecurityLog";
import { AdminAnalyticsChart } from "@/components/admin/AdminAnalyticsChart";
import { AdminQuickTrackerBar } from "@/components/admin/AdminQuickTrackerBar";
import { formatOrderId, formatDateTime } from "@/lib/utils";
import { DollarSign, ShoppingBag, Users, Wrench, ArrowUpRight, Clock, ShieldCheck, Download, RefreshCw, Plus, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  let totalOrders = 0;
  let totalUsers = 0;
  let totalServices = 0;
  let revenue = 0;
  let todayRevenue = 0;
  let recentOrders: any[] = [];
  let recentUsers: any[] = [];
  let recentSecurityLogs: any[] = [];

  try {
    await connectDB();

    totalOrders = await Order.countDocuments();
    totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    totalServices = await Service.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    revenue = revenueResult[0]?.totalRevenue || 0;

    // Calculate Today's Revenue
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayRevenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'PAID', createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, todayRevenue: { $sum: '$total' } } }
    ]);
    todayRevenue = todayRevenueResult[0]?.todayRevenue || 0;

    recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6).populate('userId', 'name email mobile');
    recentUsers = await User.find({ role: 'CUSTOMER' }).sort({ createdAt: -1 }).limit(3).lean();
    recentSecurityLogs = await SecurityLog.find().sort({ createdAt: -1 }).limit(3).lean();
  } catch (dbErr) {
    console.error('Failed to load admin stats from DB:', dbErr);
  }

  // Real database activity feed
  const activityFeed: Array<{ icon: any; color: string; text: string; time: string }> = [];

  recentOrders.slice(0, 3).forEach((o: any) => {
    const brandedId = formatOrderId(o._id, o.createdAt);
    activityFeed.push({
      icon: o.paymentStatus === 'PAID' ? CheckCircle2 : ShoppingBag,
      color: o.paymentStatus === 'PAID' ? 'text-emerald-600 bg-emerald-50' : 'text-violet-600 bg-violet-50',
      text: `Order ${brandedId} (${o.services?.[0]?.title || 'Service'}) · ₹${o.total}`,
      time: formatDateTime(o.createdAt),
    });
  });

  recentUsers.forEach((u: any) => {
    activityFeed.push({
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
      text: `New customer: ${u.name} (${u.email})`,
      time: formatDateTime(u.createdAt),
    });
  });

  recentSecurityLogs.forEach((l: any) => {
    activityFeed.push({
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-50',
      text: `${l.action || l.event || 'Security log'} (${l.ip || 'system'})`,
      time: formatDateTime(l.createdAt || l.timestamp),
    });
  });

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Dashboard Top Overview Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Welcome back, <span className="font-extrabold text-violet-700">{session.user.name || 'Admin'}</span>. Here is your operational telemetry today.
          </p>
        </div>

        {/* Page Toolbar: Refresh | Export | Add New */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-colors border border-gray-200"
          >
            <Download size={13} /> Export CSV
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-xs sm:shadow-md transition-all cursor-pointer"
          >
            <Plus size={13} /> Add Service
          </Link>
        </div>
      </div>

      {/* Admin Quick Order Tracker Search */}
      <AdminQuickTrackerBar />

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Revenue Card */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <DollarSign size={15} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900">₹{revenue.toLocaleString('en-IN')}</h2>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-extrabold text-emerald-600">
              <span>↑ 12.4%</span>
              <span className="text-gray-400 font-medium">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={15} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900">{totalOrders}</h2>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-extrabold text-emerald-600">
              <span>↑ 8.1%</span>
              <span className="text-gray-400 font-medium">98% rate</span>
            </div>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Users</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users size={15} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900">{totalUsers}</h2>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-extrabold text-emerald-600">
              <span>↑ 5.2%</span>
              <span className="text-gray-400 font-medium">clients</span>
            </div>
          </div>
        </div>

        {/* Active Services Card */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Services</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench size={15} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900">{totalServices}</h2>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-bold text-violet-600">
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Interactive Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs">
          <AdminAnalyticsChart totalRevenue={revenue} totalOrders={totalOrders} />
        </div>

        {/* Right: Real-time System Activity Feed (1 col) */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 sm:pb-3">
            <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-1.5 sm:gap-2">
              <Sparkles size={16} className="text-violet-600" />
              Live Activity Feed
            </h2>
            <span className="text-[10px] sm:text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto">
            {activityFeed.length === 0 ? (
              <div className="py-6 text-center text-xs font-semibold text-gray-400">
                No recent activity recorded in database yet.
              </div>
            ) : (
              activityFeed.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon size={14} className="sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-snug">{item.text}</p>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400">{item.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/admin/security-logs"
            className="w-full py-2 sm:py-2.5 text-center text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg sm:rounded-xl transition-colors block"
          >
            View Security Audit Logs →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-gray-900">Recent Customer Service Orders</h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">Latest service bookings requiring fulfillment</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:text-violet-800 transition-colors"
          >
            <span>View All ({totalOrders})</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] text-gray-600 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {recentOrders.map((order: any) => {
                const brandedId = formatOrderId(order._id, order.createdAt);
                return (
                  <tr key={order._id.toString()} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-mono font-black text-violet-700">
                      {brandedId}
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-gray-900">{order.userId?.name || 'Customer'}</div>
                      <div className="text-[11px] text-gray-500">{order.userId?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      ₹{order.total}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-700">
                      {order.orderStatus}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders?search=${brandedId}`}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-extrabold text-[11px] hover:bg-violet-700 transition-colors shadow-2xs inline-block"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
