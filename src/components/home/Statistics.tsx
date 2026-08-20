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
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuePillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">{pillar.title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
