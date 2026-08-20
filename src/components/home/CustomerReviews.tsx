"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CustomerReviews() {
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealReviews();
  }, []);

  const fetchRealReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviewsList(data.reviews);
        }
      }
    } catch (error) {
      console.warn("No reviews loaded:", error);
    } finally {
      setLoading(false);
    }
  };

  // If no genuine reviews exist in the database, hide the section as required by rule
  if (!loading && reviewsList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Real Customer <span className="text-[#7C3AED]">Experiences</span>
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Genuine ratings and reviews from clients who used our digital facilitation services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsList.slice(0, 6).map((review, index) => (
            <motion.div
              key={review._id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs relative flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  &ldquo;{review.comment || review.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-purple-100 text-[#7C3AED] font-black text-xs">
                    {review.userName?.[0]?.toUpperCase() || review.name?.[0]?.toUpperCase() || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    {review.userName || review.name || 'Customer'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {review.serviceName || 'Facilitation Service'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
