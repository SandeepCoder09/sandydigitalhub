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
  const user = await User.findById(session.user.id).lean();
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen pt-8 sm:pt-14 pb-16 sm:pb-20 px-3 sm:px-6 md:px-8 bg-gray-50/60">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">My Requested Services</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Track your order statuses, payment updates, and download invoices.</p>
          </div>
          {from === 'account' && (
            <Link href="/account" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#7C3AED] bg-gray-50 hover:bg-purple-50 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold w-fit transition-colors">
              <ArrowLeft size={14} />
              Account Settings
            </Link>
          )}
        </div>

        {payment === 'pending' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 flex items-center gap-3">
            <Clock size={20} className="text-yellow-600" />
            <span>Order created! Please visit Sandy Digital Hub shop to complete payment and collect your service.</span>
          </div>
        )}

        {payment === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-xl text-green-800 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-600" />
            <span>Payment successful! Your requested service order has been confirmed.</span>
          </div>
        )}

        {payment === 'failed' && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 flex items-center gap-3">
            <XCircle size={20} className="text-red-600" />
            <span>Payment failed or was cancelled. Please try again or contact support.</span>
          </div>
        )}

        <div className="space-y-4">
          <RequestsTable 
            orders={JSON.parse(JSON.stringify(orders))} 
            user={JSON.parse(JSON.stringify(user))} 
          />
        </div>
      </div>
    </div>
  );
}
