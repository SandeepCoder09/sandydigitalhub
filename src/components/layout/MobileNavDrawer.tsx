'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Search, Home, Zap, PackageCheck, FileCheck, Calculator,
  Wrench, Image as ImageIcon, Sparkles, FileText, Lock, Briefcase, Star, Tag,
  PhoneCall, ShieldCheck, ArrowRight, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { NavLogoutButton } from './NavLogoutButton';

interface MobileNavDrawerProps {
  session: any;
}

export function MobileNavDrawer({ session }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle ESC key press & body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInputRef.current?.focus(), 150);
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'admin';

  const menuSections = [
    {
      title: 'MAIN SERVICES',
      items: [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Services Catalog', path: '/services', icon: Zap, badge: 'FAST', color: 'text-[#2563EB] bg-blue-50 border-blue-200' },
        { label: 'Live Track Order', path: '/track-order', icon: PackageCheck, badge: 'LIVE', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
        { label: 'Jan Seva Document Checklist', path: '/document-checklist', icon: FileCheck },
        { label: 'Service & Project Calculator', path: '/calculator', icon: Calculator },
      ]
    },
    {
      title: 'DIGITAL TOOLS HUB',
      items: [
        { label: 'Govt Photo & Signature Resizer', path: '/tools/govt-photo-resizer', icon: Wrench, badge: 'FREE', color: 'text-purple-700 bg-purple-50 border-purple-200' },
        { label: 'Passport Photo Generator', path: '/image-tools/passport-photo', icon: ImageIcon },
        { label: 'Format Converter (PNG/JPG/WebP)', path: '/image-tools/convert', icon: Sparkles },
        { label: 'Word & Character Counter', path: '/tools/word-counter', icon: FileText },
        { label: 'Strong Password Generator', path: '/tools/password-generator', icon: Lock },
      ]
    },
    {
      title: 'COMPANY & PORTFOLIO',
      items: [
        { label: 'Client Portfolio Showcase', path: '/portfolio', icon: Briefcase },
        { label: 'Customer Reviews & Ratings', path: '/reviews', icon: Star },
        { label: 'Web & Design Pricing Plans', path: '/pricing', icon: Tag },
        { label: 'Contact & Consultation', path: '/contact', icon: PhoneCall },
      ]
    }
  ];

  const drawerContent = (
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Dark Backdrop Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Slide-out Off-Canvas Drawer (Fixed Right Top-to-Bottom) */}
      <aside className="fixed top-0 right-0 bottom-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Header: Logo + Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Sandy Digital Hub"
              width={150}
              height={42}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer border border-slate-200"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages, services & tools..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Admin Highlight Banner (For Authenticated Admins) */}
          {isAdmin && (
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-2xl text-white shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                  Super Admin Mode
                </span>
                <ShieldCheck size={18} className="text-violet-200" />
              </div>
              <div className="text-sm font-extrabold">Control Center & Audit Console</div>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-violet-700 font-extrabold text-xs shadow-xs hover:bg-violet-50 transition-colors w-full justify-center"
              >
                <span>Open Admin Console</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Categorized Menu Groups */}
          {menuSections.map((section) => {
            const filteredItems = section.items.filter(item =>
              !searchQuery.trim() ||
              item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-2">
                  {section.title}
                </div>

                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs transition-all group ${
                          isActive
                            ? 'bg-violet-600 text-white font-black shadow-xs'
                            : 'bg-slate-50/70 hover:bg-violet-50/80 text-slate-700 hover:text-violet-900 font-bold border border-slate-100 hover:border-violet-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white text-slate-600 group-hover:text-violet-600 group-hover:bg-white shadow-2xs border border-slate-100'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && !isActive && (
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${item.color || 'bg-slate-100 text-slate-600'}`}>
                            {item.badge}
                          </span>
                        )}

                        <ChevronRight size={14} className={`shrink-0 opacity-40 group-hover:opacity-100 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: User Account / Auth Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-3">
          {session ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">
                      {session.user?.name || 'Customer Account'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">
                      {session.user?.email}
                    </div>
                  </div>
                </div>

                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-xs font-bold transition-colors shrink-0"
                >
                  Profile
                </Link>
              </div>

              <NavLogoutButton />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-extrabold hover:bg-slate-100 text-center transition-colors shadow-2xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-4 rounded-2xl bg-violet-600 text-white text-xs font-extrabold hover:bg-violet-700 text-center transition-all shadow-md shadow-violet-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </aside>
    </div>
  );

  return (
    <>
      {/* Drawer Hamburger Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer border border-slate-200 flex items-center justify-center"
        aria-label="Open Navigation Drawer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Render Drawer using React Portal directly into body */}
      {isOpen && mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
