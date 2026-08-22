import Link from 'next/link';
import { FileQuestion, Home, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-14 text-center max-w-lg mx-auto space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
          <FileQuestion size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-md">
            404 Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Looks like this page doesn’t exist
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            The link you clicked may be broken, or the page may have been moved within our ecosystem.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl h-11 px-6 flex items-center justify-center gap-2 shadow-md cursor-pointer">
              <Home size={14} /> Back to Ecosystem Home
            </Button>
          </Link>

          <Link href="/services" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs rounded-xl h-11 px-6 flex items-center justify-center gap-2 cursor-pointer"
            >
              Browse Services <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
