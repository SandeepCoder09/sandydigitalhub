'use client';

import { useState, useMemo } from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Search, Sparkles, SlidersHorizontal, Layers, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useDebounceValue } from '@/hooks/useDebounce';
import { EmptyState } from '@/components/ui/EmptyState';

interface ServicesCatalogClientProps {
  initialServices: any[];
}

export function ServicesCatalogClient({ initialServices }: ServicesCatalogClientProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounceValue(searchQuery, 200);
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
        !debouncedQuery ||
        service.title?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        service.category?.toLowerCase().includes(debouncedQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialServices, debouncedQuery, selectedCategory]);

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
          1. SEARCH & CATEGORY FILTER BAR (Ultra-Compact Single-Row Strip)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-2 sm:space-y-3">
        {/* Search Input */}
        <div className="relative w-full max-w-xl mx-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none sm:w-[17px] sm:h-[17px]" />
          <input
            type="text"
            placeholder={t('Search services (e.g. PAN, GST, Aadhaar)...', 'Search services (e.g. PAN, GST, Aadhaar)...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/15 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-[#7C3AED] rounded-full w-4.5 h-4.5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pill Tabs (Single-Row Horizontal Scroll — No Multi-Row Wrapping) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar flex-nowrap sm:justify-center">
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
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs ${
                  isSelected
                    ? 'bg-[#7C3AED] text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] border border-slate-200/70'
                }`}
              >
                <span>{cat === 'ALL' ? t('All Services', 'All Services') : cat}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-600'
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
        <EmptyState
          type="search"
          title="No Services Found"
          description={`We couldn't find any services matching "${debouncedQuery}". Try searching with a different keyword or reset your filters.`}
          actionText="Reset Filters"
          onActionClick={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
          }}
        />
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
