'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudioPricing() {
  const packages = [
    {
      name: 'Starter Website',
      tagline: 'Ideal for small businesses, professionals & portfolio showcases',
      price: '₹4,999',
      period: 'starting package',
      badge: 'Starter',
      features: [
        'Up to 5 Responsive Pages',
        'Mobile & Tablet Optimized Layout',
        'Contact & WhatsApp Lead Form',
        'Fast Next.js Static Generation',
        'Basic On-Page SEO Setup',
        'Domain & Hosting Setup Support',
      ],
      popular: false,
    },
    {
      name: 'Business Growth Platform',
      tagline: 'Best for growing companies needing interactive features & branding',
      price: '₹12,999',
      period: 'starting package',
      badge: 'Most Popular',
      features: [
        'Up to 10 Custom Dynamic Pages',
        'Custom Figma UI/UX Design System',
        'Content Management / Admin Dashboard',
        'Interactive Quotation / Calculator',
        'Full SEO Architecture & Analytics',
        'Speed Optimization (<1s Load Time)',
        '30 Days Dedicated Maintenance',
      ],
      popular: true,
    },
    {
      name: 'Custom Web App / E-Commerce',
      tagline: 'For startups, online stores & complex custom software solutions',
      price: '₹24,999',
      period: 'starting package',
      badge: 'Fullstack',
      features: [
        'Fullstack Next.js & MongoDB / SQL',
        'User Authentication & Role Management',
        'Razorpay / Stripe Payment Gateway',
        'Automated Invoicing & Notification Email/SMS',
        'Interactive Live Chat / AI Assistant',
        'API & Webhook Integrations',
        '60 Days Dedicated Tech Support',
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-900 text-white relative border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider">
            <Tag size={13} />
            <span>Transparent Development Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Investment Packages</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
            Choose a starting tier below or request a tailored scope quotation for custom business requirements.
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`rounded-3xl p-7 flex flex-col justify-between relative transition-all duration-300 ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-violet-500 shadow-2xl shadow-violet-950/50 scale-[1.02]'
                  : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                  ★ Recommended Choice
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-violet-400">
                      {pkg.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{pkg.tagline}</p>
                </div>

                <div className="py-4 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{pkg.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">{pkg.period}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    *Final price confirmed based on specific feature requirements.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                          <Check size={11} className="stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a href="#quote" className="w-full block">
                  <Button
                    size="lg"
                    className={`w-full h-12 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 hover:scale-105'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>Choose {pkg.name}</span>
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
