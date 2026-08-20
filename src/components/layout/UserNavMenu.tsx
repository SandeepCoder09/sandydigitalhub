'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, ShieldCheck, LogOut, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface UserNavMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  };
  placement?: 'up' | 'down' | 'auto';
  fullWidth?: boolean;
}

export function UserNavMenu({ user, placement = 'auto', fullWidth = false }: UserNavMenuProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/login' });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isUp = placement === 'up';

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`} ref={dropdownRef}>
      {/* ── Trigger Button ── */}
      {fullWidth ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer shadow-2xs group text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-[#7C3AED]">
                  {user?.name || 'Account'}
                </p>
                {isAdmin && (
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-purple-100 text-[#7C3AED] rounded-md uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
          {isUp ? (
            <ChevronUp size={14} className={`text-slate-400 group-hover:text-[#7C3AED] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronDown size={14} className={`text-slate-400 group-hover:text-[#7C3AED] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {getInitials(user?.name)}
          </div>
          <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate group-hover:text-[#7C3AED]">
            {user?.name || 'Account'}
          </span>
          {isAdmin && (
            <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-purple-100 text-[#7C3AED] rounded-md uppercase">
              Admin
            </span>
          )}
          <ChevronDown size={12} className={`text-slate-400 group-hover:text-[#7C3AED] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div
          className={`absolute ${fullWidth ? 'left-0 right-0 w-full' : 'right-0 w-56'} ${
            isUp ? 'bottom-full mb-2 animate-in fade-in slide-in-from-bottom-2' : 'top-full mt-2 animate-in fade-in slide-in-from-top-2'
          } bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-purple-900/10 py-2 z-50 duration-150`}
        >
          {/* User Info Header (if not fullWidth) */}
          {!fullWidth && (
            <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          )}

          {/* Menu Links */}
          <div className="space-y-0.5 px-1.5">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50 rounded-xl transition-colors"
              >
                <ShieldCheck size={15} className="text-[#7C3AED]" />
                <span>{t('Admin Dashboard', 'Admin Dashboard')}</span>
              </Link>
            )}

            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50 rounded-xl transition-colors"
            >
              <User size={15} className="text-[#7C3AED]" />
              <span>{t('My Account', 'My Account')}</span>
            </Link>

            {!isAdmin && (
              <Link
                href="/requests"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50 rounded-xl transition-colors"
              >
                <FileText size={15} className="text-[#7C3AED]" />
                <span>{t('My Requests', 'My Requests')}</span>
              </Link>
            )}
          </div>

          {/* Logout Option */}
          <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowConfirm(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <LogOut size={15} className="text-red-500" />
              <span>{t('Logout', 'Sign Out')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out Account"
        message="Are you sure you want to sign out of your Sandy Digital Hub account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        isLoading={isLoggingOut}
      />
    </div>
  );
}
