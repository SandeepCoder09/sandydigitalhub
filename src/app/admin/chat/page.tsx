import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { AdminChatInbox } from "@/components/admin/AdminChatInbox";

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Live Support Chat Inbox</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Reply to customer inquiries and live chat sessions in real-time
          </p>
        </div>
      </div>

      <AdminChatInbox />
    </div>
  );
}
