'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { generateInvoice } from '@/lib/invoice';

export function DownloadInvoiceButton({ order, user }: { order: any; user: any }) {
  return (
    <button 
      onClick={() => generateInvoice(order, user)}
      className="text-[#7C3AED] hover:underline cursor-pointer"
    >
      Download Invoice
    </button>
  );
}
