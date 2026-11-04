"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Headset, FileText, CreditCard, Globe, Wrench, Briefcase } from "lucide-react";

const highlights = [
  { label: "100% Secure", icon: ShieldCheck, color: "text-emerald-300" },
  { label: "Fast Processing", icon: Zap, color: "text-amber-300" },
  { label: "Expert Support", icon: Headset, color: "text-cyan-300" },
];

const orbitItems = [
  { label: "Forms", icon: FileText, color: "text-fuchsia-300", bg: "bg-fuchsia-500/15 border-fuchsia-400/30" },
  { label: "PAN", icon: CreditCard, color: "text-cyan-300", bg: "bg-cyan-500/15 border-cyan-400/30" },
  { label: "Web", icon: Globe, color: "text-emerald-300", bg: "bg-emerald-500/15 border-emerald-400/30" },
  { label: "Jobs", icon: Briefcase, color: "text-blue-300", bg: "bg-blue-500/15 border-blue-400/30" },
  { label: "Tools", icon: Wrench, color: "text-pink-300", bg: "bg-pink-500/15 border-pink-400/30" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#100B1D] text-white pt-7 pb-7 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16">
      <div className="pointer-events-none absolute -top-28 left-[12%] h-80 w-80 rounded-full bg-violet-600/20 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-7 lg:grid-cols-[1.02fr_.98fr] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="text-center lg:text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.13em] text-violet-200 sm:mb-5 sm:text-xs">
              <Sparkles size={13} className="text-fuchsia-300" /> One Digital Ecosystem
            </div>
            <h1 className="mb-3 text-[2rem] font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sandy Digital <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Hub</span>
            </h1>
            <p className="mb-2 text-sm font-semibold text-violet-100 sm:text-lg">
              Citizen Services · Online Forms · Utility Tools · Digital Solutions
            </p>
            <p className="mx-auto mb-5 max-w-xl text-xs leading-6 text-slate-300 sm:mb-7 sm:text-base sm:leading-7 lg:mx-0">
              A complete digital platform for government-service assistance, online applications, document solutions and modern technology services.
            </p>
            <div className="mb-5 flex flex-col justify-center gap-2.5 sm:flex-row lg:justify-start">
              <Link href="/services" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-violet-900/40 transition hover:-translate-y-0.5 hover:brightness-110">
                Explore Services <ArrowRight size={16} />
              </Link>
              <Link href="/track-order" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-violet-300/40 bg-white/[.04] px-5 text-sm font-bold text-violet-100 transition hover:bg-violet-500/15">
                <FileText size={16} /> Track Your Order
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              {highlights.map(({ label, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[.035] px-2 py-2 text-[10px] font-bold text-slate-200 sm:text-xs">
                  <Icon size={15} className={color} /> <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .12 }} className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-violet-300/25 bg-gradient-to-br from-[#24143d] via-[#151027] to-[#0d1229] p-2 shadow-[0_20px_70px_rgba(109,40,217,.22)] sm:p-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#17112a]">
                <Image src="/hero-dashboard.png" alt="Sandy Digital Hub digital services dashboard" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/55 via-transparent to-violet-900/10" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/15 bg-[#100b1d]/75 px-3 py-2 backdrop-blur-xl">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[.16em] text-violet-300">Your digital ecosystem</p>
                    <p className="text-xs font-extrabold text-white sm:text-sm">Everything in one place</p>
                  </div>
                  <div className="flex -space-x-1.5">
                    {orbitItems.slice(0, 3).map(({ label, icon: Icon, color }) => <span key={label} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#17112a] bg-[#30204b]"><Icon size={14} className={color} /></span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-2 top-3 hidden grid-cols-2 gap-2 sm:grid">
              {orbitItems.map(({ label, icon: Icon, color, bg }) => (
                <div key={label} className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[10px] font-bold shadow-xl backdrop-blur-xl ${bg} ${color}`}>
                  <Icon size={15} /> {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
