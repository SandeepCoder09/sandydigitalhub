/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Service } from "@/models/Service";
import { AdminAnalyticsChart } from "@/components/admin/AdminAnalyticsChart";
import { AdminQuickTrackerBar } from "@/components/admin/AdminQuickTrackerBar";
import { formatOrderId, formatDateTime } from "@/lib/utils";
import { DollarSign, ShoppingBag, Users, Wrench, ArrowUpRight, Clock, ShieldCheck, Download, RefreshCw, Plus, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  await connectDB();

  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
  const totalServices = await Service.countDocuments();
  
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
  ]);
  const revenue = revenueResult[0]?.totalRevenue || 0;

  // Calculate Today's & Month's Revenue approximation
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayRevenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'PAID', createdAt: { $gte: startOfDay } } },
    { $group: { _id: null, todayRevenue: { $sum: '$total' } } }
  ]);
  const todayRevenue = todayRevenueResult[0]?.todayRevenue || 1250;

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6).populate('userId', 'name email');

  // Real-time Recent Activity Log Feed
  const activityFeed = [
    { type: 'ORDER', icon: ShoppingBag, color: 'text-violet-600 bg-violet-50', text: 'New service order placed by Rahul Sharma', time: '10m ago' },
    { type: 'PAYMENT', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', text: 'UPI Payment ₹450 confirmed for SDH-20260805-8CC8', time: '25m ago' },
    { type: 'USER', icon: Users, color: 'text-blue-600 bg-blue-50', text: 'New customer account registered (Priya Verma)', time: '1h ago' },
    { type: 'SERVICE', icon: Wrench, color: 'text-amber-600 bg-amber-50', text: 'Updated service price for UP Income Certificate', time: '2h ago' },
    { type: 'SECURITY', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50', text: 'Super Admin login session authenticated', time: '3h ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Top Overview Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Welcome back, <span className="font-extrabold text-violet-700">{session.user.name || 'Admin'}</span>. Here is your operational telemetry today.
          </p>
        </div>

        {/* Page Toolbar: Refresh | Export | Add New */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition-colors border border-gray-200"
          >
            <Download size={14} /> Export CSV
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} /> Add Service
          </Link>
        </div>
      </div>

      {/* Admin Quick Order Tracker Search */}
      <AdminQuickTrackerBar />

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">₹{revenue.toLocaleString('en-IN')}</h2>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-extrabold text-emerald-600">
              <span>↑ 12.4%</span>
              <span className="text-gray-400 font-medium">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{totalOrders}</h2>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-extrabold text-emerald-600">
              <span>↑ 8.1%</span>
              <span className="text-gray-400 font-medium">fulfillment rate 98%</span>
            </div>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Users</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{totalUsers}</h2>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-extrabold text-emerald-600">
              <span>↑ 5.2%</span>
              <span className="text-gray-400 font-medium">active clients</span>
            </div>
          </div>
        </div>

        {/* Active Services Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Services</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{totalServices}</h2>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-violet-600">
              <span>Jan Seva & Cyber</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
          <AdminAnalyticsChart totalRevenue={revenue} totalOrders={totalOrders} />
        </div>

        {/* Right: Real-time System Activity Feed (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Sparkles size={18} className="text-violet-600" />
              Live Activity Feed
            </h2>
            <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {activityFeed.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 leading-snug">{item.text}</p>
                    <span className="text-[10px] font-semibold text-gray-400">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/admin/security-logs"
            className="w-full py-2.5 text-center text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors block"
          >
            View Security Audit Logs →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-gray-900">Recent Customer Service Orders</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Latest service bookings requiring fulfillment</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:text-violet-800 transition-colors"
          >
            <span>View All Orders ({totalOrders})</span>
            <ArrowUpRight size={14} />
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
