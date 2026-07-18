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
    <div className="bg-gradient-to-r from-[#111111] via-[#1a1614] to-[#111111] p-4 sm:p-5 rounded-2xl border border-[#FF7A00]/30 shadow-lg mb-6 sm:mb-8 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-[#FF7A00] uppercase tracking-wider">
        <Search size={14} />
        <span>Instant Order Tracking & WhatsApp Request Lookup</span>
      </div>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Paste WhatsApp Order ID (e.g. SDH-20260711-E9AB1A or E9AB1A)..."
          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-[#FF7A00] transition-colors font-mono"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <span>Track Order</span>
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
}
