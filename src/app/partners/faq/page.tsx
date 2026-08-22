'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Building2, HelpCircle, ChevronDown, ArrowRight, ShieldCheck,
  CheckCircle2, PhoneCall, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PartnerFAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'What is the SARA Partner Network?',
      a: 'The SARA Partner Network allows local CSC operators, cyber cafe owners, and digital kiosks to operate a modern, branded online and walk-in digital service center powered by our central facilitation platform.',
    },
    {
      q: 'Do I get my own website and customer URL?',
      a: 'Yes! Every approved partner gets their own dedicated public URL (e.g. sandydigitalhub.com/center/your-shop-name) featuring your shop logo, business hours, address, and selectable services.',
    },
    {
      q: 'How does the commission and earning model work?',
      a: 'Partners receive the lion’s share (typically 80% to 85%) of every service request fee. Earnings are credited directly to your partner statement in real-time with automated payout settlements.',
    },
    {
      q: 'Can my staff and operators have individual logins?',
      a: 'Yes. Partner administrators can create operator logins with custom permissions, enabling multiple staff members to process requests simultaneously without sharing master credentials.',
    },
    {
      q: 'What equipment do I need to get started?',
      a: 'All you need is an internet-connected computer, laptop, or tablet with a printer/scanner. There is no software installation required — everything runs securely in your web browser.',
    },
    {
      q: 'How long does the verification process take?',
      a: 'Once you submit your application at /partners/apply, our team verifies your physical shop location and documents within 24 to 48 hours. Upon approval, your center portal is activated immediately.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={12} /> Partner Onboarding Guide
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Frequently Asked <span className="text-purple-400">Questions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Everything you need to know about joining, operating, and earning with the SARA Partner Network.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-gray-900">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed font-medium border-t border-gray-100 bg-slate-50/30">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        <div className="p-6 rounded-3xl bg-purple-50 border border-purple-200 mt-8 text-center space-y-3">
          <h3 className="text-sm font-black text-purple-950">Ready to expand your local digital business?</h3>
          <p className="text-xs text-purple-800 font-medium max-w-md mx-auto">
            Apply online in 3 minutes and activate your branded center.
          </p>
          <div className="pt-1 flex justify-center gap-3">
            <Link href="/partners/apply">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl h-10 px-5">
                Apply for Partner Center <ArrowRight size={13} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-purple-300 text-purple-900 text-xs font-bold rounded-xl h-10 px-5">
                Contact Partner Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
