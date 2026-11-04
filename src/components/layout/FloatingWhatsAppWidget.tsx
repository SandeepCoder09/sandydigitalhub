'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export function FloatingWhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMsg = encodeURIComponent("Hi Sandy Digital Hub! I have an inquiry regarding your digital services.");
  const whatsappUrl = `https://wa.me/+919118269278?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
      {/* Tooltip Chat Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#111111] text-white text-xs font-semibold px-3.5 py-2 rounded-2xl border border-white/10 shadow-2xl animate-bounce">
          <span>Need help? Chat with Sandy Digital Hub!</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="relative group bg-green-500 hover:bg-green-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-green-500 opacity-40 group-hover:opacity-70 animate-ping"></span>
        <MessageSquare size={24} className="relative z-10 fill-current" />
      </a>
    </div>
  );
}
