'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-black">Application Error</h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            A critical rendering failure occurred. Please refresh the platform or return home.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => reset()}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reload Application
            </button>
            <a
              href="/"
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors text-center"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
