'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function LanguageNavToggle() {
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

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Trigger Button showing active flag & code */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs font-extrabold text-slate-700 hover:text-[#2563EB] transition-all cursor-pointer shadow-xs group"
        title="Select Language / भाषा चुनें"
      >
        <span className="text-sm leading-none">{language === 'hi' ? '🇮🇳' : '🇺🇸'}</span>
        <span>{language === 'hi' ? 'हिंदी' : 'EN'}</span>
        <ChevronDown size={12} className={`text-slate-400 group-hover:text-[#2563EB] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu — text hidden until clicked */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors text-left cursor-pointer ${
              language === 'en'
                ? 'bg-blue-50 text-[#2563EB]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-base leading-none">🇺🇸</span>
            <span>English</span>
            {language === 'en' && <span className="ml-auto text-[#2563EB] font-bold">✓</span>}
          </button>

          <button
            onClick={() => {
              setLanguage('hi');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-colors text-left cursor-pointer ${
              language === 'hi'
                ? 'bg-blue-50 text-[#2563EB]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-base leading-none">🇮🇳</span>
            <span>हिंदी</span>
            {language === 'hi' && <span className="ml-auto text-[#2563EB] font-bold">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
