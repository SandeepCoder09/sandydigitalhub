'use client';

import { ShieldAlert, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function ServiceDisclaimerSection() {
  return (
    <section className="py-12 bg-slate-100/80 border-t border-slate-200 text-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Important Service Notice & Legal Transparency
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Transparent facilitation and citizen assistance guidelines
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-2.5 font-medium border-t border-slate-100 pt-4">
            <p>
              <strong>SANDY DIGITAL HUB</strong> operates as an independent digital facilitation and cyber assistance center. We assist customers with filling online forms, application document processing, photo resizing, and navigation on public government and institutional portals.
            </p>
            <p>
              <strong>Disclaimer of Affiliation:</strong> SANDY DIGITAL HUB is not directly affiliated with, endorsed by, or representing any government department or statutory agency unless specifically authorized. Final application acceptance, processing times, issuance of certificates, and approval decisions remain solely subject to the jurisdiction of the respective official authority or government department.
            </p>
            <p>
              <strong>Transparent Fee Structure:</strong> Our service charges represent professional assistance, document handling, and technical facilitation fees. All official government fees (if applicable) are clearly itemized before submission.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-[#7C3AED]">
            <Link href="/terms" className="hover:underline inline-flex items-center gap-1">
              <span>Read Full Terms & Service Policy</span>
              <ExternalLink size={12} />
            </Link>
            <Link href="/privacy" className="hover:underline inline-flex items-center gap-1">
              <span>Privacy & Document Handling Policy</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
