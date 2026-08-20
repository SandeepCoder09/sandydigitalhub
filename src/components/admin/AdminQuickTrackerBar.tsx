'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export function AdminQuickTrackerBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/admin/orders?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 p-4 sm:p-5 rounded-3xl border border-purple-200 shadow-2xs space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-black text-[#7C3AED] uppercase tracking-wider">
        <Search size={15} />
        <span>Instant Order Tracking & WhatsApp Request Lookup</span>
      </div>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste WhatsApp Order ID (e.g. SDH-20260711-E9AB1A or E9AB1A)..."
          className="flex-1 bg-white border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-mono shadow-2xs"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-500/20 hover:scale-105 shrink-0 cursor-pointer"
        >
          <span>Track Order</span>
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
