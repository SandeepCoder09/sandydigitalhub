'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Search, Home, Zap, PackageCheck, FileCheck, Calculator,
  Wrench, Image as ImageIcon, Sparkles, FileText, Lock, Briefcase, Star, Tag,
  PhoneCall, ShieldCheck, ArrowRight, ChevronRight, LogOut
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { NavLogoutButton } from './NavLogoutButton';

interface MobileNavDrawerProps {
  session: any;
  controlledOpen?: boolean;
  onClose?: () => void;
  hideTrigger?: boolean;
}

export function MobileNavDrawer({ session, controlledOpen, onClose, hideTrigger = false }: MobileNavDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const handleOpen = () => {
    setInternalOpen(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    handleClose();
  }, [pathname]);

  // Handle ESC key press & body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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
      title: 'SARA DIGITAL HUB (CITIZEN SERVICES)',
      items: [
        { label: 'Hub Home', path: '/', icon: Home },
        { label: 'Citizen Services Catalog', path: '/services', icon: Zap, badge: 'SERVICES', color: 'text-[#7C3AED] bg-purple-50 border-purple-200' },
        { label: 'Live Track Request', path: '/track-order', icon: PackageCheck, badge: 'LIVE', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
        { label: 'Document Checklist', path: '/document-checklist', icon: FileCheck },
        { label: 'Price & Service Calculator', path: '/calculator', icon: Calculator },
        { label: 'Free Digital Tools Hub', path: '/tools', icon: Wrench, badge: 'FREE', color: 'text-[#7C3AED] bg-purple-50 border-purple-200' },
      ]
    },
    {
      title: 'SANDY DIGITAL STUDIO (TECH & SOFTWARE)',
      items: [
        { label: 'Sandy Digital Studio', path: '/studio', icon: Briefcase, badge: 'STUDIO', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
        { label: 'Custom Websites & Web Apps', path: '/studio#services', icon: Sparkles },
        { label: 'Client Work & Portfolio', path: '/portfolio', icon: FileText },
        { label: 'Development Packages', path: '/pricing', icon: Tag },
        { label: 'Start Project Enquiry', path: '/studio#quote', icon: Lock },
      ]
    },
    {
      title: 'SUPPORT & LEGAL TRANSPARENCY',
      items: [
        { label: 'Customer Reviews', path: '/reviews', icon: Star },
        { label: 'Contact & Help Desk', path: '/contact', icon: PhoneCall },
        { label: 'Terms & Service Policies', path: '/terms', icon: ShieldCheck },
      ]
    }
  ];

  const drawerContent = (
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Dark Backdrop Overlay */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Slide-out Off-Canvas Drawer (Slide from Left or Right) */}
      <aside className="fixed top-0 right-0 bottom-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Header: Logo + Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <Link href="/" onClick={handleClose} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Sandy Digital Hub"
              width={150}
              height={42}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer border border-slate-200"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search Bar */}
        <div className="p-4 bg-white border-b border-slate-100 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages, services & tools..."
              className="w-full bg-white border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-[#7C3AED] rounded-full w-4.5 h-4.5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Admin Highlight Banner (For Authenticated Admins) */}
          {isAdmin && (
            <div className="bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-4 rounded-3xl text-white shadow-lg shadow-purple-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  SUPER ADMIN MODE
                </span>
                <ShieldCheck size={18} className="text-purple-200" />
              </div>
              <div className="text-sm font-extrabold tracking-tight">Control Center & Audit Console</div>
              <Link
                href="/admin"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-[#7C3AED] font-black text-xs shadow-md hover:bg-purple-50 transition-all w-full justify-center"
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

                <div className="space-y-1.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={handleClose}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs transition-all group ${
                          isActive
                            ? 'bg-purple-50 border border-purple-200 text-[#7C3AED] font-black shadow-xs'
                            : 'bg-white hover:bg-purple-50/50 text-slate-700 hover:text-[#7C3AED] font-bold border border-slate-100 hover:border-purple-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#7C3AED] text-white shadow-xs'
                              : 'bg-slate-50 text-slate-600 group-hover:text-[#7C3AED] group-hover:bg-purple-100 border border-slate-100'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && !isActive && (
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${item.color || 'bg-slate-100 text-slate-600'}`}>
                              {item.badge}
                            </span>
                          )}

                          <ChevronRight size={14} className={`shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ${isActive ? 'text-[#7C3AED]' : 'text-slate-400'}`} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: User Account / Auth Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 space-y-2.5">
          {session ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
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
                  onClick={handleClose}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] text-xs font-bold transition-colors shrink-0"
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
                onClick={handleClose}
                className="py-2.5 px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-extrabold hover:bg-slate-100 text-center transition-colors shadow-2xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={handleClose}
                className="py-2.5 px-4 rounded-2xl bg-[#7C3AED] text-white text-xs font-extrabold hover:bg-[#6D28D9] text-center transition-all shadow-md shadow-purple-200"
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
      {!hideTrigger && (
        <button
          onClick={handleOpen}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer border border-slate-200 flex items-center justify-center"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {isOpen && mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
