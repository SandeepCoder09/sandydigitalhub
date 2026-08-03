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
  Home: { en: 'Home', hi: 'होम' },
  Services: { en: 'Services', hi: 'सेवाएं' },
  Checklist: { en: 'Checklist', hi: 'दस्तावेज़ चेकलिस्ट' },
  Calculator: { en: 'Calculator', hi: 'प्राइस कैल्कुलेटर' },
  'Track Order': { en: 'Track Order', hi: 'ऑर्डर ट्रैक करें' },
  Portfolio: { en: 'Portfolio', hi: 'पोर्टफोलियो' },
  Reviews: { en: 'Reviews', hi: 'समीक्षाएं' },
  Resizer: { en: 'Govt Photo Resizer', hi: 'फोटो रिसाइजर' },
  Tools: { en: 'Tools', hi: 'टूल्स' },
  Pricing: { en: 'Pricing', hi: 'मूल्य निर्धारण' },
  Contact: { en: 'Contact', hi: 'संपर्क करें' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Trigger Google Translate engine for full page translation
  const applyGoogleTranslate = (lang: Language) => {
    if (typeof window === 'undefined') return;

    const cookieValue = lang === 'hi' ? '/en/hi' : '/en/en';
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;

    // Trigger select element if Google Translate widget is mounted
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = lang === 'hi' ? 'hi' : 'en';
      combo.dispatchEvent(new Event('change'));
    } else if (lang === 'hi') {
      // Reload once to apply cookie translation if element is not initialized
      window.location.reload();
    }
  };

  useEffect(() => {
    // Inject Google Translate script silently in background
    if (typeof window !== 'undefined' && !document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'hi,en', layout: 0 },
            'google_translate_element'
          );
        }
      };
    }

    const saved = localStorage.getItem('sdh_lang') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguageState(saved);
      if (saved === 'hi') {
        applyGoogleTranslate('hi');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sdh_lang', lang);
    applyGoogleTranslate(lang);
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
      {/* Hidden container for Google Translate engine */}
      <div id="google_translate_element" className="hidden" style={{ display: 'none' }} />
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      `}</style>
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
