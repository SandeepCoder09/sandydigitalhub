'use client';

import { motion } from 'framer-motion';
import { Search, Compass, Palette, Code2, CheckCircle2, Rocket } from 'lucide-react';

export function StudioProcess() {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'We conduct deep discovery sessions to understand your business objectives, target audience, and project goals.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Plan',
      desc: 'We define the technical architecture, data structures, wireframe schemas, and realistic milestone delivery timelines.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Design',
      desc: 'We craft intuitive Figma UI/UX designs, interactive prototypes, and custom brand design systems for review.',
      icon: Palette,
    },
    {
      num: '04',
      title: 'Build',
      desc: 'We develop clean, production-grade Next.js, React, and database systems adhering to modern software engineering standards.',
      icon: Code2,
    },
    {
      num: '05',
      title: 'Review',
      desc: 'Rigorous cross-device responsiveness testing, speed audits, security checks, and client acceptance revisions.',
      icon: CheckCircle2,
    },
    {
      num: '06',
      title: 'Launch & Support',
      desc: 'Smooth cloud deployment on Vercel/AWS, domain setup, analytics integration, and dedicated maintenance support.',
      icon: Rocket,
    },
  ];

  return (
    <section id="process" className="py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider">
            <Compass size={13} />
            <span>Structured Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Build Digital Products</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
            Our proven 6-step engineering framework ensures transparent communication, on-time delivery, and polished execution.
          </p>
        </div>

        {/* 6 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.35 }}
                className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/60 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-700 group-hover:text-violet-400 transition-colors font-mono">
                      {s.num}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 text-violet-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-inner">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-violet-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
