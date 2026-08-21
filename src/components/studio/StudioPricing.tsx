'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Tag } from 'lucide-react';

export function StudioPricing() {
  const packages = [
    {
      name: 'Starter Website',
      tagline: 'Ideal for small businesses, professionals & portfolio showcases',
      price: '₹4,999',
      period: 'starting package',
      badge: 'Starter',
      cta: 'Choose Starter Plan',
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
      cta: 'Choose Growth Plan',
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
      cta: 'Choose Custom Plan',
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
    <section id="pricing" className="py-8 sm:py-20 bg-slate-900 text-white relative border-b border-slate-800">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <Tag size={12} className="sm:w-[13px] sm:h-[13px]" />
            <span>Transparent Development Packages</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Investment Packages</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-400 font-medium leading-relaxed">
            Choose a starting tier below or request a tailored scope quotation for custom business requirements.
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-8 items-stretch">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between relative transition-all duration-300 ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-violet-500 shadow-2xl shadow-violet-950/50 scale-[1.01] sm:scale-[1.02]'
                  : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow-md">
                  ★ Recommended Choice
                </div>
              )}

              <div className="space-y-3 sm:space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-violet-400">
                      {pkg.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white mt-0.5 sm:mt-1">{pkg.name}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 sm:mt-1 leading-snug sm:leading-relaxed">{pkg.tagline}</p>
                </div>

                <div className="py-2.5 sm:py-4 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">{pkg.price}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">{pkg.period}</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1">
                    *Final price confirmed based on specific feature requirements.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 sm:space-y-3">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-slate-300 font-medium">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 sm:gap-2.5">
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 sm:pt-8 w-full">
                <a
                  href="#quote"
                  className={`w-full h-11 sm:h-12 px-4 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer text-center ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 hover:scale-[1.02]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="truncate">{pkg.cta}</span>
                  <ArrowRight size={14} className="shrink-0" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
