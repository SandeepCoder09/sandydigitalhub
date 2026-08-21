'use client';

import { MapPin, PhoneCall, MessageCircle, ShieldCheck, Clock } from 'lucide-react';

export function LocalTrustStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-slate-50/70 py-3 sm:py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:flex lg:flex-wrap items-center justify-around gap-2.5 sm:gap-6 text-xs text-slate-700">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
            <MapPin size={14} className="sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight text-[11px] sm:text-xs">Local Digital Center</div>
            <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium">Fatehpur, UP · In-Person & Online</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
            <PhoneCall size={14} className="sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight text-[11px] sm:text-xs">Direct Support</div>
            <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium">+91 8756454282 (Mon–Sat)</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageCircle size={14} className="sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight text-[11px] sm:text-xs">WhatsApp Help</div>
            <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium">Fast Form Inquiries</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight text-[11px] sm:text-xs">Privacy-Focused</div>
            <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium">Confidential Processing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
