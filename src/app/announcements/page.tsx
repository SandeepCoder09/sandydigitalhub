'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Megaphone, Zap, Wrench, ShieldAlert, Package, Sparkles,
  Calendar, Pin, ArrowRight, CheckCircle2, Search
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: string;
  pinned: boolean;
  createdAt: string;
}

export default function PublicAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/notifications?limit=40');
        if (res.ok) {
          const data = await res.json();
          const publicOnly = (data.notifications || []).filter(
            (n: any) => n.isAnnouncement
          );
          setAnnouncements(publicOnly);
        }
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((a) => {
    const matchType = typeFilter === 'ALL' || a.type === typeFilter;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1"><Wrench size={11} /> Maintenance</span>;
      case 'SECURITY_NOTICE':
        return <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-bold flex items-center gap-1"><ShieldAlert size={11} /> Security</span>;
      case 'NEW_FEATURE':
        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold flex items-center gap-1"><Sparkles size={11} /> New Feature</span>;
      case 'NEW_SERVICE':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1"><Package size={11} /> New Service</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center gap-1"><Megaphone size={11} /> Platform Notice</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Megaphone size={13} /> Platform Updates & Notices
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Official <span className="text-purple-400">Announcements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Stay informed on new digital services, software releases, maintenance windows, and ecosystem updates.
          </p>

          {/* Search */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'NEW_SERVICE', 'NEW_FEATURE', 'MAINTENANCE', 'SECURITY_NOTICE'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                typeFilter === type
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                  : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {type === 'ALL'
                ? 'All Updates'
                : type === 'NEW_SERVICE'
                ? 'New Services'
                : type === 'NEW_FEATURE'
                ? 'Features'
                : type === 'MAINTENANCE'
                ? 'Maintenance'
                : 'Security'}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 text-xs text-gray-400 font-semibold animate-pulse">
              Loading platform announcements...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Megaphone size={28} className="text-gray-300 mx-auto" />
              <h3 className="text-base font-black text-gray-900">No Announcements Found</h3>
              <p className="text-xs text-gray-500 font-medium">
                {search ? 'Try clearing your search keyword.' : 'All latest updates will appear here.'}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeBadge(item.type)}
                      {item.pinned && (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Pin size={10} className="text-amber-600" /> Pinned
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-black text-gray-900">{item.title}</h2>
                  </div>

                  <span className="text-[11px] text-gray-400 font-medium shrink-0 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-gray-100 whitespace-pre-wrap">
                  {item.body}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
