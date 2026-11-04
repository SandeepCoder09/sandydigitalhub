'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Star, MessageSquarePlus, CheckCircle2, ShieldCheck, Sparkles,
  User, Send, Loader2, ThumbsUp, Quote, ExternalLink, ArrowRight, X,
  BadgeCheck, Globe, FileText, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewItem {
  id: string;
  name: string;
  serviceCategory: string;
  division: 'SARA_HUB' | 'SANDY_STUDIO';
  rating: number;
  title?: string;
  comment: string;
  verifiedOrder?: boolean;
  requestNumber?: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState({ totalReviews: 0, verifiedCount: 0, averageRating: 5.0 });
  const [selectedDivision, setSelectedDivision] = useState<'ALL' | 'SARA_HUB' | 'SANDY_STUDIO'>('ALL');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDivision, setFormDivision] = useState<'SARA_HUB' | 'SANDY_STUDIO'>('SARA_HUB');
  const [formService, setFormService] = useState('Jan Seva Digital Assistance');
  const [formRating, setFormRating] = useState(5);
  const [formRequestNumber, setFormRequestNumber] = useState('');
  const [formComment, setFormComment] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedDivision === 'ALL'
        ? '/api/reviews'
        : `/api/reviews?division=${selectedDivision}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDivision]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          division: formDivision,
          serviceCategory: formService,
          rating: Number(formRating),
          requestNumber: formRequestNumber.trim() || undefined,
          comment: formComment.trim(),
        }),
      });

      if (res.ok) {
        setSubmittedSuccess(true);
        fetchReviews();
        setTimeout(() => {
          setShowModal(false);
          setSubmittedSuccess(false);
          setFormName('');
          setFormEmail('');
          setFormRequestNumber('');
          setFormComment('');
        }, 1800);
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-8 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xs">
        <div className="max-w-5xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-[11px] font-bold uppercase tracking-wider">
            <Star size={13} fill="currentColor" /> Verified Ecosystem Feedback
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Client Ratings & <span className="text-[#7C3AED]">Verified Reviews</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-600 font-medium leading-relaxed">
            Real customer experiences across <strong>SANDY DIGITAL HUB</strong> citizen facilitation and <strong>SARA DIGITAL STUDIO</strong> technology projects.
          </p>

          {/* Unified Stats Strip */}
          <div className="pt-3 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <div className="bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xs">
              <span className="text-2xl font-black text-amber-500">{stats.averageRating}</span>
              <div className="text-left">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">
                  {stats.totalReviews} Verified Review{stats.totalReviews !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold rounded-2xl text-xs py-3 px-6 shadow-md shadow-purple-600/30 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer h-11"
            >
              <MessageSquarePlus size={15} /> Leave Verified Review
            </Button>
          </div>

          {/* Division Filter Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-xs">
              <button
                onClick={() => setSelectedDivision('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDivision === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Reviews ({stats.totalReviews})
              </button>
              <button
                onClick={() => setSelectedDivision('SARA_HUB')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedDivision === 'SARA_HUB'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={13} className="text-purple-600" /> Sandy Digital Hub
              </button>
              <button
                onClick={() => setSelectedDivision('SANDY_STUDIO')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedDivision === 'SANDY_STUDIO'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Globe size={13} className="text-indigo-600" /> Sara Digital Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400 font-semibold text-xs animate-pulse">
            Loading verified reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Star size={24} />
            </div>
            <h3 className="text-base font-black text-gray-900">Be the First to Review</h3>
            <p className="text-xs text-gray-500 font-medium">
              Completed a service or project? Share your experience with the community.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#7C3AED] text-white font-bold rounded-xl text-xs mt-2"
            >
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all space-y-3 sm:space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    {r.verifiedOrder ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-emerald-600" /> Verified Customer
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold">
                        Customer Feedback
                      </span>
                    )}
                  </div>

                  <Quote size={20} className="text-purple-200" />
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed italic">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{r.name}</div>
                    <div className="text-[10px] text-gray-500 font-semibold">{r.serviceCategory}</div>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                    r.division === 'SANDY_STUDIO' ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {r.division === 'SANDY_STUDIO' ? 'Studio' : 'Sandy Hub'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MessageSquarePlus size={18} className="text-[#7C3AED]" /> Submit Verified Review
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCheck size={24} />
                </div>
                <h4 className="text-sm font-black text-gray-900">Review Submitted!</h4>
                <p className="text-xs text-gray-500 font-medium">
                  Thank you for helping us maintain an authentic, transparent service standard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text" required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Ramesh Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ecosystem Platform</label>
                    <select
                      value={formDivision}
                      onChange={e => setFormDivision(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="SARA_HUB">Sandy Digital Hub</option>
                      <option value="SANDY_STUDIO">Sara Digital Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Star Rating</label>
                    <select
                      value={formRating}
                      onChange={e => setFormRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Request / Order ID (Optional for Verified Badge)
                  </label>
                  <input
                    type="text"
                    value={formRequestNumber}
                    onChange={e => setFormRequestNumber(e.target.value)}
                    placeholder="e.g. SDH-20260821-F4A8"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Linking an actual order displays the &ldquo;Verified Service Customer&rdquo; badge.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Review *</label>
                  <textarea
                    required rows={3}
                    value={formComment}
                    onChange={e => setFormComment(e.target.value)}
                    placeholder="Describe your experience with the service, support, or delivery..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs py-3 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <><Send size={14} /> Submit Feedback</>}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
