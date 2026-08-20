import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { AdminServicesManager } from "@/components/admin/AdminServicesManager";
import { ensureServicesSeeded } from "@/lib/seedServices";

export default async function AdminServices() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect("/login");
  }

  let services: any[] = [];
  try {
    await connectDB();
    await ensureServicesSeeded();
    services = await Service.find().sort({ createdAt: -1 }).lean();
  } catch (err) {
    console.error('Failed to load services:', err);
  }

  return (
    <div className="space-y-6">
      <AdminServicesManager initialServices={JSON.parse(JSON.stringify(services))} />
    </div>
  );
}
