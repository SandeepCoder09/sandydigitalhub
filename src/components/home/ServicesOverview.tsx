"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CreditCard, GraduationCap, Briefcase, Camera, Printer, Award, FileSpreadsheet, Sparkles } from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const iconTones = [
  "from-cyan-500 to-blue-600 shadow-cyan-950/40",
  "from-violet-500 to-fuchsia-600 shadow-violet-950/40",
  "from-emerald-500 to-green-600 shadow-emerald-950/40",
  "from-pink-500 to-fuchsia-600 shadow-pink-950/40",
  "from-orange-500 to-rose-600 shadow-orange-950/40",
  "from-sky-500 to-indigo-600 shadow-sky-950/40",
  "from-amber-500 to-orange-600 shadow-amber-950/40",
  "from-blue-500 to-violet-600 shadow-blue-950/40",
];

export function ServicesOverview() {
  const citizenServices = [
    {
      title: "Online Applications",
      desc: "Get fast assistance completing state & national government application forms.",
      icon: FileText,
      link: "/services",
      badge: "Popular",
    },
    {
      title: "PAN Services",
      desc: "New PAN Card registration, minor to major conversion, and duplicate correction.",
      icon: CreditCard,
      link: "/services",
      badge: "Essential",
    },
    {
      title: "Exam & Admission Forms",
      desc: "Professional assistance completing university, board, and competitive exam forms.",
      icon: GraduationCap,
      link: "/services",
    },
    {
      title: "Resume & CV Services",
      desc: "Create clean, ATS-friendly resumes and job bio-data for employment opportunities.",
      icon: Briefcase,
      link: "/services",
    },
    {
      title: "Passport Photos",
      desc: "Create properly sized digital passport photographs tailored to portal dimensions.",
      icon: Camera,
      link: "/tools/govt-photo-resizer",
    },
    {
      title: "Document Services",
      desc: "High-resolution scanning, certified printing, and digital document preparation.",
      icon: Printer,
      link: "/services",
    },
    {
      title: "Scholarship Forms",
      desc: "Assistance with UP Scholarship, National Scholarship Portal (NSP), and fee waivers.",
      icon: Award,
      link: "/services",
    },
    {
      title: "Free Image & PDF Tools",
      desc: "Resize, compress, convert and format your images and PDFs directly in your browser.",
      icon: FileSpreadsheet,
      link: "/tools",
      badge: "Free",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#100B1D] py-8 text-white sm:py-16">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-200 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <Sparkles size={12} className="sm:w-[13px] sm:h-[13px]" />
            <span>Popular Citizen Facilitation Services</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Digital Services Made <span className="text-violet-300">Simple & Accessible</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-300 font-medium leading-relaxed">
            Transparent pricing, clear document checklists, and verified facilitation support for everyday citizen needs.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6"
        >
          {citizenServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={item}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden bg-gradient-to-br from-[#24183a] to-[#171027] text-white border border-violet-300/25 hover:border-violet-300/60 rounded-2xl sm:rounded-3xl p-1 sm:p-2 flex flex-col justify-between hover:-translate-y-1 shadow-lg shadow-black/20">
                  <CardHeader className="p-2.5 sm:p-4 pb-1 sm:pb-2">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                      <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${iconTones[index % iconTones.length]} text-white border border-white/15 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      {service.badge && (
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-200 border border-violet-300/25">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xs sm:text-lg font-black text-white group-hover:text-violet-200 transition-colors leading-snug sm:leading-normal line-clamp-1 sm:line-clamp-none">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2.5 sm:p-4 pt-0 flex flex-col flex-grow justify-between space-y-2 sm:space-y-4">
                    <CardDescription className="text-[10px] sm:text-xs text-slate-300 font-medium leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {service.desc}
                    </CardDescription>
                    <div className="pt-1.5 sm:pt-2 border-t border-violet-300/15 flex items-center justify-between">
                      <Link href={service.link} className="text-[10px] sm:text-xs font-black text-violet-300 hover:underline inline-flex items-center gap-0.5 sm:gap-1">
                        <span>Learn More</span>
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link href="/services" className="hidden sm:inline-block">
                        <Button size="sm" variant="ghost" className="h-7 px-2.5 text-[11px] font-bold rounded-xl text-slate-200 hover:text-white hover:bg-violet-500/15">
                          Start Service
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
