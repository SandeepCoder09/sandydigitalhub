'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calculator, Check, ArrowRight, Sparkles, Zap, ShieldCheck,
  Building, Globe, Smartphone, ShoppingCart, Lock, Database,
  FileText, Headphones, DollarSign, Download, PhoneCall, RefreshCw,
  Plus, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalculatorPage() {
  const [calculatorMode, setCalculatorMode] = useState<'web' | 'govt'>('web');

  // ── Web & App Dev Options ──
  const [projectType, setProjectType] = useState<'landing' | 'business' | 'ecommerce' | 'custom_app'>('business');
  const [pageCount, setPageCount] = useState<number>(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['responsive', 'seo']);
  const [timeline, setTimeline] = useState<'normal' | 'express'>('normal');

  // ── Govt & Cyber Service Options ──
  const [selectedGovtServices, setSelectedGovtServices] = useState<string[]>(['income']);
  const [deliveryOption, setDeliveryOption] = useState<'digital' | 'home_delivery'>('digital');

  // Web feature catalog
  const WEB_FEATURES = [
    { id: 'responsive', name: 'Responsive Mobile UI & Glassmorphism', price: 0, required: true },
    { id: 'seo', name: 'Search Engine Optimization (SEO)', price: 1500 },
    { id: 'admin_panel', name: 'Admin Dashboard & Content CMS', price: 3500 },
    { id: 'payment', name: 'Payment Gateway Integration (Razorpay)', price: 2500 },
    { id: 'suzu_ai', name: 'SUZU AI Assistant & Live Chatbot', price: 4000 },
    { id: 'auth', name: 'User Login & Auth System', price: 2000 },
    { id: 'domain_hosting', name: 'Domain + SSL + 1 Yr High Speed Hosting', price: 2500 },
    { id: 'multi_lang', name: 'Multi-Language Support (Hindi & English)', price: 1800 },
  ];

  const PROJECT_BASE_PRICES = {
    landing: { name: 'Single Page Landing Site', base: 3999, desc: 'High-converting single page for business marketing' },
    business: { name: 'Full Business Website', base: 7999, desc: 'Multi-page professional business website with CMS' },
    ecommerce: { name: 'E-Commerce Online Store', base: 14999, desc: 'Online shop with product catalog, cart & payments' },
    custom_app: { name: 'Custom SaaS / Web Application', base: 24999, desc: 'Complex web app, portal, or mobile-first platform' },
  };

  const GOVT_SERVICE_PRICES: Record<string, { title: string; price: number }> = {
    income: { title: 'Income Certificate (आय प्रमाण पत्र)', price: 120 },
    caste: { title: 'Caste Certificate (जाति प्रमाण पत्र)', price: 120 },
    domicile: { title: 'Domicile / Niwas (निवास प्रमाण पत्र)', price: 120 },
    pan_new: { title: 'New PAN Card (नया पैन कार्ड)', price: 220 },
    pan_corr: { title: 'PAN Correction (संशोधन)', price: 250 },
    passport: { title: 'Passport Application Assistance', price: 1999 },
    gst: { title: 'New GST Registration', price: 1499 },
    epfo: { title: 'EPFO Claim / KYC Correction', price: 350 },
  };

  // Calculations
  const calculateWebTotal = () => {
    let total = PROJECT_BASE_PRICES[projectType].base;
    if (pageCount > 5) {
      total += (pageCount - 5) * 500;
    }
    selectedFeatures.forEach(fId => {
      const feat = WEB_FEATURES.find(f => f.id === fId);
      if (feat) total += feat.price;
    });
    if (timeline === 'express') total *= 1.25; // 25% express charge
    return Math.round(total);
  };

  const calculateGovtTotal = () => {
    let total = 0;
    selectedGovtServices.forEach(sId => {
      if (GOVT_SERVICE_PRICES[sId]) total += GOVT_SERVICE_PRICES[sId].price;
    });
    if (deliveryOption === 'home_delivery') total += 100;
    return total;
  };

  const toggleFeature = (id: string) => {
    if (id === 'responsive') return; // mandatory
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleGovtService = (id: string) => {
    setSelectedGovtServices(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(s => s !== id) : prev) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-10 sm:pt-14 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-purple-50 rounded-full blur-3xl opacity-80" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Calculator size={14} /> Instant Quotation Calculator
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            Transparent <span className="text-[#7C3AED]">Price Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Calculate instant estimated pricing for Website Development, Mobile Apps, or Jan Seva government services with zero hidden charges.
          </p>

          {/* Calculator Mode Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 mt-4 shadow-xs">
            <button
              onClick={() => setCalculatorMode('web')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                calculatorMode === 'web'
                  ? 'bg-white text-[#7C3AED] shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Globe size={15} /> Web & App Project Quote
            </button>
            <button
              onClick={() => setCalculatorMode('govt')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                calculatorMode === 'govt'
                  ? 'bg-white text-[#7C3AED] shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileText size={15} /> Jan Seva Services Estimator
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* MODE A: WEB & APP CALCULATOR */}
        {calculatorMode === 'web' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Options Selector Panel */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Project Type */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#7C3AED] text-xs flex items-center justify-center font-black">1</span>
                  Select Project Category
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(PROJECT_BASE_PRICES) as Array<keyof typeof PROJECT_BASE_PRICES>).map(key => {
                    const item = PROJECT_BASE_PRICES[key];
                    const isSelected = projectType === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setProjectType(key)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-50/70 border-[#7C3AED] ring-1 ring-[#7C3AED]'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{item.name}</span>
                            <CheckCircle2 size={16} className={isSelected ? 'text-[#7C3AED]' : 'text-gray-300'} />
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium mt-1 leading-snug">{item.desc}</p>
                        </div>
                        <div className="text-xs font-extrabold text-[#7C3AED] mt-3">
                          Base: ₹{item.base.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Page Count Slider */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-[#7C3AED] text-xs flex items-center justify-center font-black">2</span>
                    Estimated Page Count
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-extrabold">
                    {pageCount} Pages
                  </span>
                </div>
                <input
                  type="range" min="1" max="20" value={pageCount}
                  onChange={e => setPageCount(Number(e.target.value))}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                  <span>1 Page (Landing)</span>
                  <span>5 Pages (Standard)</span>
                  <span>20+ Pages (Portal)</span>
                </div>
              </div>

              {/* Step 3: Addon Features */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#7C3AED] text-xs flex items-center justify-center font-black">3</span>
                  Add-on Modules & Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WEB_FEATURES.map(feat => {
                    const isSelected = selectedFeatures.includes(feat.id);
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-purple-50/70 border-[#7C3AED]'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={18} className={isSelected ? 'text-[#7C3AED]' : 'text-gray-300'} />
                          <span className="text-xs font-bold text-gray-800">{feat.name}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-600 shrink-0">
                          {feat.price === 0 ? 'Included' : `+₹${feat.price}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Urgency Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#7C3AED] text-xs flex items-center justify-center font-black">4</span>
                  Delivery Timeline
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTimeline('normal')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      timeline === 'normal' ? 'bg-purple-50 border-[#7C3AED]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">Standard Delivery (7 - 14 Days)</div>
                    <div className="text-[11px] text-gray-500 mt-1">Normal delivery timeline</div>
                  </button>

                  <button
                    onClick={() => setTimeline('express')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      timeline === 'express' ? 'bg-purple-50 border-[#7C3AED]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">⚡ Express Fast Track (3 - 5 Days)</div>
                    <div className="text-[11px] text-purple-600 font-semibold mt-1">+25% Priority Surge</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Price Output Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-gray-800 shadow-xl sticky top-24 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    Live Quotation Estimate
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    ₹{calculateWebTotal().toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-gray-400 ml-1.5">+ Tax</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    Includes source code, deployment, SSL & 30-day free support.
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-800 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Base ({PROJECT_BASE_PRICES[projectType].name}):</span>
                    <span>₹{PROJECT_BASE_PRICES[projectType].base.toLocaleString('en-IN')}</span>
                  </div>
                  {pageCount > 5 && (
                    <div className="flex justify-between text-gray-300">
                      <span>Extra Pages ({pageCount - 5}):</span>
                      <span>+₹{(pageCount - 5) * 500}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Selected Addons ({selectedFeatures.length}):</span>
                    <span>
                      +₹{selectedFeatures.reduce((acc, fId) => acc + (WEB_FEATURES.find(f => f.id === fId)?.price || 0), 0)}
                    </span>
                  </div>
                  {timeline === 'express' && (
                    <div className="flex justify-between text-blue-400 font-bold">
                      <span>Express Surge (+25%):</span>
                      <span>Applied</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <Link href={`/checkout?quote=${calculateWebTotal()}&type=${projectType}`}>
                    <Button className="w-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold rounded-xl text-xs py-3 shadow-lg shadow-blue-950">
                      Book This Project Now <ArrowRight size={14} />
                    </Button>
                  </Link>
                  <a href="tel:+918756454282" className="block">
                    <Button variant="outline" className="w-full border-gray-700 text-gray-200 hover:bg-gray-800 rounded-xl text-xs font-bold">
                      📞 Discuss Requirement (+91 8756454282)
                    </Button>
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* MODE B: GOVT & CYBER SERVICES ESTIMATOR */}
        {calculatorMode === 'govt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <FileText size={18} className="text-[#7C3AED]" /> Select Government / Jan Seva Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(GOVT_SERVICE_PRICES).map(sId => {
                    const item = GOVT_SERVICE_PRICES[sId];
                    const isSelected = selectedGovtServices.includes(sId);
                    return (
                      <div
                        key={sId}
                        onClick={() => toggleGovtService(sId)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected ? 'bg-purple-50 border-[#7C3AED]' : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className={isSelected ? 'text-[#7C3AED]' : 'text-gray-300'} />
                          <span className="text-xs font-bold text-gray-900">{item.title}</span>
                        </div>
                        <span className="text-xs font-extrabold text-[#7C3AED]">₹{item.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Option */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-gray-900">Document Delivery Option</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeliveryOption('digital')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryOption === 'digital' ? 'bg-purple-50 border-[#7C3AED]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">Digital / Shop Pickup</div>
                    <div className="text-[11px] text-gray-500 mt-1">Download PDF online or pick at shop (Free)</div>
                  </button>

                  <button
                    onClick={() => setDeliveryOption('home_delivery')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryOption === 'home_delivery' ? 'bg-purple-50 border-[#7C3AED]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-900">🚚 Doorstep Hardcopy Delivery</div>
                    <div className="text-[11px] text-purple-600 font-semibold mt-1">Laminated print delivered in Fatehpur (+₹100)</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Price Output */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-gray-800 shadow-xl sticky top-24 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    Total Estimated Amount
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    ₹{calculateGovtTotal()}
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    Includes official government portal fee + processing charge.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link href="/checkout">
                    <Button className="w-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold rounded-xl text-xs py-3 shadow-lg">
                      Apply Now <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
