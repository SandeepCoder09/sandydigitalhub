import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  await connectDB();
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <AdminUsersManager initialUsers={JSON.parse(JSON.stringify(users))} />
        </div>
      </div>
    </div>
  );
}
