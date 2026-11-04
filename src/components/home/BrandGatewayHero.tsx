'use client';

import Link from 'next/link';
import { ShieldCheck, Code2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function BrandGatewayHero() {
  return (
    <section className="py-3 sm:py-8 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl sm:rounded-4xl mx-2.5 sm:mx-6 my-2 sm:my-4 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-8 relative z-10 text-center">
        {/* Header Badge & Title */}
        <div className="space-y-1 sm:space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <Sparkles size={11} className="text-purple-400 sm:w-[13px] sm:h-[13px]" />
            <span>Dual Digital Ecosystem</span>
          </div>
          <h2 className="text-base sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            One Ecosystem. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">Two Specialized Platforms.</span>
          </h2>
          <p className="hidden sm:block text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            Choose the service that matches your needs — trusted digital assistance for everyday citizen services or professional technology solutions for your business.
          </p>
        </div>

        {/* ── Two Primary Brand Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-6 text-left">
          {/* Card 1: SANDY DIGITAL HUB */}
          <Link
            href="/services"
            className="group relative min-w-0 p-2.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#24143d] to-[#151027] border border-purple-400/40 sm:border-2 hover:border-purple-400 transition-all duration-300 shadow-xl flex flex-col justify-between items-stretch gap-2 sm:gap-4 hover:-translate-y-0.5 md:hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0 sm:block sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-inner shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="hidden md:inline-block px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider">
                  Citizen Services
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 md:block">
                  <h3 className="text-[10px] leading-tight sm:text-xl font-black text-white group-hover:text-purple-300 transition-colors break-words">
                    SANDY DIGITAL HUB
                  </h3>
                  <span className="md:hidden px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold shrink-0">
                    Citizen
                  </span>
                </div>
                <div className="text-[9px] sm:text-xs font-semibold text-purple-300 mt-0.5 leading-tight">
                  Online Forms & Citizen Services
                </div>
              </div>

              <p className="hidden md:block text-sm text-slate-300 leading-relaxed">
                Get professional assistance with online applications, documents, government form facilitation, photos, and free digital utility tools.
              </p>

              {/* Service Highlights (Desktop only) */}
              <div className="hidden md:grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span className="truncate">Online Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span className="truncate">PAN Card Facilitation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span className="truncate">Exam & Forms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span className="truncate">Image & PDF Tools</span>
                </div>
              </div>
            </div>

            <div className="w-full shrink-0 sm:pt-2">
              <div className="w-full py-1.5 px-2 sm:py-3 sm:px-5 rounded-lg sm:rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-[10px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-purple-900/40">
                <span className="hidden sm:inline">Explore Digital Services</span>
                <span className="sm:hidden">Explore</span>
                <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: SARA DIGITAL STUDIO */}
          <Link
            href="/studio"
            className="group relative min-w-0 p-2.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#15243c] to-[#151027] border border-cyan-400/40 sm:border-2 hover:border-cyan-400 transition-all duration-300 shadow-xl flex flex-col justify-between items-stretch gap-2 sm:gap-4 hover:-translate-y-0.5 md:hover:-translate-y-1 cursor-pointer"
          >
            <div className="flex items-center md:block gap-3 flex-1 min-w-0 md:space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-cyan-600/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-inner shrink-0">
                  <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="hidden md:inline-block px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-black uppercase tracking-wider">
                  Technology & Software
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 md:block">
                  <h3 className="text-[10px] leading-tight sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors break-words">
                    SARA DIGITAL STUDIO
                  </h3>
                  <span className="md:hidden px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold shrink-0">
                    Tech & Dev
                  </span>
                </div>
                <div className="text-[9px] sm:text-xs font-semibold text-cyan-300 mt-0.5 leading-tight">
                  Websites, Web Apps & Software
                </div>
              </div>

              <p className="hidden md:block text-sm text-slate-300 leading-relaxed">
                We design and build high-performance websites, custom web applications, mobile platforms, and bespoke digital experiences.
              </p>

              {/* Service Highlights (Desktop only) */}
              <div className="hidden md:grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span className="truncate">Custom Websites & UI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span className="truncate">Fullstack Web Apps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span className="truncate">Mobile Applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                  <span className="truncate">Tailored Tech Solutions</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 md:w-full md:pt-6">
              <div className="w-full py-1.5 px-2 sm:py-3 sm:px-5 rounded-lg sm:rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 text-white font-extrabold text-[10px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-indigo-900/40">
                <span className="hidden sm:inline">Explore Digital Studio</span>
                <span className="sm:hidden">Explore</span>
                <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
