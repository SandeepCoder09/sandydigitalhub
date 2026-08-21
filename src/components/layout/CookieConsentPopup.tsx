'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Check, Settings2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { clientCookies, COOKIE_KEYS } from '@/lib/cookies';
import { useLanguage } from '@/context/LanguageContext';

export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  preferences: boolean;
  timestamp: number;
}

export function CookieConsentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { language } = useLanguage();

  const [preferences, setPreferences] = useState<{
    performance: boolean;
    preferences: boolean;
  }>({
    performance: true,
    preferences: true,
  });

  useEffect(() => {
    // Check if consent has already been given
    const consent = clientCookies.getJSON<CookiePreferences>(COOKIE_KEYS.COOKIE_CONSENT);
    if (!consent) {
      // Delay showing slightly so it feels smooth after initial page render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: { performance: boolean; preferences: boolean }) => {
    const data: CookiePreferences = {
      essential: true, // Always required
      performance: prefs.performance,
      preferences: prefs.preferences,
      timestamp: Date.now(),
    };

    clientCookies.setJSON(COOKIE_KEYS.COOKIE_CONSENT, data, { days: 365 });
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ performance: true, preferences: true });
  };

  const handleEssentialOnly = () => {
    saveConsent({ performance: false, preferences: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  const isHindi = language === 'hi';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-xl p-5 md:p-6 text-white shadow-2xl shadow-black/60 ring-1 ring-white/10">
            {/* Ambient background glow */}
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-md shadow-amber-500/30">
                  <Cookie className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-white tracking-tight flex items-center gap-1.5">
                    {isHindi ? 'कुकी और डेटा प्राथमिकताएं' : 'We Value Your Privacy'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isHindi ? 'बेहतर गति और अनुभव के लिए' : 'Optimizing speed & user experience'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleEssentialOnly}
                aria-label="Close"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-slate-300 mb-4">
              {isHindi
                ? 'हम आपके अनुभव को तेज बनाने, सर्वर लोड कम करने और सुरक्षित सेवाएं प्रदान करने के लिए आवश्यक कुकीज़ और कैशिंग का उपयोग करते हैं।'
                : 'We use cookies and local caching to ensure high performance, reduce server load, keep you logged in safely, and personalize your digital experience.'}
            </p>

            {/* Preferences Accordion */}
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2.5 mb-4 pt-2 border-t border-white/10 text-xs"
              >
                {/* Essential */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="font-medium text-slate-200">
                        {isHindi ? 'आवश्यक कुकीज़ (अनिवार्य)' : 'Strictly Necessary'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isHindi ? 'लॉगिन, सुरक्षा और नेविगेशन' : 'Authentication & server security'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isHindi ? 'सक्रिय' : 'Required'}
                  </span>
                </div>

                {/* Performance & Cache */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-medium text-slate-200">
                      {isHindi ? 'प्रदर्शन और कैशिंग' : 'Performance & Cache'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isHindi ? 'सर्वर लोड कम करने और तेज लोडिंग के लिए' : 'Reduces server load & speeds page loads'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.performance}
                    onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-400/40"
                  />
                </label>

                {/* Preferences */}
                <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-medium text-slate-200">
                      {isHindi ? 'व्यक्तिगत सेटिंग्स' : 'Functional Preferences'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isHindi ? 'थीम और भाषा याद रखने के लिए' : 'Remembers language & theme choice'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-400/40"
                  />
                </label>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              {showSettings ? (
                <button
                  onClick={handleSaveCustom}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  {isHindi ? 'सेटिंग्स सेव करें' : 'Save Preferences'}
                </button>
              ) : (
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  {isHindi ? 'सभी स्वीकार करें' : 'Accept All'}
                </button>
              )}

              <button
                onClick={handleEssentialOnly}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
              >
                {isHindi ? 'केवल आवश्यक' : 'Essential Only'}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                title={showSettings ? 'Hide preferences' : 'Customize preferences'}
                className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors shrink-0 flex items-center gap-1 text-xs cursor-pointer"
              >
                <Settings2 className="h-4 w-4" />
                {showSettings ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieConsentPopup;
