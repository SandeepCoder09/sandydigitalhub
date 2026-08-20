'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Mail, Phone, MapPin, FileCheck, Calculator, PackageCheck, Briefcase, Sparkles,
  Layers, Code2, ShieldCheck, FileText, RotateCcw, ArrowRight, ShieldAlert
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-slate-800">
          
          {/* Column 1: Ecosystem Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/logo-footer.png"
                alt="Sandy Digital Hub"
                width={220}
                height={60}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              One unified digital ecosystem featuring <strong>Sara Digital Hub</strong> for trusted citizen & document services, and <strong>Sandy Digital Studio</strong> for modern software & website engineering.
            </p>
            
            {/* Dual Brand Quick Links */}
            <div className="pt-2 flex flex-wrap gap-2">
              <Link href="/" className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold hover:bg-purple-900 transition-colors">
                Sara Digital Hub (Citizen Services)
              </Link>
              <Link href="/studio" className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-bold hover:bg-indigo-900 transition-colors">
                Sandy Digital Studio (Tech & Apps)
              </Link>
            </div>
          </div>

          {/* Column 2: Sara Digital Hub Services */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">
              Sara Digital Hub
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Online Applications & Forms
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  PAN Card Facilitation
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Service Request
                </Link>
              </li>
              <li>
                <Link href="/document-checklist" className="hover:text-white transition-colors">
                  Document Checklists
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Free Digital Utility Tools
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-white transition-colors">
                  Service Price Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sandy Digital Studio */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Sandy Digital Studio
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/studio#services" className="hover:text-white transition-colors">
                  Custom Website Development
                </Link>
              </li>
              <li>
                <Link href="/studio#services" className="hover:text-white transition-colors">
                  Fullstack Web Applications
                </Link>
              </li>
              <li>
                <Link href="/studio#services" className="hover:text-white transition-colors">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Featured Work & Portfolio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Development Packages
                </Link>
              </li>
              <li>
                <Link href="/studio#quote" className="hover:text-white transition-colors">
                  Start a Project Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Center Info */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Contact & Center
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-purple-400 shrink-0 mt-0.5" />
                <span>Bairi, Khakhreru, Fatehpur, Uttar Pradesh, India - 212656</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-purple-400 shrink-0" />
                <span>+91 8756454282</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-purple-400 shrink-0" />
                <span>info@sandydigitalhub.com</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/contact" className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">
                <span>Support Center & Help</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Strip */}
        <div className="py-6 border-b border-slate-800/80 text-[11px] text-slate-500 leading-relaxed space-y-2 text-center md:text-left">
          <p>
            <strong>Service Disclaimer:</strong> SARA DIGITAL HUB is an independent digital facilitation and cyber assistance service center. We assist customers with filling online forms, application document processing, photo resizing, and navigation on public portals. SARA DIGITAL HUB is not affiliated with, authorized by, or representing any government department or authority. Final decisions on government approvals, certifications, and timelines remain subject to the respective official department.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} Sandy Digital Hub Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
