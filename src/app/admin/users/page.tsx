import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Partner } from "@/models/Partner";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { isProtectedSuperAdmin } from "@/lib/rbac";

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || '';

  if (!session || !isProtectedSuperAdmin(userRole)) {
    redirect("/login");
  }

  let users: any[] = [];
  let partners: any[] = [];

  try {
    await connectDB();
    const [rawUsers, rawPartners] = await Promise.all([
      User.find().select('-password -resetPasswordToken').sort({ createdAt: -1 }).lean(),
      Partner.find({ status: { $in: ['ACTIVE', 'PENDING'] } }).select('_id name branchCode city state').lean(),
    ]);

    users = rawUsers;
    partners = rawPartners.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      branchCode: p.branchCode,
      city: p.city,
      state: p.state,
    }));
  } catch (err) {
    console.error('Failed to load users:', err);
  }

  const currentUser = {
    id: (session.user as any).id || '',
    email: session.user.email || '',
    role: userRole,
    name: session.user.name || 'Super Admin',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Manage User Accounts</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Role-Based Access Control & User Administration ({users.length} total registered accounts)
          </p>
        </div>
      </div>

      <AdminUsersManager
        initialUsers={JSON.parse(JSON.stringify(users))}
        initialPartners={JSON.parse(JSON.stringify(partners))}
        currentUser={currentUser}
      />
    </div>
  );
}
