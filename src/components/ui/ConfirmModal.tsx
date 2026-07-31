"use client";

import { X, AlertTriangle, LogOut } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-[#FF4500] rounded-2xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500 font-medium">Confirmation required</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed font-medium">
          {message}
        </p>
        
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-2xl font-extrabold bg-[#FF4500] hover:bg-[#FF4500]/90 text-white transition-all text-sm disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
