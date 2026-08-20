'use client';

import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export function PublicPartnerFooter({ partner }: { partner: any }) {
  const showPoweredBy = partner.whiteLabel?.showPlatformBranding !== false;

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-base font-black text-white">{partner.name}</div>
            <div className="text-slate-400 text-[11px]">
              {partner.branding?.tagline || 'Authorized Digital Facilitation & Online Application Center'}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-slate-300">
            <a href="#services" className="hover:text-white transition-colors">
              Services Catalog
            </a>
            <Link href="/track-order" className="hover:text-white transition-colors">
              Track Request
            </Link>
            <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">
              <Lock size={11} />
              <span>Partner Login</span>
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {partner.name}. All rights reserved.
          </div>

          {showPoweredBy && (
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <ShieldCheck size={13} className="text-purple-400" />
              <span>
                Powered by{' '}
                <Link href="/" className="text-purple-300 hover:underline">
                  SARA Partner Network
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
