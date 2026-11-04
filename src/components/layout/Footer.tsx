'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronUp, ChevronDown, X, Phone, Mail, MapPin, FileText, Globe,
  LifeBuoy, ShieldCheck, ShieldAlert, Sparkles, ArrowUpRight
} from 'lucide-react';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

const linkGroups = [
  {
    title: 'SARA Digital Hub',
    icon: FileText,
    color: 'text-violet-300',
    links: [
      ['Citizen & Form Services', '/services'],
      ['Track Service Request', '/track-order'],
      ['Free Digital Utility Tools', '/tools'],
      ['Verified Customer Reviews', '/reviews'],
      ['SARA Partner Network', '/partners'],
      ['Partner Centers Directory', '/partner-centers'],
    ],
  },
  {
    title: 'Sandy Digital Studio',
    icon: Globe,
    color: 'text-fuchsia-300',
    links: [
      ['Custom Web Development', '/studio#services'],
      ['Mobile App Engineering', '/studio#services'],
      ['Development Packages', '/pricing'],
      ['Case Studies & Portfolio', '/portfolio'],
      ['Project Cost Calculator', '/calculator'],
      ['Generate Official Quote', '/calculator#quote'],
    ],
  },
  {
    title: 'Support & Platform',
    icon: LifeBuoy,
    color: 'text-cyan-300',
    links: [
      ['Help Center & Knowledge Base', '/help'],
      ['Support Ticket Center', '/support'],
      ['System Operational Status', '/status'],
      ['Official Announcements', '/announcements'],
      ['Document Checklists', '/document-checklist'],
      ['Contact & Department Routing', '/contact'],
    ],
  },
  {
    title: 'Company & Legal',
    icon: ShieldCheck,
    color: 'text-purple-200',
    links: [
      ['About Our Ecosystem', '/about'],
      ['Privacy & Data Protection', '/privacy'],
      ['Terms of Service', '/terms'],
      ['Refund & Cancellation Policy', '/refund'],
    ],
  },
];

