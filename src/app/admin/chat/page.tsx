import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminChatInbox } from "@/components/admin/AdminChatInbox";

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-4 sm:pb-6 px-4 sm:px-6 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Support Chat Inbox</h1>
              <p className="text-xs text-white/50 mt-1">Reply to real customer inquiries and live chat requests in real time.</p>
            </div>
          </div>

          <AdminChatInbox />
        </div>
      </div>
    </div>
  );
}
