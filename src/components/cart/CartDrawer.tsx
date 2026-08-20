'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, X, Plus, Minus, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
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
                  <h3 className="font-bold text-gray-800 text-base mb-1">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 max-w-xs">Add any digital service or tool package to proceed with your request.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.serviceId} className="flex gap-3.5 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm items-center hover:border-purple-200 transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                      <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 font-bold text-sm mb-0.5 truncate">{item.title}</h4>
                      <p className="text-[#7C3AED] font-black text-sm mb-2">₹{item.price}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-900 p-0.5 cursor-pointer font-bold"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-gray-900 font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-900 p-0.5 cursor-pointer font-bold"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.serviceId)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-white shadow-lg space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>GST (18%)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-gray-400 text-xs font-normal">₹{(getSubtotal() * 0.18).toFixed(2)}</span>
                      <span>₹0.00 (Waived)</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-900 font-black text-xl pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-[#7C3AED]">₹{getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.01] active:scale-95"
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
        className="relative p-2 text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer"
      >
        <ShoppingCart size={24} />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 bg-[#7C3AED] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-md">
            {items.length}
          </span>
        )}
      </button>

      {mounted && createPortal(cartContent, document.body)}
    </>
  );
}
