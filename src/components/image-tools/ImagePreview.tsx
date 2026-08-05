"use client";

import { CheckCircle2, FileImage } from "lucide-react";

interface ImagePreviewProps {
  label: string;
  src: string | null;
  info?: string;
  className?: string;
}

export function ImagePreview({ label, src, info, className = "" }: ImagePreviewProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        {info && (
          <span className="flex items-center gap-1.5 text-xs text-blue-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> {info}
          </span>
        )}
      </div>
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 min-h-[200px] flex items-center justify-center">
        {src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={label}
            className="max-w-full max-h-[400px] object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-300 p-8">
            <FileImage className="w-12 h-12" />
            <span className="text-sm">No image yet</span>
          </div>
        )}
        {/* Checkerboard background to show transparency */}
        {src && (
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)",
              backgroundSize: "20px 20px",
            }}
          />
        )}
      </div>
    </div>
  );
}
