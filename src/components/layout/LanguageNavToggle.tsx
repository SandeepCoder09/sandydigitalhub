'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LanguageNavToggleProps {
  placement?: 'up' | 'down' | 'auto';
  compact?: boolean;
}

export function LanguageNavToggle({ placement = 'auto', compact = false }: LanguageNavToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isUp = placement === 'up';

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      {compact ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] transition-colors flex items-center justify-center border border-slate-200 hover:border-purple-200 shadow-2xs cursor-pointer group"
          aria-label="Select Language"
        >
          <span className="text-base leading-none">{language === 'hi' ? '🇮🇳' : '🇺🇸'}</span>
          <span className="absolute -bottom-1 -right-1 text-[8px] font-black uppercase bg-[#7C3AED] text-white px-1 py-0.2 rounded-md shadow-xs leading-tight">
            {language.toUpperCase()}
          </span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-xs font-black text-slate-700 hover:text-[#7C3AED] transition-all cursor-pointer shadow-2xs group"
          aria-label="Select Language"
        >
          <span className="text-sm leading-none">{language === 'hi' ? '🇮🇳' : '🇺🇸'}</span>
          <span className="font-black tracking-wider">{language.toUpperCase()}</span>
          {isUp ? (
            <ChevronUp size={12} className={`text-slate-400 group-hover:text-[#7C3AED] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronDown size={12} className={`text-slate-400 group-hover:text-[#7C3AED] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            isUp
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 animate-in fade-in slide-in-from-bottom-2'
              : 'top-full mt-2 left-0 animate-in fade-in slide-in-from-top-2'
          } w-28 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-purple-900/10 p-1 z-50 duration-150 space-y-0.5`}
        >
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-black transition-colors text-left cursor-pointer rounded-xl ${
              language === 'en'
                ? 'bg-purple-50 text-[#7C3AED]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">🇺🇸</span>
              <span>EN</span>
            </span>
            {language === 'en' && <span className="text-[#7C3AED] font-black">✓</span>}
          </button>

          <button
            onClick={() => {
              setLanguage('hi');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-black transition-colors text-left cursor-pointer rounded-xl ${
              language === 'hi'
                ? 'bg-purple-50 text-[#7C3AED]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">🇮🇳</span>
              <span>HI</span>
            </span>
            {language === 'hi' && <span className="text-[#7C3AED] font-black">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
