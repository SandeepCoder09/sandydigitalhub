'use client';

import { useState, useMemo } from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Search, Sparkles, SlidersHorizontal, Layers, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ServicesCatalogClientProps {
  initialServices: any[];
}

export function ServicesCatalogClient({ initialServices }: ServicesCatalogClientProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialServices.map((s) => s.category).filter(Boolean)));
    return ['ALL', ...cats];
  }, [initialServices]);

  // Filter services by search and category
  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      const matchesSearch =
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialServices, searchQuery, selectedCategory]);

  // Group filtered services by category (if viewing ALL) or single category
  const groupedServices = useMemo(() => {
    return filteredServices.reduce((acc: Record<string, any[]>, service: any) => {
      const cat = service.category || 'General Services';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    }, {});
  }, [filteredServices]);

  return (
    <div className="space-y-10">
      {/* ─────────────────────────────────────────────────────────────
          1. SEARCH & CATEGORY FILTER BAR (Fully Responsive)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-slate-200/90 shadow-sm space-y-3 sm:space-y-4">
        {/* Search Input */}
        <div className="relative w-full max-w-2xl mx-auto">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none sm:w-[19px] sm:h-[19px]" />
          <input
            type="text"
            placeholder={t('Search services by name, keywords...', 'Search services by name, keywords (e.g. Aadhaar, PAN, GST, ITR)...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-9 sm:pr-11 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/15 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-[#7C3AED] rounded-full w-5 h-5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar sm:justify-center flex-wrap">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'ALL'
                ? initialServices.length
                : initialServices.filter((s) => s.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] border border-slate-200/60'
                }`}
              >
                <span>{cat === 'ALL' ? t('All Services', 'All Services') : cat}</span>
                <span
                  className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SERVICE CATALOG GRID (Responsive Breakpoints)
      ───────────────────────────────────────────────────────────── */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto text-xl sm:text-2xl">
            🔍
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">No Services Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any services matching "{searchQuery}". Try searching with a different keyword or view all services.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#6D28D9] transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-12">
          {Object.entries(groupedServices).map(([category, items]) => (
            <div key={category} className="space-y-3 sm:space-y-6">
              {/* Category Heading with Item Counter */}
              <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-2 sm:w-2.5 h-4 sm:h-6 bg-[#7C3AED] rounded-full" />
                  <h2 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">{category}</h2>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-200/80">
                  {items.length} {items.length === 1 ? 'Service' : 'Services'}
                </span>
              </div>

              {/* Grid: 2 cols on mobile, 2 cols on tablet/laptop, 3 cols on xl, 4 cols on 2xl */}
              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-6">
                {items.map((service: any) => (
                  <ServiceCard key={service._id?.toString() || service.id} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
