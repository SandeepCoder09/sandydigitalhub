"use client";

import { motion } from "framer-motion";
import { MousePointerClick, UploadCloud, FileCheck2, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WhyChooseUs() {
  const steps = [
    {
      num: "01",
      title: "Choose a Service",
      desc: "Browse our catalog and select the digital application or document service you need.",
      icon: MousePointerClick,
    },
    {
      num: "02",
      title: "Submit Your Details",
      desc: "Provide basic information and attach any required verification documents securely.",
      icon: UploadCloud,
    },
    {
      num: "03",
      title: "Review Requirements",
      desc: "Service requirements, timeline, and transparent official charges are confirmed.",
      icon: FileCheck2,
    },
    {
      num: "04",
      title: "Workflow Processing",
      desc: "Your application is accurately processed through the authorized departmental portal.",
      icon: Cpu,
    },
    {
      num: "05",
      title: "Receive Updates",
      desc: "Track status live with your Request ID and download completed certificates/receipts.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-8 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-purple-100 border border-purple-200 text-[#7C3AED] text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <span>Transparent Facilitation Workflow</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            How Our Service <span className="text-[#7C3AED]">Works</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-medium leading-relaxed">
            Follow 5 simple steps from selecting your required service to tracking your completed certificate or application online.
          </p>
        </div>

        {/* ── 5-Step Process Grid / Timeline ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="relative p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200/90 hover:border-purple-300 transition-all duration-300 flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-0 justify-between group shadow-2xs hover:shadow-md"
              >
                <div className="flex items-center md:block gap-3 flex-1 min-w-0 md:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-2xl font-black text-[#7C3AED] sm:text-slate-300 group-hover:text-[#7C3AED] transition-colors font-mono shrink-0">
                      {s.num}
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-[#7C3AED] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#7C3AED] group-hover:text-white transition-all shadow-2xs shrink-0">
                      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#7C3AED] transition-colors truncate md:whitespace-normal">
                      {s.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-snug sm:leading-relaxed font-medium line-clamp-1 sm:line-clamp-none">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Trigger */}
        <div className="mt-6 sm:mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
          <Link href="/services" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-7 rounded-xl sm:rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-md shadow-purple-500/20">
              <span>Start Service Request</span>
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </Link>
          <Link href="/document-checklist" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 rounded-xl sm:rounded-2xl border-slate-300 text-slate-700 hover:text-[#7C3AED] hover:border-[#7C3AED] hover:bg-purple-50 font-bold text-xs">
              Check Required Documents
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
