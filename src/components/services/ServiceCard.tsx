'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { IService } from '@/models/Service';
import { X, CheckCircle2, ShoppingCart, Info, Check, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  service: IService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showDetails, setShowDetails] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      serviceId: String(service._id),
      title: service.title,
      price: service.price,
      quantity: 1,
      image: service.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 flex flex-col h-full hover:border-purple-300 transition-all group select-none"
      >
        {/* ── Image ── */}
        <div className="relative h-28 sm:h-48 w-full bg-slate-100 overflow-hidden shrink-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        {/* ── Card Content ── */}
        <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
          <div className="space-y-1 sm:space-y-2">
            {/* Title & Price Row */}
            <div className="flex justify-between items-start gap-1.5 sm:gap-2">
              <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug line-clamp-1 sm:line-clamp-2 sm:min-h-[2.5rem] group-hover:text-[#7C3AED] transition-colors">
                {service.title}
              </h3>
              <span className="text-[#7C3AED] font-black text-xs sm:text-lg shrink-0 bg-purple-50 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-xl border border-purple-200/80">
                ₹{service.price}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-500 text-[10px] sm:text-xs leading-snug sm:leading-relaxed line-clamp-1 sm:line-clamp-2 sm:min-h-[2.2rem]">
              {service.description}
            </p>
          </div>

          {/* ── Action Buttons ── */}
          <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-purple-200 hover:shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={13} className="stroke-[3]" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart size={13} /> Add
                </>
              )}
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="px-2 py-1.5 sm:px-3 sm:py-2.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] border border-slate-200 hover:border-purple-200 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
              title="View Service Details"
            >
              <Info size={13} />
              <span className="hidden sm:inline">Details</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Service Detail Modal ── */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto"
            >
              <div className="relative h-56 sm:h-64 w-full bg-slate-100 shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-md backdrop-blur transition-all hover:scale-105 cursor-pointer"
                  aria-label="Close details modal"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black uppercase text-[#7C3AED] border border-purple-100 shadow-sm">
                  {service.category}
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {service.title}
                    </h2>
                  </div>
                  <span className="text-2xl font-black text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-2xl border border-purple-200 shrink-0">
                    ₹{service.price}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Official Verified Digital Service</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Fast Processing & Instant Delivery</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Doorstep Support / Jan Seva Assistance</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleAddToCart();
                      setShowDetails(false);
                    }}
                    className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-2xl font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-purple-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={18} /> Add to Cart - ₹{service.price}
                  </button>
                  <Link href={`/checkout?service=${service._id}`} className="shrink-0">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-4 py-3.5 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Instant Apply <ArrowRight size={15} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
