import Link from 'next/link';
import Image from 'next/image';
import {
  Phone, Mail, MapPin, FileText, Globe, LifeBuoy, ShieldCheck
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
  const year = new Date().getFullYear();

  return (
    <footer className="sdh-page-footer relative w-full text-slate-200">
      {/* Full website footer content — normal document flow, not part of the floating dock. */}
      <div className="border-t border-violet-300/20 bg-[radial-gradient(ellipse_at_15%_0%,rgba(124,58,237,.18),transparent_42%),linear-gradient(145deg,#1b1230_0%,#100b1d_58%,#0c0815_100%)] px-4 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14 lg:ml-[272px] lg:px-10">
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
    </footer>
  );
}
