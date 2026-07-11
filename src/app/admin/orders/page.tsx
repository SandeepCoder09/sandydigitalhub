import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import OrderRow from "./OrderRow";

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email mobile');

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#111111] p-6 rounded-2xl border border-white/10 h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Dashboard</Link>
            <Link href="/admin/services" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Services</Link>
            <Link href="/admin/orders" className="text-[#FF7A00] bg-white/5 px-4 py-2 rounded-lg font-medium">Manage Orders</Link>
            <Link href="/admin/users" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Users</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-8">All Orders</h1>
          
          <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order: any) => (
                    <OrderRow key={order._id.toString()} order={JSON.parse(JSON.stringify(order))} />
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
