"use client";

import { X, AlertTriangle } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#FF4500]/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden shadow-[#FF4500]/10 transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 text-[#FF4500]">
              <div className="p-2 bg-[#FF4500]/10 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-white/80 text-sm leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-medium text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-medium bg-[#FF4500] text-white hover:bg-[#FF4500]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
