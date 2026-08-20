'use client';

import { MapPin, PhoneCall, MessageCircle, ShieldCheck, Clock } from 'lucide-react';

export function LocalTrustStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-slate-50/70 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 sm:gap-6 text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
            <MapPin size={16} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight">Local Digital Service Center</div>
            <div className="text-[11px] text-slate-500 font-medium">Fatehpur, UP · Walk-in & Online</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
            <PhoneCall size={16} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight">Direct Customer Support</div>
            <div className="text-[11px] text-slate-500 font-medium">+91 8756454282 · Mon–Sat (10am–8pm)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageCircle size={16} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight">Instant WhatsApp Assistance</div>
            <div className="text-[11px] text-slate-500 font-medium">Fast Form & Document Inquiries</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight">Privacy-Focused Handling</div>
            <div className="text-[11px] text-slate-500 font-medium">Strict Customer Document Confidentiality</div>
          </div>
        </div>
      </div>
    </section>
  );
}
