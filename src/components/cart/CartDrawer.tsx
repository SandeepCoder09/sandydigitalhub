'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, X, Plus, Minus, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartDrawerProps {
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

export function CartDrawer({ theme = 'auto', className }: CartDrawerProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotal, getSubtotal } = useCartStore();

  // Wait for client-side mount so createPortal has access to document.body
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const cartContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white border-l border-gray-200 flex flex-col shadow-2xl z-[9999]"
          >
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 text-[#7C3AED]">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">Your Cart</h2>
                  <p className="text-xs text-gray-500 font-medium">{items.length} {items.length === 1 ? 'service' : 'services'} selected</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-gray-50/30">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="font-bold text-gray-700 text-sm">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Browse our digital catalog to add fast and secure services.</p>
                  <Link 
                    href="/services" 
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-500/20"
                  >
                    Explore Services
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.serviceId} className="flex gap-3.5 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm items-center hover:border-purple-200 transition-colors">
                    <div className="w-14 h-14 bg-purple-50 rounded-xl overflow-hidden shrink-0 relative border border-purple-100 flex items-center justify-center">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                      ) : (
                        <span className="text-base font-black text-[#7C3AED]">{item.title.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                      <p className="text-[11px] font-black text-[#7C3AED] mt-0.5">₹{item.price * item.quantity}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button 
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-black cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold px-2 text-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-black cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.serviceId)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-white space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Government/Gateway Processing</span>
                    <span className="text-emerald-600 font-bold">Standard</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-[#7C3AED] text-base">₹{getTotal()}</span>
                  </div>
                </div>

                <Link
                  href="/services"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all text-sm cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-500 pt-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Instant Support</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={className || `relative p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer group ${
          theme === 'dark'
            ? 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white shadow-inner'
            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
        }`}
        aria-label="Shopping Cart"
        title="Shopping Cart"
      >
        <ShoppingCart size={16} className={theme === 'dark' ? 'text-slate-300 group-hover:text-white transition-colors' : 'text-slate-600 group-hover:text-slate-900 transition-colors'} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#7C3AED] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-sm">
            {items.length > 9 ? '9+' : items.length}
          </span>
        )}
      </button>

      {mounted && createPortal(cartContent, document.body)}
    </>
  );
}
