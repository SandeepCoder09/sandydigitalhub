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

  // In compact (collapsed sidebar) mode, pop out cleanly to the right of the sidebar
  const dropdownPositionClass = compact
    ? 'bottom-0 left-full ml-3 w-36 animate-in fade-in slide-in-from-left-2'
    : isUp
    ? 'bottom-full mb-2 left-0 w-32 animate-in fade-in slide-in-from-bottom-2'
    : 'top-full mt-2 left-0 w-32 animate-in fade-in slide-in-from-top-2';

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button */}
      {compact ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer group ${
            isOpen ? 'bg-purple-100/70 text-[#7C3AED]' : 'hover:bg-slate-100'
          }`}
          aria-label="Select Language"
          title={`Language: ${language.toUpperCase()} (Click to change)`}
        >
          <Globe size={16} className={isOpen ? 'text-[#7C3AED]' : 'text-slate-600 group-hover:text-slate-900'} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer group"
          aria-label="Select Language"
        >
          <Globe size={13.5} className="text-slate-500 group-hover:text-slate-700" />
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
          className={`absolute ${dropdownPositionClass} bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 p-1.5 z-50 duration-150 space-y-1`}
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-0.5">
            Language
          </div>
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer rounded-lg whitespace-nowrap ${
              language === 'en'
                ? 'bg-purple-50 text-[#7C3AED] font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>English (EN)</span>
            {language === 'en' && <span className="text-[#7C3AED] font-bold text-xs">✓</span>}
          </button>

          <button
            onClick={() => {
              setLanguage('hi');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer rounded-lg whitespace-nowrap ${
              language === 'hi'
                ? 'bg-purple-50 text-[#7C3AED] font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>हिंदी (HI)</span>
            {language === 'hi' && <span className="text-[#7C3AED] font-bold text-xs">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
