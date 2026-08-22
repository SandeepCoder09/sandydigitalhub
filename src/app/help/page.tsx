'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HelpCircle, Search, BookOpen, ChevronDown, ArrowRight,
  LifeBuoy, Sparkles, FileText, CheckCircle2, Globe, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounceValue } from '@/hooks/useDebounce';
import { EmptyState } from '@/components/ui/EmptyState';

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  division: string;
  summary: string;
  content: string;
  featured: boolean;
}

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['ALL']);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounceValue(search, 250);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/help');
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
          if (data.categories) setCategories(data.categories);
          if (data.articles?.length > 0) setOpenSlug(data.articles[0].slug);
        }
      } catch (err) {
        console.error('Failed to load help articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'ALL' || a.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      !debouncedSearch ||
      a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.summary.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.content.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={13} /> Help Center & Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            How can we <span className="text-purple-400">help you today?</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Find answers to common questions about SARA DIGITAL HUB services, tracking, project quotes, and partner onboarding.
          </p>

          {/* Instant Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles, guides, or document requirements..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                  : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat === 'ALL' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Articles Accordion List */}
        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-16 text-xs text-gray-400 font-semibold animate-pulse">
              Loading knowledge base...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-3">
              <HelpCircle size={28} className="text-gray-300 mx-auto" />
              <h3 className="text-base font-black text-gray-900">No articles matched</h3>
              <p className="text-xs text-gray-500 font-medium">
                Try searching for a different keyword or open a support ticket.
              </p>
              <Link href="/support">
                <Button className="bg-[#7C3AED] text-white text-xs font-bold rounded-xl h-10 mt-2">
                  Open Support Ticket →
                </Button>
              </Link>
            </div>
          ) : (
            filtered.map((art) => {
              const isOpen = openSlug === art.slug;
              return (
                <div
                  key={art.slug}
                  className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenSlug(isOpen ? null : art.slug)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-md">
                          {art.category}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-gray-900">{art.title}</h3>
                      <p className="text-xs text-gray-500 font-medium">{art.summary}</p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-purple-600' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-2 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium border-t border-gray-100 bg-slate-50/30 whitespace-pre-wrap">
                      {art.content}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Callout Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base font-black text-purple-950">Still need help with your request?</h3>
            <p className="text-xs text-purple-800 font-medium">
              Our dedicated support team is available to assist you with any specific questions.
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <Link href="/support">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl h-10 px-5">
                Support Center →
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-purple-300 text-purple-900 font-bold text-xs rounded-xl h-10 px-5">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
