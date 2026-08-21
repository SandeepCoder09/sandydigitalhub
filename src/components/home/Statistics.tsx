"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, PhoneCall, Lock } from "lucide-react";

const valuePillars = [
  {
    icon: FileCheck,
    title: "Clear Requirements",
    desc: "Pre-verified document checklists before application submission.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Process",
    desc: "Fixed service charges with zero hidden departmental markups.",
  },
  {
    icon: PhoneCall,
    title: "Direct Customer Support",
    desc: "Local desk and WhatsApp assistance throughout processing.",
  },
  {
    icon: Lock,
    title: "Secure Document Handling",
    desc: "Encrypted attachment uploads with strict client confidentiality.",
  },
];

export function Statistics() {
  return (
    <section className="py-8 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {valuePillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-2 sm:space-y-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Icon size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">{pillar.title}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 leading-snug sm:leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
