'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { formatOrderId } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

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
        toast.success("Thank you for your valuable feedback!", "Review Submitted");
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting your review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl text-gray-800">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <div>
            <div className="text-xs text-[#FF4500] font-bold uppercase tracking-wider">Leave a Service Review</div>
            <div className="text-sm font-mono text-gray-600 font-semibold">{brandedId}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Rating</label>
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
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Your Testimonial / Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How was your experience with Sandy Digital Hub? Write your feedback..."
              className="w-full bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 focus:border-[#FF4500] outline-none text-sm min-h-[100px] resize-y"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-gray-800 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
