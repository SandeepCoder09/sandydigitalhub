'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

type ToastFunctions = {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  showToast: (message: string, type?: ToastType, title?: string) => void;
  toast: ToastFunctions;
};

interface ToastContextType {
  toast: ToastFunctions;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let globalToastHandler: ToastFunctions | null = null;

const toastBase = {
  success: (message: string, title?: string) => {
    if (globalToastHandler) globalToastHandler.success(message, title);
    else console.log('[Success Toast]', message);
  },
  error: (message: string, title?: string) => {
    if (globalToastHandler) globalToastHandler.error(message, title);
    else console.error('[Error Toast]', message);
  },
  info: (message: string, title?: string) => {
    if (globalToastHandler) globalToastHandler.info(message, title);
    else console.log('[Info Toast]', message);
  },
  showToast: (message: string, type: ToastType = 'info', title?: string) => {
    if (globalToastHandler) globalToastHandler.showToast(message, type, title);
    else if (type === 'error') console.error('[Error Toast]', message);
    else console.log(`[${type} Toast]`, message);
  },
};

export const toast: ToastFunctions = {
  ...toastBase,
  toast: null as any,
};
toast.toast = toast;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: ToastType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-4), { id, type, message, title }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toastMethods: ToastFunctions = {
    success: (message: string, title?: string) => addToast('success', message, title || 'Success'),
    error: (message: string, title?: string) => addToast('error', message, title || 'Notice'),
    info: (message: string, title?: string) => addToast('info', message, title || 'Information'),
    showToast: (message: string, type: ToastType = 'info', title?: string) => {
      const defaultTitle = type === 'success' ? 'Success' : type === 'error' ? 'Notice' : 'Information';
      addToast(type, message, title || defaultTitle);
    },
    toast: null as any,
  };
  toastMethods.toast = toastMethods;

  useEffect(() => {
    globalToastHandler = toastMethods;
  }, []);

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast: t, onClose }: { toast: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Sparkles className="w-5 h-5 text-[#7C3AED] shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 bg-white text-gray-900',
    error: 'border-red-200 bg-white text-gray-900',
    info: 'border-purple-200 bg-white text-gray-900',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md relative overflow-hidden ${borderStyles[t.type]}`}
    >
      <div className="pt-0.5">{icons[t.type]}</div>
      <div className="flex-1 min-w-0 pr-2">
        {t.title && <h4 className="font-extrabold text-sm text-gray-900 leading-tight mb-0.5">{t.title}</h4>}
        <p className="text-xs font-medium text-gray-600 leading-relaxed break-words">{t.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors shrink-0"
      >
        <X size={16} />
      </button>

      {/* Subtle Auto-dismiss progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4.5, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${
          t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-500' : 'bg-[#7C3AED]'
        }`}
      />
    </motion.div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return toast;
  }
  return context.toast;
}
