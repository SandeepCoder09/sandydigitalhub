'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { IService } from '@/models/Service';
import { X, CheckCircle2, ShoppingCart, Info } from 'lucide-react';

interface ServiceCardProps {
  service: IService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    addItem({
      serviceId: String(service._id),
      title: service.title,
      price: service.price,
      quantity: 1,
      image: service.image,
    });
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -6 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col h-full hover:border-[#FF4500] transition-all group"
      >
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <Image 
            src={service.image} 
            alt={service.title} 
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase text-[#FF4500] border border-orange-100 shadow-sm">
            {service.category}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-lg font-bold text-gray-900 leading-snug">{service.title}</h3>
            <span className="text-[#FF4500] font-black text-lg shrink-0">₹{service.price}</span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-6 line-clamp-2 flex-grow">{service.description}</p>
          
          <div className="flex gap-2.5 mt-auto pt-3 border-t border-gray-100">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-200 active:scale-95"
            >
              <ShoppingCart size={15} /> Add to Cart
            </button>
            <button 
              onClick={() => setShowDetails(true)}
              className="px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1"
            >
              <Info size={15} /> Details
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="relative h-60 w-full bg-gray-100">
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button 
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4500] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100 inline-block mb-1">
                      {service.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                  </div>
                  <span className="text-2xl font-black text-[#FF4500]">₹{service.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <div className="space-y-2.5 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>Official Verified Digital Service</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>Express Turnaround & Instant Download</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>Dedicated Support on WhatsApp & Call</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    handleAddToCart();
                    setShowDetails(false);
                  }}
                  className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add to Cart - ₹{service.price}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
