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
  // Nav routes
  Home: { en: 'Home', hi: 'होम' },
  Services: { en: 'Services', hi: 'सेवाएं' },
  Checklist: { en: 'Checklist', hi: 'दस्तावेज़ चेकलिस्ट' },
  Calculator: { en: 'Calculator', hi: 'प्राइस कैल्कुलेटर' },
  'Track Order': { en: 'Track Order', hi: 'ऑर्डर ट्रैक करें' },
  Portfolio: { en: 'Portfolio', hi: 'पोर्टफोलियो' },
  Reviews: { en: 'Reviews', hi: 'ग्राहक समीक्षाएं' },
  Resizer: { en: 'Govt Photo Resizer', hi: 'फोटो रिसाइजर' },
  Tools: { en: 'Tools', hi: 'डिजिटल टूल्स' },
  Pricing: { en: 'Pricing', hi: 'मूल्य निर्धारण' },
  Contact: { en: 'Contact', hi: 'संपर्क करें' },

  // General UI
  Login: { en: 'Login', hi: 'लॉग इन' },
  'Get Started': { en: 'Get Started', hi: 'शुरू करें' },
  'My Account': { en: 'My Account', hi: 'मेरा खाता' },
  'My Requests': { en: 'My Requests', hi: 'अनुरोध देखें' },
  Admin: { en: 'Admin', hi: 'एडमिन' },
  Logout: { en: 'Logout', hi: 'लॉग आउट' },
  'Apply Online': { en: 'Apply Online', hi: 'ऑनलाइन आवेदन करें' },
  'Proceed to Checkout': { en: 'Proceed to Checkout', hi: 'चेकआउट पर जाएं' },
  'Track Status': { en: 'Track Status', hi: 'स्थिति ट्रैक करें' },
  Search: { en: 'Search', hi: 'खोजें' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Clear any old google translate cookies to remove the top Google Translate banner
    if (typeof document !== 'undefined') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    }

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
