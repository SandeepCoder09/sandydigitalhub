'use client';

import Link from 'next/link';
import {
  Building2, CheckCircle2, ArrowRight, ShieldCheck, Zap, Users,
  Globe, Laptop, FileText, TrendingUp, Sparkles, HelpCircle,
  Clock, Award, PhoneCall, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PartnerNetworkLandingPage() {
  const BENEFITS = [
    {
      icon: Globe,
      title: 'Your Own Branded Portal & URL',
      description: 'Get a dedicated public web URL (e.g. sandydigitalhub.com/center/your-shop) featuring your custom logo, business hours, and phone number.',
    },
    {
      icon: Laptop,
      title: 'Central Digital Services Catalog',
      description: 'Enable and offer high-demand services including PAN card assistance, Income/Caste certificates, EPFO, Passport filings, and resume building.',
    },
    {
      icon: Users,
      title: 'Multi-User Staff Accounts',
      description: 'Create individual operator and staff logins with role-based permissions to manage customer requests efficiently.',
    },
    {
      icon: TrendingUp,
      title: 'Transparent Commission & Earnings',
      description: 'Keep the majority share of every service fee with real-time balance tracking, instant earnings analytics, and automated statements.',
    },
    {
      icon: ShieldCheck,
      title: 'Compliance & Verification Support',
      description: 'Benefit from platform-level document verification, tracking infrastructure, and prompt support for complex filings.',
    },
    {
      icon: Zap,
      title: 'Zero Server Setup or Tech Hassle',
      description: 'Fully cloud-hosted and mobile-friendly system. Start serving customers immediately from any computer, tablet, or smartphone.',
    },
  ];

  const WORKFLOW_STEPS = [
    {
      step: '01',
      title: 'Apply Online',
      description: 'Submit your business details, shop location, and proof of physical operation in just 3 minutes.',
    },
    {
      step: '02',
      title: 'Verification & Approval',
      description: 'Our team reviews your application, checks location exclusivity, and approves your partner center account.',
    },
    {
      step: '03',
      title: 'Set Up Your Branding',
      description: 'Upload your shop logo, set your working hours, enable your preferred services, and customize pricing.',
    },
    {
      step: '04',
      title: 'Start Serving Customers',
      description: 'Receive customer requests directly through your custom center page or manage walk-in counter clients.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-purple-500 selection:text-white">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-purple-600/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Building2 size={13} className="text-purple-400" /> SARA Partner Network
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Start Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300">Digital Service Center</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 font-medium leading-relaxed">
            Build your local digital service business with your own identity, staff accounts, and custom public portal while powered by the central SARA platform.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-3.5">
            <Link href="/partners/apply">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-sm px-7 py-3.5 h-12 rounded-2xl shadow-xl shadow-purple-950/60 cursor-pointer flex items-center gap-2">
                Become a Partner Center <ArrowRight size={15} />
              </Button>
            </Link>
            <Link href="/partners/plans">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400 text-white font-bold text-sm px-6 py-3.5 h-12 rounded-2xl cursor-pointer transition-all backdrop-blur-md shadow-sm">
                Explore Partner Plans
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-semibold border-t border-slate-800/60 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> Verified Operator Login
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> Custom Domain & Branding
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> 24/7 Platform Reliability
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS GRID ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-purple-400">Why Join SARA Partner Network</span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Everything You Need to Run a Modern Digital Center
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Turn your cyber cafe, CSC center, or retail shop into a full-scale digital facilitation hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-purple-500/50 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/80 text-purple-300 flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 bg-slate-950 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-purple-400">Onboarding Process</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              How to Become an Authorized Partner Center
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 relative space-y-3"
              >
                <div className="text-3xl font-black text-purple-500/40">{step.step}</div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/partners/apply">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-sm px-8 py-3.5 h-12 rounded-2xl shadow-xl shadow-purple-950/60 cursor-pointer">
                Start Partner Application →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS BANNER ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-700/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">Looking for an active center near you?</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Browse our verified physical partner centers operating in your district or city.
            </p>
          </div>
          <Link href="/partner-centers">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black text-xs px-6 py-3 h-11 rounded-xl shrink-0 cursor-pointer">
              Explore Partner Directory
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
