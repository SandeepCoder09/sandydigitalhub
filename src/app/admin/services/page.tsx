/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { AdminServicesManager } from "@/components/admin/AdminServicesManager";

export default async function AdminServices() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  await connectDB();
  const services = await Service.find().sort({ createdAt: -1 });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#111111] p-6 rounded-2xl border border-white/10 h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Dashboard</Link>
            <Link href="/admin/services" className="text-[#FF7A00] bg-white/5 px-4 py-2 rounded-lg font-medium">Manage Services</Link>
            <Link href="/admin/orders" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Orders</Link>
            <Link href="/admin/users" className="text-white/60 hover:text-white px-4 py-2 transition-colors">Manage Users</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AdminServicesManager initialServices={JSON.parse(JSON.stringify(services))} />
        </div>
      </div>
    </div>
  );
}
