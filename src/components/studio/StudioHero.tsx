'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, Monitor, Smartphone, Layers, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudioHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Studio Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-950/40"
          >
            <Code2 size={15} className="text-violet-400" />
            <span>SANDY DIGITAL STUDIO · TECH & SOFTWARE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]"
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
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            From high-performance responsive websites to custom web applications and mobile platforms, Sandy Digital Studio helps businesses and creators turn ideas into polished digital products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <a href="#quote">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-violet-900/40 hover:scale-105 transition-all cursor-pointer">
                <span>Start Your Project</span>
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </a>

            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-7 rounded-2xl border-slate-700 hover:border-violet-500 text-white bg-slate-900/80 hover:bg-slate-800 font-bold text-sm transition-all hover:scale-105">
                <Layers size={16} className="mr-2 text-violet-400" />
                <span>View Our Work</span>
              </Button>
            </Link>
          </motion.div>

          {/* Technical Strengths */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-bold text-slate-400 border-t border-slate-800/80"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-violet-400" />
              <span>Modern Next.js & React</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-violet-400" />
              <span>Fullstack Web & API Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-violet-400" />
              <span>Mobile-First UX Design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-violet-400" />
              <span>SEO & Speed Optimized</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
