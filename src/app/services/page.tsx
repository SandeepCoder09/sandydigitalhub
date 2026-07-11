import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Catalog | Sandy Digital Hub",
  description: "Browse our complete catalog of digital services.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await connectDB();
  const services = await Service.find({ status: 'ACTIVE' }).sort({ category: 1, title: 1 });

  // Group services by category
  const categories = services.reduce((acc: any, service: any) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Service Catalog</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Choose from our wide range of premium digital services. Add to cart and checkout securely.
          </p>
        </div>

        {Object.keys(categories).length === 0 ? (
          <div className="text-center py-20 text-white/40">
            No services currently active.
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(categories).map(([category, items]: [string, any]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/10">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((service: any) => (
                    <ServiceCard key={service._id.toString()} service={JSON.parse(JSON.stringify(service))} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
