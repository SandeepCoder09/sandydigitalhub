'use client';

import Link from 'next/link';
import { Phone, MessageCircle, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicPartnerHeader({ partner }: { partner: any }) {
  const primaryColor = partner.branding?.primaryColor || '#7C3AED';
  const whatsappNumber = partner.whatsapp?.replace(/[^0-9]/g, '') || '918756454282';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Partner Brand / Logo */}
          <div className="flex items-center gap-3 min-w-0">
            {partner.branding?.logoUrl ? (
              <img
                src={partner.branding.logoUrl}
                alt={partner.name}
                className="h-10 sm:h-12 w-auto object-contain shrink-0"
              />
            ) : (
              <div
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {partner.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
                {partner.name}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 truncate">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span>{partner.city ? `${partner.city}, ${partner.state || 'India'}` : 'Authorized Digital Service Center'}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & WhatsApp CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {partner.ownerPhone && (
              <a
                href={`tel:${partner.ownerPhone}`}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors"
              >
                <Phone size={14} className="text-slate-600" />
                <span>{partner.ownerPhone}</span>
              </a>
            )}

            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(partner.name)},%20I%20need%20assistance%20with%20a%20digital%20service.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="h-10 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20"
              >
                <MessageCircle size={15} className="mr-1.5" />
                <span>WhatsApp Help</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
