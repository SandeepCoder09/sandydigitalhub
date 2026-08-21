import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { AccountDashboardClient } from "@/components/dashboard/AccountDashboardClient";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/login");
  }

  const [totalOrders, processingOrders, completedOrders] = await Promise.all([
    Order.countDocuments({ userId: session.user.id }),
    Order.countDocuments({ userId: session.user.id, orderStatus: { $in: ['PENDING', 'PROCESSING', 'AWAITING_CUSTOMER_VISIT'] } }),
    Order.countDocuments({ userId: session.user.id, orderStatus: 'COMPLETED' }),
  ]);

  return (
    <div className="min-h-screen pt-8 sm:pt-14 pb-16 sm:pb-20 px-3 sm:px-6 md:px-8 bg-slate-50/60">
      <div className="max-w-5xl mx-auto space-y-6">
        <AccountDashboardClient
          user={{
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
          }}
          stats={{
            totalOrders,
            processingOrders,
            completedOrders,
          }}
        />
      </div>
    </div>
  );
}

