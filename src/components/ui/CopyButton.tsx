'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title="Copy Order ID"
      className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md transition-all border cursor-pointer shadow-2xs ${
        copied
          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
          : 'bg-gray-100 hover:bg-orange-100 text-gray-800 hover:text-[#FF4500] border-gray-300 hover:border-orange-300'
      } ${className}`}
    >
      {copied ? (
        <Check size={12} className="text-emerald-700 shrink-0" />
      ) : (
        <Copy size={12} className="text-[#FF4500] shrink-0" />
      )}
      <span className={copied ? 'text-emerald-900' : 'text-gray-800'}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}
