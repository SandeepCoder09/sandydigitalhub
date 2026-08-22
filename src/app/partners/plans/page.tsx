'use client';

import Link from 'next/link';
import {
  Building2, CheckCircle2, ArrowRight, ShieldCheck, Zap,
  Check, Star, Sparkles, HelpCircle, PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PartnerPlansPage() {
  const PLANS = [
    {
      id: 'starter',
      name: 'Starter Center',
      tagline: 'Ideal for independent single-counter cyber cafes & CSC operators',
      fee: 'Free Registration',
      commissionShare: '80% Partner Share',
      features: [
        'Branded Public Center Web URL',
        'Central Service Catalog Access',
        'Up to 2 Operator Staff Logins',
        'Standard Request Management & Invoicing',
        'Real-time Earnings Statement',
        'Standard Email & Ticket Support',
      ],
      ctaText: 'Apply for Starter Center',
      popular: false,
    },
    {
      id: 'growth',
      name: 'Growth Center Pro',
      tagline: 'For established multi-counter digital kiosks & CSC centers',
      fee: 'Verified Partner',
      commissionShare: '85% Partner Share',
      features: [
        'Custom Logo, Favicon & Banner Branding',
        'Listing in Public Opt-In Partner Directory',
        'Unlimited Staff & Operator Logins',
        'Priority Document Verification Pipeline',
        'Fast-Track Tech & Service Support',
        'Custom Pricing Override for Local Services',
        'Customer SMS & Notification Routing',
      ],
      ctaText: 'Apply for Growth Center',
      popular: true,
    },
    {
      id: 'franchise',
      name: 'District Master Hub',
      tagline: 'District-level exclusive partner managing regional network points',
      fee: 'Contact for Territory',
      commissionShare: 'Custom Territory Share',
      features: [
        'Exclusive District Territory Protection',
        'Master Dashboard for Sub-Center Network',
        'Dedicated Territory Account Manager',
        'Custom White-Label Domain Integration',
        'Direct Technical & Training Support',
        'Priority API & Volume Payout Gateway',
      ],
      ctaText: 'Inquire for Master Territory',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Building2 size={12} /> SARA Partner Network Plans
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Transparent <span className="text-purple-400">Partner Membership</span> Tiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Choose the operational model that fits your business scale. No hidden fees or unexpected software lock-ins.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 lg:p-8 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-slate-900 text-white border-2 border-purple-500 shadow-xl shadow-purple-950/40 relative'
                  : 'bg-white text-slate-900 border border-gray-200 shadow-xs hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Recommended Tier
                </span>
              )}

              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black">{plan.name}</h3>
                  <p className={`text-xs mt-1 font-medium ${plan.popular ? 'text-slate-400' : 'text-gray-500'}`}>
                    {plan.tagline}
                  </p>
                </div>

                <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl ${plan.popular ? 'bg-slate-800' : 'bg-purple-50'}`}>
                  <div className={`text-lg sm:text-xl font-black ${plan.popular ? 'text-purple-400' : 'text-purple-700'}`}>
                    {plan.commissionShare}
                  </div>
                  <div className={`text-[11px] font-medium ${plan.popular ? 'text-slate-400' : 'text-purple-900'}`}>
                    {plan.fee}
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs font-medium">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${plan.popular ? 'text-purple-400' : 'text-emerald-600'}`} />
                      <span className={plan.popular ? 'text-slate-300' : 'text-gray-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800">
                <Link href="/partners/apply">
                  <Button
                    className={`w-full text-xs font-bold rounded-xl h-11 cursor-pointer ${
                      plan.popular
                        ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-900'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.ctaText} →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/partners/faq" className="text-xs font-bold text-purple-700 hover:underline inline-flex items-center gap-1">
            <HelpCircle size={13} /> Have questions about partner tiers? Read Partner FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
