'use client';

import { motion } from 'framer-motion';
import { Monitor, Smartphone, Palette, ShoppingBag, Terminal, Sparkles, Layers, ArrowRight, Code2 } from 'lucide-react';
import Link from 'next/link';

export function StudioServices() {
  const services = [
    {
      icon: Monitor,
      title: 'Website Development',
      desc: 'High-performance, modern, responsive websites built with Next.js and Tailwind CSS tailored to your brand goals.',
      tags: ['Corporate Websites', 'Landing Pages', 'Portfolio Sites', 'SEO Architecture'],
    },
    {
      icon: Terminal,
      title: 'Web Applications',
      desc: 'Custom cloud applications, SaaS portals, internal dashboards, and client management workflows with real database backends.',
      tags: ['Fullstack Next.js', 'API Gateways', 'MongoDB / SQL', 'Admin Dashboards'],
    },
    {
      icon: Smartphone,
      title: 'Mobile Applications',
      desc: 'Cross-platform progressive web apps (PWAs) and hybrid mobile experiences built for engagement on any device.',
      tags: ['Progressive Web Apps', 'Responsive UIs', 'Offline Sync', 'Push Notifications'],
    },
    {
      icon: Palette,
      title: 'UI/UX Design & Branding',
      desc: 'Intuitive user experiences, wireframing, high-fidelity mockups, and cohesive visual identities that convert visitors.',
      tags: ['Figma Design', 'Design Systems', 'Monograms & Logos', 'Conversion Optimization'],
    },
    {
      icon: ShoppingBag,
      title: 'E-Commerce Solutions',
      desc: 'Complete online stores featuring product catalogs, secure checkout gateways (Razorpay/Stripe), and order management.',
      tags: ['Custom Stores', 'Payment Gateways', 'Inventory Tracking', 'Automated Invoices'],
    },
    {
      icon: Sparkles,
      title: 'Custom Digital Solutions',
      desc: 'Bespoke automation scripts, custom AI tool integrations, document processing workflows, and API integrations.',
      tags: ['Gemini AI Integration', 'Custom Webhooks', 'Database Migrations', 'Performance Audits'],
    },
  ];

  return (
    <section id="services" className="py-8 sm:py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <Code2 size={12} className="sm:w-[13px] sm:h-[13px]" />
            <span>Studio Capabilities</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            End-to-End <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Software & Design</span> Services
          </h2>
          <p className="text-xs sm:text-base text-slate-400 font-medium leading-relaxed">
            From initial strategy to code deployment, we engineer digital solutions built for long-term scalability and business growth.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/80 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/30"
              >
                <div className="space-y-2.5 sm:space-y-4">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <Icon size={18} className="sm:w-[22px] sm:h-[22px]" />
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white group-hover:text-violet-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-snug sm:leading-relaxed font-medium">
                    {s.desc}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-2">
                    {s.tags.map((tag) => (
                      <span key={tag} className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 sm:pt-6 border-t border-slate-800/80 mt-3 sm:mt-6">
                  <a href="#quote" className="text-xs font-black text-violet-400 group-hover:text-violet-300 inline-flex items-center gap-1.5">
                    <span>Enquire for this service</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
