import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  let orders: any[] = [];
  try {
    await connectDB();
    orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email mobile').lean();
  } catch (err) {
    console.error('Failed to load orders:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">All Customer Orders</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Manage live status, document attachments, and customer details ({orders.length} total)
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="text-gray-400 text-xs py-8 font-semibold">Loading orders data...</div>}>
        <AdminOrdersTable initialOrders={JSON.parse(JSON.stringify(orders))} />
      </Suspense>
    </div>
  );
}
