/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email mobile').lean();

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">All Customer Orders</h1>
          <Suspense fallback={<div className="text-gray-400 text-sm py-8">Loading order lookup...</div>}>
            <AdminOrdersTable initialOrders={JSON.parse(JSON.stringify(orders))} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
