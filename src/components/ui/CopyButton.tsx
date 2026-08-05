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
      title={copied ? 'Copied!' : 'Copy Order ID'}
      className={`inline-flex items-center justify-center p-1 rounded-lg transition-all border cursor-pointer shrink-0 ${
        copied
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
          : 'bg-gray-100 hover:bg-violet-100 text-gray-500 hover:text-violet-700 border-gray-200 hover:border-violet-300'
      } ${className}`}
    >
      {copied ? (
        <Check size={13} className="text-emerald-700 shrink-0" />
      ) : (
        <Copy size={13} className="shrink-0" />
      )}
    </button>
  );
}
