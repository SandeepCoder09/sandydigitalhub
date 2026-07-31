/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { AdminServicesManager } from "@/components/admin/AdminServicesManager";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ensureServicesSeeded } from "@/lib/seedServices";

export default async function AdminServices() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  await connectDB();
  await ensureServicesSeeded();
  const services = await Service.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <AdminServicesManager initialServices={JSON.parse(JSON.stringify(services))} />
        </div>
      </div>
    </div>
  );
}
