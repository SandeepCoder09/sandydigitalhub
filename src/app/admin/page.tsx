/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Service } from "@/models/Service";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  console.log("SERVER SESSION IN ADMIN:", JSON.stringify(session));

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
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#111111] p-6 rounded-2xl border border-white/10 h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="text-[#FF7A00] bg-white/5 px-4 py-2 rounded-lg font-medium">Dashboard</Link>
            <Link href="/admin/services" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Services</Link>
            <Link href="/admin/orders" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Orders</Link>
            <Link href="/admin/users" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Users</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-[#FF7A00]">₹{revenue.toFixed(2)}</h3>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-white">{totalOrders}</h3>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Total Customers</p>
              <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
            </div>
            <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Active Services</p>
              <h3 className="text-2xl font-bold text-white">{totalServices}</h3>
            </div>
          </div>

          <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <Link href="/admin/orders" className="text-[#FF7A00] text-sm hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="pb-4">Order ID</th>
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order: any) => (
                    <tr key={order._id.toString()}>
                      <td className="py-4 text-sm">{order._id.toString().slice(-8).toUpperCase()}</td>
                      <td className="py-4 text-sm">{order.userId?.name || 'Unknown'}</td>
                      <td className="py-4 text-sm font-bold">₹{order.total}</td>
                      <td className="py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
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
