'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';

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
          className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer group"
          aria-label="Select Language"
          title={`Language: ${language.toUpperCase()}`}
        >
          <Globe size={15} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-200/60 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer group"
          aria-label="Select Language"
        >
          <Globe size={13} className="text-slate-500 group-hover:text-slate-700" />
          <span className="tracking-wide text-[11.5px]">{language.toUpperCase()}</span>
          {isUp ? (
            <ChevronUp size={11} className={`text-slate-400 group-hover:text-slate-700 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronDown size={11} className={`text-slate-400 group-hover:text-slate-700 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            isUp
              ? 'bottom-full mb-2 left-0 animate-in fade-in slide-in-from-bottom-2'
              : 'top-full mt-2 left-0 animate-in fade-in slide-in-from-top-2'
          } w-28 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-900/10 p-1 z-50 duration-150 space-y-0.5`}
        >
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer rounded-lg ${
              language === 'en'
                ? 'bg-purple-50 text-[#7C3AED] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>English</span>
            {language === 'en' && <span className="text-[#7C3AED] font-bold">✓</span>}
          </button>

          <button
            onClick={() => {
              setLanguage('hi');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer rounded-lg ${
              language === 'hi'
                ? 'bg-purple-50 text-[#7C3AED] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>हिंदी (HI)</span>
            {language === 'hi' && <span className="text-[#7C3AED] font-bold">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
