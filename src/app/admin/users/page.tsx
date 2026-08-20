import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  let users: any[] = [];
  try {
    await connectDB();
    users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
  } catch (err) {
    console.error('Failed to load users:', err);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Manage User Accounts</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Audit registered customer accounts, roles, and status ({users.length} total users)
          </p>
        </div>
      </div>

      <AdminUsersManager initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
