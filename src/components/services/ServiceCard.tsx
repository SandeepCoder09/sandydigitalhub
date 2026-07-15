'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { IService } from '@/models/Service';
import { X, CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  service: IService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    addItem({
      serviceId: service._id as string,
      title: service.title,
      price: service.price,
      quantity: 1,
      image: service.image,
    });
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-[#111111] rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full hover:border-[#FF7A00] transition-colors"
      >
        <div className="relative h-48 w-full bg-white/5">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white">{service.title}</h3>
            <span className="text-[#FF7A00] font-bold">₹{service.price}</span>
          </div>
          <p className="text-[#F5F5F5]/60 text-sm mb-6 flex-grow">{service.description}</p>
          
          <div className="flex gap-3 mt-auto">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => setShowDetails(true)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-full"
            >
              <div className="relative h-64 w-full">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1 block">{service.category}</span>
                    <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                  </div>
                  <span className="text-2xl font-bold text-[#FF7A00]">₹{service.price}</span>
                </div>
                
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={18} className="text-[#FF7A00]" />
                    <span>Premium quality guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={18} className="text-[#FF7A00]" />
                    <span>Fast turnaround time</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={18} className="text-[#FF7A00]" />
                    <span>Dedicated customer support</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    handleAddToCart();
                    setShowDetails(false);
                  }}
                  className="w-full bg-[#FF7A00] text-white py-4 rounded-xl font-bold hover:bg-[#FF7A00]/90 transition-colors"
                >
                  Add to Cart - ₹{service.price}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
