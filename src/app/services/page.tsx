import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { ServicesCatalogClient } from "@/components/services/ServicesCatalogClient";
import { ensureServicesSeeded, INITIAL_SERVICES } from "@/lib/seedServices";
import type { Metadata } from "next";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Catalog | Sandy Digital Hub",
  description: "Browse our complete catalog of digital services, Jan Seva applications, and tax services.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  let serializedServices: any[] = [];

  try {
    await connectDB();
    await ensureServicesSeeded();
    const services = await Service.find({ status: 'ACTIVE' }).sort({ category: 1, title: 1 }).lean();
    
    // Deduplicate by title to ensure no service appears twice
    const uniqueMap = new Map();
    for (const item of services) {
      if (!uniqueMap.has(item.title)) {
        uniqueMap.set(item.title, item);
      }
    }
    serializedServices = JSON.parse(JSON.stringify(Array.from(uniqueMap.values())));
  } catch (err) {
    console.error('Failed to load services from DB, falling back to static services:', err);
    const uniqueMap = new Map();
    for (const s of INITIAL_SERVICES) {
      if (!uniqueMap.has(s.title)) {
        uniqueMap.set(s.title, s);
      }
    }
    serializedServices = Array.from(uniqueMap.values()).map((s, idx) => ({
      _id: `seed-${idx}`,
      ...s,
    }));
  }

  return (
    <div className="min-h-screen pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* ── Page Hero Header ── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-[#7C3AED] text-xs font-black uppercase tracking-wider shadow-2xs">
            <Zap size={14} className="fill-[#7C3AED]" /> Official Service Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Digital Services <span className="text-[#7C3AED]">Catalog</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Choose from our complete range of certified online applications, Jan Seva Kendra services, GST/ITR filing, and document processing.
          </p>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              ⚡ Fast 24-48h Processing
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              🔒 100% Secure & Verified
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              📍 Doorstep / Shop Delivery
            </span>
          </div>
        </div>

        {/* ── Interactive Catalog Client (Search, Filters, Responsive Grid) ── */}
        <ServicesCatalogClient initialServices={serializedServices} />
      </div>
    </div>
  );
}
