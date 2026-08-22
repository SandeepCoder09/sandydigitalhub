'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Mail, Phone, MapPin, FileCheck, Calculator, PackageCheck, Briefcase, Sparkles,
  Layers, Code2, ShieldCheck, FileText, RotateCcw, ArrowRight, ShieldAlert,
  Building2, LifeBuoy, Activity, Megaphone, Star, Globe, Smartphone, HelpCircle
} from 'lucide-react';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 selection:bg-purple-500 selection:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Top Ecosystem Brand Header */}
        <div className="pb-10 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/logo-footer.png"
                alt="Sandy Digital Ecosystem"
                width={220}
                height={55}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              {ECOSYSTEM_CONFIG.parentBrand.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold hover:bg-purple-900 transition-colors flex items-center gap-1.5"
            >
              <FileText size={13} /> SARA Digital Hub
            </Link>
            <Link
              href="/studio"
              className="px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-bold hover:bg-indigo-900 transition-colors flex items-center gap-1.5"
            >
              <Globe size={13} /> Sandy Digital Studio
            </Link>
          </div>
        </div>

        {/* 4-Column Structured Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-800 text-xs">
          
          {/* Col 1: SARA DIGITAL HUB */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <FileText size={14} /> SARA Digital Hub
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-400">
              <li><Link href="/services" className="hover:text-white transition-colors">Citizen & Form Services</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Service Request</Link></li>
              <li><Link href="/tools" className="hover:text-white transition-colors">Free Digital Utility Tools</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Verified Customer Reviews</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">SARA Partner Network</Link></li>
              <li><Link href="/partner-centers" className="hover:text-white transition-colors">Partner Centers Directory</Link></li>
            </ul>
          </div>

          {/* Col 2: SANDY DIGITAL STUDIO */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Globe size={14} /> Sandy Digital Studio
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-400">
              <li><Link href="/studio#services" className="hover:text-white transition-colors">Custom Web Development</Link></li>
              <li><Link href="/studio#services" className="hover:text-white transition-colors">Mobile App Engineering</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Development Packages</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Case Studies & Portfolio</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">Project Cost Calculator</Link></li>
              <li><Link href="/calculator#quote" className="hover:text-white transition-colors">Generate Official Quote</Link></li>
            </ul>
          </div>

          {/* Col 3: SUPPORT & OPERATIONS */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <LifeBuoy size={14} /> Support & Platform
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-400">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center & Knowledge Base</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support Ticket Center</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">System Operational Status</Link></li>
              <li><Link href="/announcements" className="hover:text-white transition-colors">Official Announcements</Link></li>
              <li><Link href="/document-checklist" className="hover:text-white transition-colors">Document Checklists</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact & Department Routing</Link></li>
            </ul>
          </div>

          {/* Col 4: COMPANY & LEGAL */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Company & Legal
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Our Ecosystem</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Data Protection</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link></li>
              <li><a href="tel:+918756454282" className="hover:text-white transition-colors">+91 8756454282</a></li>
              <li><a href="mailto:admin@sandydigitalhub.com" className="hover:text-white transition-colors">admin@sandydigitalhub.com</a></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Strip */}
        <div className="pt-6 pb-4 border-b border-slate-800 text-[11px] text-slate-400 leading-relaxed font-medium">
          <p className="flex items-start gap-2 max-w-4xl">
            <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <span>{ECOSYSTEM_CONFIG.disclaimers.facilitationNotice}</span>
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div>
            © {year} <strong>SANDY DIGITAL ECOSYSTEM</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>HQ: Fatehpur, Uttar Pradesh, India</span>
            <span>·</span>
            <span>Version 2.0 Enterprise</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
