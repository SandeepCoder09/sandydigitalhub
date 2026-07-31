/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Service } from "@/models/Service";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAnalyticsChart } from "@/components/admin/AdminAnalyticsChart";
import { AdminQuickTrackerBar } from "@/components/admin/AdminQuickTrackerBar";
import { formatOrderId } from "@/lib/utils";

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

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard Overview</h1>
          
          <AdminQuickTrackerBar />

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Revenue</p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FF4500]">₹{revenue.toFixed(2)}</h3>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Orders</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalOrders}</h3>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Customers</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Active Services</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{totalServices}</h3>
            </div>
          </div>

          {/* Revenue Analytics Chart */}
          <div className="mb-6 sm:mb-8">
            <AdminAnalyticsChart totalRevenue={revenue} totalOrders={totalOrders} />
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-[#FF4500] text-xs sm:text-sm font-semibold hover:underline">
                View All →
              </Link>
            </div>

            {/* Mobile List View (< md) */}
            <div className="block md:hidden space-y-3">
              {recentOrders.map((order: any) => {
                const brandedId = formatOrderId(order._id, order.createdAt);
                return (
                  <div key={order._id.toString()} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-[#FF4500]">{brandedId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-700 font-medium">{order.userId?.name || 'Customer'}</span>
                      <span className="font-bold text-[#FF4500]">₹{order.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-gray-700">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="pb-4">Branded Order ID</th>
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order: any) => (
                    <tr key={order._id.toString()}>
                      <td className="py-4 font-mono font-bold text-gray-900">{formatOrderId(order._id, order.createdAt)}</td>
                      <td className="py-4">{order.userId?.name || 'Unknown'}</td>
                      <td className="py-4 font-bold text-[#FF4500]">₹{order.total}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
