'use client';

import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicPartnerContact({ partner }: { partner: any }) {
  const primaryColor = partner.branding?.primaryColor || '#7C3AED';
  const whatsappNumber = partner.whatsapp?.replace(/[^0-9]/g, '') || '918756454282';

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Info Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider">
                <MapPin size={13} style={{ color: primaryColor }} />
                <span>Direct Contact & Location</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Visit or Reach Out to <span style={{ color: primaryColor }}>{partner.name}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Our staff is available during counter hours to help you with form submissions, document verification, and printing.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Center Address</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {partner.address || `${partner.city || 'Local Digital Center'}, ${partner.state || 'India'}`}
                  </div>
                  {partner.pincode && <div className="text-xs text-slate-500 font-mono">PIN: {partner.pincode}</div>}
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-500">Counter Phone</div>
                    <a
                      href={`tel:${partner.ownerPhone}`}
                      className="text-sm font-bold text-slate-900 hover:text-purple-600 transition-colors mt-0.5 block"
                    >
                      {partner.ownerPhone || '+91 87564 54282'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-emerald-800">WhatsApp Desk</div>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-950 hover:underline mt-0.5 block font-mono"
                    >
                      {partner.whatsapp || partner.ownerPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Working Hours</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {partner.branding?.businessHours || 'Monday – Saturday: 9:00 AM – 8:00 PM'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-[#111318] text-white shadow-2xl space-y-6 border border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-bold">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Official Partner Network Verification</span>
              </div>
              <h3 className="text-2xl font-black text-white">Need Urgent Assistance?</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Connect directly with our center operator on WhatsApp for instant form checklists, fee confirmation, and document requirements.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white">Why choose our local center:</div>
              <div>✓ Verified operator with secure system login</div>
              <div>✓ Direct physical assistance for error-free application submission</div>
              <div>✓ Transparent service fees without hidden charges</div>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(partner.name)},%20I%20need%20assistance%20with%20a%20digital%20service.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                size="lg"
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-500/20"
              >
                <MessageCircle size={17} className="mr-2" />
                <span>Chat with Center Desk on WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
