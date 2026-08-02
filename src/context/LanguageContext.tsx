'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultEn?: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  home: { en: 'Home', hi: 'होम' },
  services: { en: 'Services', hi: 'सेवाएं' },
  checklist: { en: 'Checklist', hi: 'चेकलिस्ट' },
  calculator: { en: 'Calculator', hi: 'कैल्कुलेटर' },
  trackOrder: { en: 'Track Order', hi: 'ऑर्डर ट्रैक करें' },
  portfolio: { en: 'Portfolio', hi: 'पोर्टफोलियो' },
  tools: { en: 'Tools', hi: 'टूल्स' },
  pricing: { en: 'Pricing', hi: 'मूल्य निर्धारण' },
  contact: { en: 'Contact', hi: 'संपर्क करें' },
  reviews: { en: 'Reviews', hi: 'समीक्षाएं' },
  resizer: { en: 'Govt Photo Resizer', hi: 'फोटो रिसाइजर' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sdh_lang') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sdh_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key: string, defaultEn?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return defaultEn || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