export function Footer() {
  const [expanded, setExpanded] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="sdh-page-footer relative w-full text-slate-200">
      {/* Full website footer content — normal document flow, not part of the floating dock. */}
      <div className="border-t border-violet-300/20 bg-[radial-gradient(ellipse_at_15%_0%,rgba(124,58,237,.18),transparent_42%),linear-gradient(145deg,#1b1230_0%,#100b1d_58%,#0c0815_100%)] px-4 pb-28 pt-10 sm:px-8 sm:pb-32 sm:pt-14 lg:ml-[272px] lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
            <div className="max-w-sm">
              <Image src="/logo-footer.png" alt="Sandy Digital Ecosystem" width={170} height={44} className="h-10 w-auto object-contain" />
              <p className="mt-4 text-sm leading-7 text-slate-300">{ECOSYSTEM_CONFIG.parentBrand.description}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                <a href="tel:+919118269278" className="inline-flex items-center gap-2 hover:text-white"><Phone size={15} className="text-violet-300" /> +91 9118269278</a>
                <a href="mailto:admin@sandydigitalhub.com" className="inline-flex items-center gap-2 hover:text-white"><Mail size={15} className="text-violet-300" /> admin@sandydigitalhub.com</a>
              </div>
            </div>
            {linkGroups.map((group) => {
              const Icon = group.icon;
              return (
                <section key={group.title} className="min-w-0">
                  <h3 className={`mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[.12em] ${group.color}`}>
                    <Icon size={15} /> {group.title}
                  </h3>
                  <ul className="space-y-3">
                    {group.links.map(([label, href]) => (
                      <li key={href + label}>
                        <Link href={href} className="text-sm leading-snug text-slate-300 transition hover:text-white">{label}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
          <p className="mt-8 border-t border-violet-300/15 pt-5 text-xs leading-6 text-slate-400">
            {ECOSYSTEM_CONFIG.disclaimers.facilitationNotice}
          </p>
          <div className="mt-5 flex flex-col justify-between gap-2 border-t border-violet-300/15 pt-5 text-xs text-slate-500 sm:flex-row">
            <span>© {year} <strong className="text-slate-300">SANDY DIGITAL ECOSYSTEM</strong>. All rights reserved.</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12} /> Fatehpur, Uttar Pradesh, India · Version 2.0 Enterprise</span>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="sdh-footer-panel mx-2 sm:mx-4 lg:ml-[290px] mb-2 max-h-[68vh] overflow-y-auto rounded-[1.6rem] border border-violet-300/25 bg-[#130d20]/[.97] p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,.58),0_1px_0_rgba(255,255,255,.08)_inset] backdrop-blur-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-violet-300/15 pb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Image src="/logo-footer.png" alt="Sandy Digital Ecosystem" width={150} height={38} className="h-8 w-auto object-contain" />
                <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.16em] text-violet-200">One ecosystem · two platforms</span>
              </div>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300">{ECOSYSTEM_CONFIG.parentBrand.description}</p>
            </div>
            <button onClick={() => setExpanded(false)} aria-label="Close footer panel" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-white/5 text-violet-100 transition hover:bg-violet-400/15">
              <X size={17} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
            {linkGroups.map((group) => {
              const Icon = group.icon;
              return (
                <section key={group.title} className="min-w-0">
                  <h3 className={`mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.12em] ${group.color}`}>
                    <Icon size={14} /> {group.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.links.map(([label, href]) => (
                      <li key={href + label}>
                        <Link href={href} onClick={() => setExpanded(false)} className="group inline-flex items-start gap-1 text-[11px] leading-snug text-slate-300 transition hover:text-white">
                          <span>{label}</span><ArrowUpRight size={11} className="mt-0.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-violet-300/15 bg-white/[.035] p-3 sm:grid-cols-2">
            <a href="tel:+919118269278" className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white"><Phone size={14} className="text-violet-300" /> +91 9118269278</a>
            <a href="mailto:admin@sandydigitalhub.com" className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white"><Mail size={14} className="text-violet-300" /> admin@sandydigitalhub.com</a>
          </div>
          <p className="mt-4 flex items-start gap-2 border-t border-violet-300/15 pt-4 text-[10px] leading-relaxed text-slate-400">
            <ShieldAlert size={13} className="mt-0.5 shrink-0 text-amber-300" />
            {ECOSYSTEM_CONFIG.disclaimers.facilitationNotice}
          </p>
          <div className="mt-4 flex flex-col justify-between gap-2 text-[10px] text-slate-500 sm:flex-row">
            <span>© {year} <strong className="text-slate-300">SANDY DIGITAL ECOSYSTEM</strong>. All rights reserved.</span>
            <span className="inline-flex items-center gap-1"><MapPin size={11} /> Fatehpur, Uttar Pradesh, India <span className="px-1">·</span> Version 2.0 Enterprise</span>
          </div>
        </div>
      )}

      <div className="sdh-footer-dock fixed bottom-[5.8rem] lg:bottom-4 left-0 right-0 z-[60] mx-2 sm:mx-4 lg:ml-[290px] overflow-hidden rounded-2xl border border-violet-300/25 bg-[#171025]/95 shadow-[0_12px_42px_rgba(0,0,0,.48),0_1px_0_rgba(255,255,255,.1)_inset] backdrop-blur-2xl">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent" />
        <div className="flex min-h-[58px] items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image src="/logo-footer.png" alt="Sandy Digital Hub" width={118} height={32} className="h-7 w-auto max-w-[112px] object-contain" />
            <span className="hidden sm:block h-7 w-px bg-violet-300/20" />
            <span className="hidden sm:block min-w-0">
              <span className="block text-[10px] font-extrabold tracking-wide text-white">SANDY DIGITAL ECOSYSTEM</span>
              <span className="block text-[9px] text-violet-200/70">Digital services · Technology · Support</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <a href="tel:+919118269278" aria-label="Call Sandy Digital Hub" className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-400/20"><Phone size={15} /></a>
            <Link href="/contact" className="hidden rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-[10px] font-bold text-violet-100 transition hover:bg-violet-400/20 sm:inline-flex">Contact</Link>
            <button onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-label={expanded ? 'Collapse footer details' : 'Expand footer details'} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 text-[10px] font-extrabold text-white shadow-[0_5px_18px_rgba(124,58,237,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,.45)]">
              {expanded ? 'Close' : 'Explore'} {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
