'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateQuantity, removeItem, getTotal, getSubtotal } = useCartStore();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-[#FF7A00] hover:text-[#FF7A00]/80 transition-colors"
      >
        <ShoppingCart size={24} />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 bg-[#FF7A00] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#111111] z-50 border-l border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="text-[#FF7A00]" /> Your Cart
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/50">
                    <ShoppingCart size={48} className="mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.serviceId} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 items-center">
                      <div className="w-16 h-16 bg-black/20 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm mb-1 truncate">{item.title}</h4>
                        <p className="text-[#FF7A00] font-bold text-sm mb-2">₹{item.price}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1">
                            <button 
                              onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                              className="text-white/70 hover:text-white p-1"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                              className="text-white/70 hover:text-white p-1"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.serviceId)}
                            className="text-red-400 hover:text-red-300 p-2"
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
                <div className="p-6 border-t border-white/10 bg-black/20">
                  <div className="flex justify-between text-white/70 mb-2">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xl mb-6">
                    <span>Total (inc. GST)</span>
                    <span className="text-[#FF7A00]">₹{getTotal().toFixed(2)}</span>
                  </div>
                  <Link 
                    href="/checkout" 
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-[#FF7A00] text-white py-3 rounded-xl font-bold flex justify-center hover:bg-[#FF7A00]/90 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
