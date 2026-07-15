/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Services</h1>
            <button className="bg-[#FF7A00] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#FF7A00]/90 transition-colors">
              + Add Service
            </button>
          </div>
          
          <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map((service: any) => (
                    <tr key={service._id.toString()}>
                      <td className="p-4 font-medium text-white">{service.title}</td>
                      <td className="p-4 text-sm">{service.category}</td>
                      <td className="p-4 text-sm font-bold text-[#FF7A00]">₹{service.price}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          service.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm flex gap-3">
                        <button className="text-blue-400 hover:underline">Edit</button>
                        <button className="text-red-400 hover:underline">Delete</button>
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
