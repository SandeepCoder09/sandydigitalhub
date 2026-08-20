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
    <section className="py-16 sm:py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-[#7C3AED] text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Popular Citizen Facilitation Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Digital Services Made <span className="text-[#7C3AED]">Simple & Accessible</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Transparent pricing, clear document checklists, and verified facilitation support for everyday citizen needs.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {citizenServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={item}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-2 flex flex-col justify-between hover:-translate-y-1">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] border border-purple-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      {service.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#7C3AED] transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex flex-col flex-grow justify-between space-y-4">
                    <CardDescription className="text-xs text-slate-600 font-medium leading-relaxed">
                      {service.desc}
                    </CardDescription>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Link href={service.link} className="text-xs font-black text-[#7C3AED] hover:underline inline-flex items-center gap-1">
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link href="/services">
                        <Button size="sm" variant="ghost" className="h-7 px-2.5 text-[11px] font-bold rounded-xl text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50">
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
