'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, Monitor, Smartphone, Layers, CheckCircle2, ArrowUpRight } from 'lucide-react';

export function StudioHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-8 pb-12 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-8">
          {/* Studio Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-slate-900/90 border border-violet-500/30 text-violet-300 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-950/40"
          >
            <Code2 size={13} className="text-violet-400 sm:w-[15px] sm:h-[15px]" />
            <span>SARA DIGITAL STUDIO · TECH & SOFTWARE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
          >
            We Build Digital Experiences That{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
              Move Businesses Forward.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            From high-performance responsive websites to custom web applications and mobile platforms, Sara Digital Studio helps businesses and creators turn ideas into polished digital products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2"
          >
            <a
              href="#quote"
              className="inline-flex items-center justify-center w-full sm:w-auto h-11 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-violet-900/40 hover:scale-105 transition-all cursor-pointer text-center"
            >
              <span>Start Your Project</span>
              <ArrowRight size={14} className="ml-2 sm:w-4 sm:h-4" />
            </a>

            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center w-full sm:w-auto h-11 sm:h-14 px-5 sm:px-7 rounded-xl sm:rounded-2xl border border-slate-700 hover:border-violet-500 text-white bg-slate-900/80 hover:bg-slate-800 font-bold text-xs sm:text-sm transition-all hover:scale-105 text-center"
            >
              <Layers size={14} className="mr-2 text-violet-400 sm:w-4 sm:h-4" />
              <span>View Our Work</span>
            </Link>
          </motion.div>

          {/* Technical Strengths */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 sm:pt-6 text-[10px] sm:text-xs font-bold text-slate-400 border-t border-slate-800/80"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={13} className="text-violet-400 sm:w-[15px] sm:h-[15px]" />
              <span>Modern Next.js & React</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={13} className="text-violet-400 sm:w-[15px] sm:h-[15px]" />
              <span>Fullstack Web & API</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={13} className="text-violet-400 sm:w-[15px] sm:h-[15px]" />
              <span>Mobile-First UX</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={13} className="text-violet-400 sm:w-[15px] sm:h-[15px]" />
              <span>SEO & Speed</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
