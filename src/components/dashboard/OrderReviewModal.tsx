'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { formatOrderId } from '@/lib/utils';

interface OrderReviewModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: any) => void;
}

export function OrderReviewModal({ order, isOpen, onClose, onSuccess }: OrderReviewModalProps) {
  const [rating, setRating] = useState<number>(order?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>(order?.reviewText || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const brandedId = formatOrderId(order._id, order.createdAt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, reviewText }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.order);
        onClose();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl text-white">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <div className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider">Leave a Service Review</div>
            <div className="text-sm font-mono text-white/70 font-semibold">{brandedId}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase mb-2">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    size={28}
                    className={`${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase mb-2">Your Testimonial / Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How was your experience with Sandy Digital Hub? Write your feedback..."
              className="w-full bg-[#0a0a0a] text-white p-3 rounded-xl border border-white/10 focus:border-[#FF7A00] outline-none text-sm min-h-[100px] resize-y"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
