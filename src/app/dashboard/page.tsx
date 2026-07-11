import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import Link from "next/link";
import { DownloadInvoiceButton } from "@/components/dashboard/DownloadInvoiceButton";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user?.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="bg-[#111111] p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Profile</h3>
              <div className="text-white/80">
                <p><span className="text-white/50">Email:</span> {user?.email}</p>
                <p><span className="text-white/50">Mobile:</span> {user?.mobile}</p>
              </div>
              <button className="text-[#FF7A00] text-left mt-4 hover:underline">Edit Profile</button>
              <button className="text-red-400 text-left mt-2 hover:underline">Logout</button>
            </div>
          </div>

          <div className="col-span-3">
            <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-white/50 text-center py-8">
                  <p>You have no orders yet.</p>
                  <Link href="/services" className="text-[#FF7A00] hover:underline mt-4 inline-block">Browse Services</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white/80">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Payment Method</th>
                        <th className="pb-4">Payment Status</th>
                        <th className="pb-4">Order Status</th>
                        <th className="pb-4">Total</th>
                        <th className="pb-4">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order._id.toString()}>
                          <td className="py-4 text-sm font-mono">{order._id.toString().slice(-8).toUpperCase()}</td>
                          <td className="py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 text-sm">
                            {order.paymentMethod === 'online' ? 'Pay Online' : 'Pay at Shop'}
                          </td>
                          <td className="py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' : 
                              order.paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 text-sm">
                            <span className="text-white/60">
                              {order.orderStatus === 'AWAITING_CUSTOMER_VISIT' ? 'Awaiting Visit' : order.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-bold text-[#FF7A00]">₹{order.total}</td>
                          <td className="py-4 text-sm">
                            {order.paymentStatus === 'PAID' ? (
                              <DownloadInvoiceButton order={JSON.parse(JSON.stringify(order))} user={JSON.parse(JSON.stringify(user))} />
                            ) : (
                              <span className="text-white/30">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
