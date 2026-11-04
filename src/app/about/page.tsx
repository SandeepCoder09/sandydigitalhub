import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2, Globe, ShieldCheck, HeartHandshake, Zap, Target,
  Users, CheckCircle2, FileText, ArrowRight, ShieldAlert
} from 'lucide-react';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

export const metadata: Metadata = {
  title: 'About Our Ecosystem | SANDY DIGITAL ECOSYSTEM',
  description: 'Learn about the two interconnected divisions of SANDY DIGITAL ECOSYSTEM: SANDY DIGITAL HUB for citizen services and SARA DIGITAL STUDIO for modern software engineering.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-24">
      {/* ── HERO BANNER ── */}
      <section className="bg-slate-900 text-white pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Building2 size={13} /> {ECOSYSTEM_CONFIG.parentBrand.name}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Two Connected Platforms, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300">One Trusted Ecosystem</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-medium leading-relaxed">
            We bridge the gap between grassroots citizen-facing digital facilitation and high-performance modern software engineering.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* ── TWO ECOSYSTEM DIVISIONS ── */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED]">Brand Architecture</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Our Two Core Divisions</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              A structured hierarchy ensuring domain expertise, operational clarity, and dedicated support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Division 1: SANDY DIGITAL HUB */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    Citizen & Digital Facilitation
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{ECOSYSTEM_CONFIG.divisions.saraHub.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  {ECOSYSTEM_CONFIG.divisions.saraHub.description}
                </p>
                <ul className="space-y-2 text-xs text-gray-700 font-medium pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> Online Form & Application Facilitation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> PAN Card Application & Correction Assistance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> Free Browser-Side Utility Tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-600" /> SARA Partner Network Portal & Multi-Counter Support
                  </li>
                </ul>
              </div>

              <Link href="/services">
                <button className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  Explore Digital Services <ArrowRight size={13} />
                </button>
              </Link>
            </div>

            {/* Division 2: SARA DIGITAL STUDIO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Technology & Software Engineering
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{ECOSYSTEM_CONFIG.divisions.sandyStudio.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  {ECOSYSTEM_CONFIG.divisions.sandyStudio.description}
                </p>
                <ul className="space-y-2 text-xs text-gray-700 font-medium pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600" /> High-Performance Next.js & React Websites
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600" /> Fullstack SaaS & Custom Business Applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600" /> Flutter / React Native Mobile Engineering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600" /> Interactive Cost Estimator & Quote Engine
                  </li>
                </ul>
              </div>

              <Link href="/studio">
                <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  Explore Technology Studio <ArrowRight size={13} />
                </button>
              </Link>
            </div>

          </div>
        </div>

        {/* ── CORE TRUST VALUES ── */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Our Commitments</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Operating Principles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900">Complete Transparency</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Clear pricing, itemized quotations, real-time request tracking, and zero hidden service fees.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900">Client-Side Privacy</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Our free digital utility tools process images and documents directly in your browser without cloud uploads.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900">Partner Empowerment</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Empowering grassroots operators across Uttar Pradesh with branded digital center portals and 80%+ revenue share.
              </p>
            </div>
          </div>
        </div>

        {/* ── SERVICE DISCLAIMER ── */}
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldAlert size={16} className="text-amber-700 shrink-0" />
            <span>Important Service Disclaimer</span>
          </div>
          <p>{ECOSYSTEM_CONFIG.disclaimers.facilitationNotice}</p>
        </div>

      </div>
    </div>
  );
}
