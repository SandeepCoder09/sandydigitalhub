'use client';

import Link from 'next/link';
import { ShieldCheck, Code2, ArrowRight, Sparkles, CheckCircle2, Monitor, Wrench, Layers } from 'lucide-react';

export function BrandGatewayHero() {
  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl sm:rounded-4xl mx-3 sm:mx-6 my-4 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 text-center">
        {/* Header Badge & Title */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} className="text-purple-400" />
            <span>Dual Digital Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            One Digital Ecosystem. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">Two Specialized Experiences.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            Choose the service that matches your needs — trusted digital assistance for everyday citizen services or professional technology solutions for your business.
          </p>
        </div>

        {/* ── Two Primary Brand Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-left">
          {/* Card 1: SARA DIGITAL HUB */}
          <div className="group relative p-6 sm:p-7 rounded-3xl bg-slate-900/90 border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-inner">
                  <ShieldCheck size={26} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider">
                  Citizen Services
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                  SARA DIGITAL HUB
                </h3>
                <div className="text-xs font-bold text-purple-400 mt-0.5">
                  Digital Services for Everyone
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Get professional assistance with online applications, documents, government form facilitation, photos, and free digital utility tools.
              </p>

              {/* Service Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Online Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>PAN Card Facilitation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Exam & Admission Forms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Free Image & PDF Tools</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/services"
                className="w-full py-3 px-5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/40"
              >
                <span>Explore Digital Services</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Card 2: SANDY DIGITAL STUDIO */}
          <div className="group relative p-6 sm:p-7 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 hover:border-indigo-500 transition-all duration-300 shadow-xl flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-inner">
                  <Code2 size={26} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-black uppercase tracking-wider">
                  Technology & Software
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">
                  SANDY DIGITAL STUDIO
                </h3>
                <div className="text-xs font-bold text-indigo-400 mt-0.5">
                  Technology for Modern Businesses
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We design and build high-performance websites, custom web applications, mobile platforms, and bespoke digital experiences.
              </p>

              {/* Service Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span>Custom Websites & UI/UX</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span>Fullstack Web Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span>Mobile Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span>Tailored Tech Solutions</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/studio"
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-900/40"
              >
                <span>Explore Digital Studio</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
