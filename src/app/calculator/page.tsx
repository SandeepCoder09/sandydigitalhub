'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator, Check, ArrowRight, Sparkles, Zap, ShieldCheck,
  Building2, Globe, Smartphone, ShoppingCart, Lock, Database,
  FileText, Headphones, DollarSign, Download, PhoneCall, RefreshCw,
  Plus, CheckCircle2, ChevronRight, Copy, CheckCheck, Share2, X, AlertTriangle,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

interface SavedQuoteResult {
  quoteNumber: string;
  name: string;
  email: string;
  projectType: string;
  estimatedTotal: number;
  timelineWeeks: number;
  expiresAt: string;
  createdAt: string;
}

export default function CalculatorPage() {
  const [calculatorMode, setCalculatorMode] = useState<'studio' | 'hub'>('studio');

  // ── Studio Options ──
  const [projectType, setProjectType] = useState<'business' | 'webapp' | 'mobile' | 'uiux'>('business');
  const [pageCount, setPageCount] = useState<number>(5);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['seo']);
  const [timeline, setTimeline] = useState<'normal' | 'express'>('normal');

  // ── SARA Hub Facilitation Options ──
  const [selectedHubServices, setSelectedHubServices] = useState<string[]>(['pan_new']);
  const [deliveryOption, setDeliveryOption] = useState<'digital' | 'home_delivery'>('digital');

  // ── Quote Modal State ──
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    notes: '',
  });
  const [isSavingQuote, setIsSavingQuote] = useState(false);
  const [savedQuote, setSavedQuote] = useState<SavedQuoteResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Central Catalog Definitions
  const STUDIO_PACKAGES = {
    business: {
      id: 'pkg-business-website',
      name: 'Modern Business Website',
      base: 7999,
      timelineWeeks: 1,
      desc: 'Responsive 5-page custom website with fast Next.js architecture, SEO & contact integration.',
      icon: Globe,
    },
    webapp: {
      id: 'pkg-fullstack-webapp',
      name: 'Fullstack Web Application',
      base: 18999,
      timelineWeeks: 3,
      desc: 'Interactive platform with user authentication, custom database modeling & admin CMS dashboard.',
      icon: Database,
    },
    mobile: {
      id: 'pkg-mobile-app',
      name: 'Cross-Platform Mobile App',
      base: 28999,
      timelineWeeks: 4,
      desc: 'Native-feel iOS & Android application built with single codebase & cloud API connectivity.',
      icon: Smartphone,
    },
    uiux: {
      id: 'pkg-uiux-design',
      name: 'UI/UX Design & Prototype',
      base: 6499,
      timelineWeeks: 1,
      desc: 'Complete Figma design system, clickable interactive prototype & developer hand-off specs.',
      icon: Sparkles,
    },
  };

  const STUDIO_ADDONS = [
    { id: 'seo', name: 'Advanced SEO & Schema Setup', price: 1500, desc: 'Structured JSON-LD schema, sitemap & Analytics 4' },
    { id: 'payment', name: 'Payment Gateway Integration', price: 2500, desc: 'Razorpay / Stripe automated checkout & webhooks' },
    { id: 'live_chat', name: 'AI / Live Chat Widget', price: 1800, desc: 'Interactive chat widget with real-time assistant' },
    { id: 'multi_lang', name: 'Multi-Language Support (i18n)', price: 2000, desc: 'Full bilingual/multilingual localization setup' },
    { id: 'fast_track', name: 'Priority Fast-Track Delivery', price: 3500, desc: 'Accelerated sprint reducing timeline by up to 40%' },
  ];

  const HUB_SERVICES: Record<string, { title: string; price: number; desc: string }> = {
    pan_new: { title: 'New PAN Card Application Assistance', price: 220, desc: 'Form 49A preparation & e-KYC submission' },
    pan_corr: { title: 'PAN Card Correction & Reprint', price: 250, desc: 'Name, DOB, or photo change assistance' },
    income: { title: 'Income Certificate (आय प्रमाण पत्र)', price: 120, desc: 'State revenue portal facilitation' },
    caste: { title: 'Caste Certificate (जाति प्रमाण पत्र)', price: 120, desc: 'Category documentation & portal tracking' },
    domicile: { title: 'Domicile Certificate (निवास प्रमाण पत्र)', price: 120, desc: 'Residential status certificate filing' },
    passport: { title: 'Passport Application Online Filing', price: 1999, desc: 'Appointment booking & document checklist' },
    gst: { title: 'New GST Registration Assistance', price: 1499, desc: 'Tax portal verification & application filing' },
    epfo: { title: 'EPFO Balance Withdrawal & KYC Help', price: 350, desc: 'UAN activation & member portal claim tracking' },
  };

  // Calculations
  const calculateStudioBase = () => STUDIO_PACKAGES[projectType].base;
  const calculateStudioExtraPages = () => (pageCount > 5 ? (pageCount - 5) * 500 : 0);
  const calculateStudioAddOns = () =>
    selectedAddOns.reduce((sum, id) => {
      const item = STUDIO_ADDONS.find(a => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);

  const calculateStudioSubtotal = () => {
    let subtotal = calculateStudioBase() + calculateStudioExtraPages() + calculateStudioAddOns();
    if (timeline === 'express') subtotal += 2500; // Flat express surge
    return subtotal;
  };

  const calculateHubTotal = () => {
    let total = selectedHubServices.reduce((sum, sId) => {
      return sum + (HUB_SERVICES[sId] ? HUB_SERVICES[sId].price : 0);
    }, 0);
    if (deliveryOption === 'home_delivery') total += 100;
    return total;
  };

  const toggleStudioAddon = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleHubService = (id: string) => {
    setSelectedHubServices(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(s => s !== id) : prev
        : [...prev, id]
    );
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email) return;

    setIsSavingQuote(true);
    try {
      const selectedItemsList = [
        {
          id: STUDIO_PACKAGES[projectType].id,
          category: 'PACKAGE',
          name: STUDIO_PACKAGES[projectType].name,
          price: calculateStudioBase(),
          description: STUDIO_PACKAGES[projectType].desc,
        },
        ...selectedAddOns.map(id => {
          const addOn = STUDIO_ADDONS.find(a => a.id === id)!;
          return {
            id: addOn.id,
            category: 'ADDON',
            name: addOn.name,
            price: addOn.price,
            description: addOn.desc,
          };
        }),
      ];

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          companyName: quoteForm.companyName,
          projectType: STUDIO_PACKAGES[projectType].name,
          scope: `${pageCount} Pages ${timeline === 'express' ? '(Express 3-5 Days)' : '(Standard)'}`,
          timelineWeeks: STUDIO_PACKAGES[projectType].timelineWeeks,
          selectedItems: selectedItemsList,
          basePrice: calculateStudioBase() + calculateStudioExtraPages(),
          addOnsPrice: calculateStudioAddOns(),
          estimatedSubtotal: calculateStudioSubtotal(),
          taxRate: 0,
          taxAmount: 0,
          estimatedTotal: calculateStudioSubtotal(),
          notes: quoteForm.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedQuote(data.quote);
      }
    } catch (err) {
      console.error('Failed to save quote:', err);
    } finally {
      setIsSavingQuote(false);
    }
  };

  const copyQuoteSummary = () => {
    if (!savedQuote) return;
    const summary = `📄 PROJECT QUOTATION\nQuote ID: ${savedQuote.quoteNumber}\nProject: ${savedQuote.projectType}\nClient: ${savedQuote.name}\nEstimated Total: ₹${savedQuote.estimatedTotal.toLocaleString('en-IN')}\nValid Until: ${new Date(savedQuote.expiresAt).toLocaleDateString('en-IN')}\n\nGenerated via Sandy Digital Studio`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-8 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xs">
        <div className="max-w-5xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-bold uppercase tracking-wider">
            <Calculator size={13} /> Transparent Pricing Engine
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Ecosystem <span className="text-[#7C3AED]">Price Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-600 font-medium leading-relaxed">
            Generate itemized estimates for software engineering with <strong>SANDY DIGITAL STUDIO</strong> or citizen facilitation services through <strong>SARA DIGITAL HUB</strong>.
          </p>

          {/* Ecosystem Division Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 mt-2 shadow-xs">
            <button
              onClick={() => setCalculatorMode('studio')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                calculatorMode === 'studio'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe size={14} className="text-indigo-600" />
              <span>SANDY DIGITAL STUDIO (Software & Web)</span>
            </button>
            <button
              onClick={() => setCalculatorMode('hub')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                calculatorMode === 'hub'
                  ? 'bg-white text-purple-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={14} className="text-purple-600" />
              <span>SARA DIGITAL HUB (Citizen Services)</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ── MODE 1: SANDY DIGITAL STUDIO ESTIMATOR ── */}
        {calculatorMode === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left Selection Columns */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Package Selection */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">1</span>
                    Choose Project Category
                  </h2>
                  <span className="text-[11px] font-bold text-gray-400">Single Source Pricing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(STUDIO_PACKAGES) as Array<keyof typeof STUDIO_PACKAGES>).map(key => {
                    const item = STUDIO_PACKAGES[key];
                    const isSelected = projectType === key;
                    const Icon = item.icon;
                    return (
                      <div
                        key={key}
                        onClick={() => setProjectType(key)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                <Icon size={14} />
                              </div>
                              <span className="text-xs font-bold text-gray-900">{item.name}</span>
                            </div>
                            <CheckCircle2 size={16} className={isSelected ? 'text-indigo-600' : 'text-gray-300'} />
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium mt-2 leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400">Est. {item.timelineWeeks} Week(s)</span>
                          <span className="text-xs font-black text-indigo-700">₹{item.base.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Page Scope */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">2</span>
                    Estimated Page / Screen Scope
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black">
                    {pageCount} Pages / Views
                  </span>
                </div>
                <input
                  type="range" min="1" max="20" value={pageCount}
                  onChange={e => setPageCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                  <span>1 Page (Landing)</span>
                  <span>5 Pages (Included in Base)</span>
                  <span>20+ Pages (Platform Portal)</span>
                </div>
              </div>

              {/* Step 3: Add-on Modules */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">3</span>
                  Add-on Modules & Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STUDIO_ADDONS.map(addon => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleStudioAddon(addon.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-600'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-300'}`} />
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">{addon.name}</span>
                            <span className="text-[11px] text-gray-500 line-clamp-1">{addon.desc}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 shrink-0">+₹{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Timeline */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-black">4</span>
                  Delivery Timeline
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setTimeline('normal')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      timeline === 'normal' ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">Standard Delivery</div>
                    <div className="text-[11px] text-gray-500 mt-1">Normal agile sprint cycles (No surge)</div>
                  </button>
                  <button
                    onClick={() => setTimeline('express')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      timeline === 'express' ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Zap size={13} className="text-amber-500" />
                      Priority Fast-Track Delivery
                    </div>
                    <div className="text-[11px] text-indigo-700 font-semibold mt-1">+₹2,500 Dedicated sprint focus</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Sticky Cost Summary Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl sticky top-24 space-y-4 sm:space-y-5">
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      ESTIMATED PROJECT COST
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      Live Calculation
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    ₹{calculateStudioSubtotal().toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
                    Includes full intellectual property, production deployment & 30-day warranty.
                  </p>
                </div>

                {/* Itemized Cost Breakdown */}
                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Cost Breakdown
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Base Package ({STUDIO_PACKAGES[projectType].name}):</span>
                    <span>₹{calculateStudioBase().toLocaleString('en-IN')}</span>
                  </div>
                  {pageCount > 5 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Extra Pages ({pageCount - 5} × ₹500):</span>
                      <span>+₹{calculateStudioExtraPages().toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Selected Add-ons ({selectedAddOns.length}):</span>
                      <span>+₹{calculateStudioAddOns().toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {timeline === 'express' && (
                    <div className="flex justify-between text-amber-400 font-bold">
                      <span>Express Priority Surge:</span>
                      <span>+₹2,500</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800">
                    <span>Estimated Subtotal:</span>
                    <span>₹{calculateStudioSubtotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Transparency Disclaimer Notice */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 leading-relaxed font-medium">
                  <p className="flex items-start gap-1.5">
                    <ShieldCheck size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{ECOSYSTEM_CONFIG.disclaimers.quoteNotice}</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-1">
                  <Button
                    onClick={() => { setSavedQuote(null); setIsQuoteModalOpen(true); }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs h-11 shadow-lg shadow-indigo-950 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    Save & Generate Official Quote ID
                  </Button>

                  <a
                    href={`https://wa.me/919118269278?text=Hello%20Sandy%20Digital%20Studio,%20I%20calculated%20an%20estimate%20of%20₹${calculateStudioSubtotal()}%20for%20a%20${encodeURIComponent(STUDIO_PACKAGES[projectType].name)}.%20Please%20guide%20me.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 rounded-xl text-xs font-bold h-10 cursor-pointer"
                    >
                      Discuss on WhatsApp (+91 9118269278)
                    </Button>
                  </a>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ── MODE 2: SARA DIGITAL HUB CITIZEN SERVICES ESTIMATOR ── */}
        {calculatorMode === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    Select Citizen Facilitation Services
                  </h2>
                  <span className="text-[11px] font-bold text-gray-400">Fixed Facilitation Fees</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(HUB_SERVICES).map(sId => {
                    const item = HUB_SERVICES[sId];
                    const isSelected = selectedHubServices.includes(sId);
                    return (
                      <div
                        key={sId}
                        onClick={() => toggleHubService(sId)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-purple-50/70 border-purple-600'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${isSelected ? 'text-purple-600' : 'text-gray-300'}`} />
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">{item.title}</span>
                            <span className="text-[11px] text-gray-500 mt-0.5">{item.desc}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-purple-700 shrink-0">₹{item.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery mode */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-sm sm:text-base font-black text-gray-900">Document Delivery & Fulfillment</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeliveryOption('digital')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryOption === 'digital' ? 'bg-purple-50 border-purple-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">Digital / Partner Center Pickup</div>
                    <div className="text-[11px] text-gray-500 mt-1">Download PDF online or pick at nearest partner center (Free)</div>
                  </button>
                  <button
                    onClick={() => setDeliveryOption('home_delivery')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryOption === 'home_delivery' ? 'bg-purple-50 border-purple-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">Doorstep Laminated Delivery</div>
                    <div className="text-[11px] text-purple-700 font-semibold mt-1">Physical laminated print delivery in Fatehpur (+₹100)</div>
                  </button>
                </div>
              </div>

              {/* Legal disclaimer */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle size={14} className="text-amber-700" />
                  <span>Important Service Disclaimer</span>
                </div>
                {ECOSYSTEM_CONFIG.disclaimers.facilitationNotice}
              </div>

            </div>

            {/* Right Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl sticky top-24 space-y-4 sm:space-y-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    SARA DIGITAL HUB TOTAL
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    ₹{calculateHubTotal().toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Includes official portal fees + digital facilitation charges.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Selected Services ({selectedHubServices.length}):</span>
                    <span>₹{calculateHubTotal() - (deliveryOption === 'home_delivery' ? 100 : 0)}</span>
                  </div>
                  {deliveryOption === 'home_delivery' && (
                    <div className="flex justify-between text-purple-400 font-bold">
                      <span>Doorstep Lamination Delivery:</span>
                      <span>+₹100</span>
                    </div>
                  )}
                </div>

                <Link href="/services">
                  <Button className="w-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold rounded-xl text-xs h-11 shadow-lg cursor-pointer">
                    Apply Online via Services Hub <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── SAVE QUOTE MODAL (Generates SDS-2026-XXXXX) ── */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  {savedQuote ? 'Official Quotation Generated' : 'Save Project Quotation'}
                </h3>
                <p className="text-xs text-gray-500 font-medium">SANDY DIGITAL STUDIO Pricing Engine</p>
              </div>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {!savedQuote ? (
              <form onSubmit={handleSaveQuote} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text" required
                    value={quoteForm.name}
                    onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email" required
                      value={quoteForm.email}
                      onChange={e => setQuoteForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={quoteForm.phone}
                      onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brand Name (Optional)</label>
                  <input
                    type="text"
                    value={quoteForm.companyName}
                    onChange={e => setQuoteForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="e.g. Apex Tech Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-indigo-900 block">{STUDIO_PACKAGES[projectType].name}</span>
                    <span className="text-gray-500 text-[11px]">{pageCount} Pages · {selectedAddOns.length} Add-ons</span>
                  </div>
                  <span className="text-base font-black text-indigo-700">₹{calculateStudioSubtotal().toLocaleString('en-IN')}</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSavingQuote}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs h-11 cursor-pointer"
                >
                  {isSavingQuote ? 'Generating Quote...' : 'Confirm & Save Quotation'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <BadgeCheck size={26} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Quotation Reference</div>
                  <div className="text-2xl font-black text-indigo-700 tracking-wider mt-0.5">
                    {savedQuote.quoteNumber}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Estimate of <strong>₹{savedQuote.estimatedTotal.toLocaleString('en-IN')}</strong> is saved and valid for 30 days.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Client:</span>
                    <span className="font-bold text-gray-800">{savedQuote.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Project:</span>
                    <span className="font-bold text-gray-800">{savedQuote.projectType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Valid Until:</span>
                    <span className="font-bold text-gray-800">{new Date(savedQuote.expiresAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyQuoteSummary}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copied ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copied ? 'Copied Summary' : 'Copy Quote Details'}
                  </button>
                  <a
                    href={`https://wa.me/919118269278?text=Hello%20Sandy%20Digital%20Studio,%20I%20saved%20Quotation%20${savedQuote.quoteNumber}%20for%20₹${savedQuote.estimatedTotal}.%20Let's%20discuss%20the%20scope.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <button className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <Share2 size={14} /> Send on WhatsApp
                    </button>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
