'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, Search, MapPin, Phone, Clock, ArrowRight,
  ShieldCheck, CheckCircle2, Globe, ExternalLink, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounceValue } from '@/hooks/useDebounce';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeletons';

interface CenterItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  logoUrl?: string;
  tagline: string;
  businessHours: string;
  assignedServicesCount: number;
}

export default function PartnerCentersDirectoryPage() {
  const [centers, setCenters] = useState<CenterItem[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounceValue(search, 250);
  const [cityFilter, setCityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/partner-centers');
        if (res.ok) {
          const data = await res.json();
          setCenters(data.centers || []);
        }
      } catch (err) {
        console.error('Failed to load partner directory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const cities = ['ALL', ...Array.from(new Set(centers.map(c => c.city).filter(Boolean)))];

  const filtered = centers.filter(c => {
    const matchCity = cityFilter === 'ALL' || c.city === cityFilter;
    const matchSearch =
      !debouncedSearch ||
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Building2 size={13} /> SARA Partner Network Directory
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Find an Authorized <span className="text-purple-400">Digital Service Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Locate verified physical partner centers near you for in-person document scanning, online form assistance, and physical deliveries.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by center name, street, or city..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
              />
            </div>
            {cities.length > 1 && (
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-slate-800 text-white text-xs font-bold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'ALL' ? 'All Districts / Cities' : city}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <CardSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            type="partners"
            title="No Centers Match Search"
            description={debouncedSearch ? `No partner centers found matching "${debouncedSearch}".` : 'Be the first authorized partner center in your district!'}
            actionText="Apply to Open a Center →"
            actionHref="/partners/apply"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map(center => (
              <div
                key={center.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all space-y-3.5 sm:space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200 inline-block mb-1.5">
                        Verified Center
                      </span>
                      <h3 className="text-base font-black text-gray-900">{center.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{center.tagline}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 font-medium pt-2 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-purple-600 shrink-0 mt-0.5" />
                      <span>{center.address || `${center.city}, ${center.state}`}</span>
                    </div>
                    {center.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-purple-600 shrink-0" />
                        <span>{center.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-purple-600 shrink-0" />
                      <span>{center.businessHours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-semibold">
                    {center.assignedServicesCount > 0 ? `${center.assignedServicesCount} Services Available` : 'Full Service Catalog'}
                  </span>
                  <Link href={`/center/${center.slug}`}>
                    <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-9 px-3.5 flex items-center gap-1 cursor-pointer">
                      Visit Center Portal <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
