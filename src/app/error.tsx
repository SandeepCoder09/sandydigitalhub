'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Root Error Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5 shadow-lg">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
            Something Went Wrong
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            We couldn’t load this section
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while rendering the page. Your account and data remain safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl h-11 px-6 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw size={14} /> Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs rounded-xl h-11 px-6 flex items-center justify-center gap-2"
            >
              <Home size={14} /> Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] text-gray-500 font-medium">
          <LifeBuoy size={13} className="text-purple-600" />
          <span>Need help? Visit our </span>
          <Link href="/support" className="font-bold text-purple-700 hover:underline">
            Support Center
          </Link>
        </div>
      </div>
    </div>
  );
}
