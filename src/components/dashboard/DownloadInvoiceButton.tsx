'use client';

import { generateInvoice } from '@/lib/invoice';

export function DownloadInvoiceButton({ order, user }: { order: any; user: any }) {
  return (
    <button 
      onClick={() => generateInvoice(order, user)}
      className="text-[#FF7A00] hover:underline cursor-pointer"
    >
      Download Invoice
    </button>
  );
}
