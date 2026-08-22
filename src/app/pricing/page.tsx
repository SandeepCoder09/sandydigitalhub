import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles, Globe, ShieldCheck, Zap, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_STUDIO_PACKAGES, DEFAULT_STUDIO_ADDONS } from '@/lib/pricingData';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

export const metadata: Metadata = {
  title: 'Development Packages & Pricing | SANDY DIGITAL STUDIO',
  description: 'Transparent fixed packages and custom quotation estimates for web development, fullstack apps, and mobile engineering.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-24">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Globe size={13} /> {ECOSYSTEM_CONFIG.divisions.sandyStudio.name}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Transparent <span className="text-indigo-400">Engineering Packages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Fixed-price development packages with source code ownership, SSL, responsive layout, and post-launch support.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/calculator">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <Calculator size={14} /> Open Custom Project Calculator →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {DEFAULT_STUDIO_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'bg-slate-900 text-white border-2 border-indigo-500 shadow-xl shadow-indigo-950/40 relative'
                  : 'bg-white text-slate-900 border border-gray-200 shadow-xs hover:shadow-md'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Recommended
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black">{pkg.name}</h3>
                  <p className={`text-xs mt-1 font-medium leading-relaxed ${pkg.popular ? 'text-slate-400' : 'text-gray-500'}`}>
                    {pkg.tagline}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl ${pkg.popular ? 'bg-slate-800' : 'bg-indigo-50'}`}>
                  <div className="text-xs font-bold text-gray-400 uppercase">Starting at</div>
                  <div className={`text-2xl sm:text-3xl font-black ${pkg.popular ? 'text-indigo-400' : 'text-indigo-700'}`}>
                    ₹{pkg.basePrice.toLocaleString('en-IN')}
                  </div>
                  <div className={`text-[10px] font-semibold ${pkg.popular ? 'text-slate-400' : 'text-indigo-900'}`}>
                    Est. {pkg.timelineWeeks} Week{pkg.timelineWeeks !== 1 ? 's' : ''} Delivery
                  </div>
                </div>

                <ul className="space-y-2 pt-2 text-xs font-medium">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={14} className={`shrink-0 mt-0.5 ${pkg.popular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <span className={pkg.popular ? 'text-slate-300' : 'text-gray-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800">
                <Link href={`/calculator?package=${pkg.category.toLowerCase()}`}>
                  <Button
                    className={`w-full text-xs font-bold rounded-xl h-10 cursor-pointer ${
                      pkg.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Customize Scope →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons & Custom Modules */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-gray-900">Add-on Modules & Enhancements</h2>
              <p className="text-xs text-gray-500 font-medium">Integrate additional features into any development tier.</p>
            </div>
            <Link href="/calculator">
              <span className="text-xs font-bold text-indigo-700 hover:underline">Calculate Total with Addons →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_STUDIO_ADDONS.map((addon) => (
              <div key={addon.id} className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900">{addon.name}</h3>
                  <span className="text-xs font-black text-indigo-700">+₹{addon.price}</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 leading-relaxed font-medium flex items-start gap-2">
          <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
          <span>{ECOSYSTEM_CONFIG.disclaimers.quoteNotice}</span>
        </div>
      </div>
    </div>
  );
}
