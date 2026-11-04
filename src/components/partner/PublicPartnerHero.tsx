'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, ShieldCheck, CheckCircle2, Zap, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PublicPartnerHero({ partner, onOpenRequestModal }: { partner: any; onOpenRequestModal: () => void }) {
  const primaryColor = partner.branding?.primaryColor || '#7C3AED';
  const whatsappNumber = partner.whatsapp?.replace(/[^0-9]/g, '') || '919118269278';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-md shadow-slate-200/50 text-slate-800 text-xs font-black uppercase tracking-wider">
            <ShieldCheck size={14} style={{ color: primaryColor }} />
            <span>Authorized Digital Service Center · {partner.city || 'India'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            {partner.name}
          </h1>

          {/* Tagline & Subtext */}
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            {partner.branding?.tagline || 'Your Trusted Local Digital Service Center'}.{' '}
            {partner.branding?.description ||
              'We provide professional assistance with government forms, online applications, document formatting, and digital utility services.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              onClick={onOpenRequestModal}
              size="lg"
              className="w-full sm:w-auto h-13 px-8 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-500/20 hover:scale-105 transition-all cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Zap size={16} className="mr-2" />
              <span>Request Digital Service</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>

            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(partner.name)},%20I%20need%20assistance%20with%20a%20digital%20service.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-7 rounded-2xl border-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-xs"
              >
                <MessageCircle size={16} className="mr-2 text-emerald-600" />
                <span>WhatsApp Desk</span>
              </Button>
            </a>

            <Link href="/track-order" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-6 rounded-2xl border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm"
              >
                <span>Track Request</span>
              </Button>
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 text-xs font-bold text-slate-700 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Document Confidentiality</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Direct Counter Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
