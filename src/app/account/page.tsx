import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import Link from "next/link";
import { EditProfileForm } from "@/components/dashboard/EditProfileForm";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { ShoppingBag, User as UserIcon, ArrowRight } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">My Account</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Manage your profile details and preferences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="p-2.5 rounded-xl bg-purple-100 text-[#7C3AED]">
                  <UserIcon size={22} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <EditProfileForm user={JSON.parse(JSON.stringify({ name: user?.name, email: user?.email, mobile: user?.mobile }))} />
              
              <div className="pt-2 border-t border-gray-200">
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="p-2.5 rounded-xl bg-purple-100 text-[#7C3AED] w-fit mb-3 sm:mb-4">
                  <ShoppingBag size={22} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">My Requested Services</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
                  Track the status of your orders, service requests, and download invoices.
                </p>
              </div>
              <Link href="/requests?from=account" className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#7C3AED]/90 transition-colors w-full shadow-md shadow-purple-200">
                View Requests
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
