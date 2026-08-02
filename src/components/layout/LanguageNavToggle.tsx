'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageNavToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[#FF4500] hover:bg-orange-100 transition-all font-bold text-xs cursor-pointer shadow-2xs"
      title="Switch Language / भाषा बदलें"
    >
      <Globe size={14} />
      <span>{language === 'en' ? 'EN' : 'हिंदी'}</span>
    </button>
  );
}
