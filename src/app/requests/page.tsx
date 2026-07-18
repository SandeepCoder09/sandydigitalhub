import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import Link from "next/link";
import { RequestsTable } from "@/components/dashboard/RequestsTable";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";

interface RequestsPageProps {
  searchParams: Promise<{ payment?: string; from?: string }>;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { payment, from } = await searchParams;

  await connectDB();
  const user = await User.findById(session.user.id);
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Requested Services</h1>
            <p className="text-white/60">Track your order statuses, payment updates, and download invoices.</p>
          </div>
          {from === 'account' && (
            <Link href="/account" className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-[#111111] px-4 py-2 rounded-xl border border-white/10 text-sm font-medium w-fit">
              <ArrowLeft size={16} />
              Account Settings
            </Link>
          )}
        </div>

        {payment === 'pending' && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-yellow-400 flex items-center gap-3">
            <Clock size={20} />
            <span>Order created! Please visit Sandy Digital Hub shop to complete payment and collect your service.</span>
          </div>
        )}

        {payment === 'success' && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-green-400 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span>Payment successful! Your requested service order has been confirmed.</span>
          </div>
        )}

        {payment === 'failed' && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 flex items-center gap-3">
            <XCircle size={20} />
            <span>Payment failed or was cancelled. Please try again or contact support.</span>
          </div>
        )}

        <div className="bg-[#111111] p-6 rounded-2xl border border-white/10">
          <RequestsTable 
            orders={JSON.parse(JSON.stringify(orders))} 
            user={JSON.parse(JSON.stringify(user))} 
          />
        </div>
      </div>
    </div>
  );
}
