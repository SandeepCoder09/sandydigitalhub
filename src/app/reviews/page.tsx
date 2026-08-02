'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star, MessageSquarePlus, CheckCircle2, ShieldCheck, Sparkles,
  User, Send, Loader2, ThumbsUp, Quote, ExternalLink, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewItem {
  _id: string;
  name: string;
  serviceCategory: string;
  rating: number;
  comment: string;
  verifiedOrder?: boolean;
  createdAt: string;
}

const INITIAL_TESTIMONIALS: ReviewItem[] = [
  {
    _id: 't1',
    name: 'Rajesh Kumar Verma',
    serviceCategory: 'Income Certificate (आय प्रमाण पत्र)',
    rating: 5,
    comment: 'Sandy Digital Hub saved me so much time! Applied for my Income Certificate online and got it verified in 4 days. Very smooth service in Fatehpur.',
    verifiedOrder: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 't2',
    name: 'Amit Singh',
    serviceCategory: 'Website Development',
    rating: 5,
    comment: 'Sandeep built a stunning e-commerce website for my retail shop. Payment gateway and mobile layout are top notch. Highly recommended developer!',
    verifiedOrder: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 't3',
    name: 'Priya Mishra',
    serviceCategory: 'PAN Card Service',
    rating: 5,
    comment: 'Got my PAN card corrected and received e-PAN within 3 days. Staff was very helpful with document verification.',
    verifiedOrder: true,
    createdAt: new Date().toISOString(),
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_TESTIMONIALS);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Jan Seva Certificates');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, serviceCategory, rating, comment }),
      });

      if (res.ok) {
        setSubmittedSuccess(true);
        fetchReviews();
        setTimeout(() => {
          setShowModal(false);
          setSubmittedSuccess(false);
          setName(''); setPhone(''); setComment('');
        }, 1800);
      }
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Star size={14} fill="currentColor" /> Verified Customer Feedback
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Customer Reviews & <span className="text-[#FF4500]">Testimonials</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium">
            See real reviews from clients who used our Jan Seva government services and custom website development.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <div className="bg-gray-800/90 border border-gray-700 px-5 py-2.5 rounded-2xl flex items-center gap-3">
              <span className="text-2xl font-black text-amber-400">{avgRating}</span>
              <div className="text-left">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">{reviews.length} Verified Reviews</span>
              </div>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-2xl text-xs py-3 px-6 shadow-lg shadow-orange-950 flex items-center gap-2"
            >
              <MessageSquarePlus size={16} /> Leave Your Feedback
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  {r.verifiedOrder && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Verified Service
                    </span>
                  )}
                </div>

                <Quote size={24} className="text-orange-200" />
                <p className="text-xs text-gray-700 font-medium leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">{r.name}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{r.serviceCategory}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF4500] font-black text-xs flex items-center justify-center">
                  {r.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <MessageSquarePlus size={18} className="text-[#FF4500]" /> Leave Customer Review
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-sm font-extrabold text-gray-900">Thank You!</h4>
                <p className="text-xs text-gray-500">Your review has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF4500]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Service Used</label>
                    <select
                      value={serviceCategory} onChange={e => setServiceCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF4500]"
                    >
                      <option value="Jan Seva Certificates">Jan Seva Certificates</option>
                      <option value="PAN / Passport Service">PAN / Passport Service</option>
                      <option value="Website Development">Website Development</option>
                      <option value="Mobile App">Mobile App</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Star Rating</label>
                    <select
                      value={rating} onChange={e => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF4500]"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3">⭐⭐⭐ (3/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Review Comment *</label>
                  <textarea
                    required rows={3} value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Write a few lines about your experience with Sandy Digital Hub..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF4500]"
                  />
                </div>

                <Button
                  type="submit" disabled={submitting}
                  className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl text-xs py-3 shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Submit Review</>}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
