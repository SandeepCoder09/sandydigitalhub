'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageNavToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold shrink-0">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-[#FF4500] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Switch to English"
      >
        EN
      </button>
      <span className="text-gray-300 text-[10px]">|</span>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-[#FF4500] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="हिंदी में बदलें"
      >
        हिंदी
      </button>
    </div>
  );
}
