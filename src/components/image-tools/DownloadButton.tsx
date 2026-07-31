"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  dataUrl: string | null;
  filename: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DownloadButton({
  dataUrl,
  filename,
  label = "Download",
  disabled = false,
  className = "",
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const isDisabled = disabled || !dataUrl;

  return (
    <button
      onClick={handleDownload}
      disabled={isDisabled}
      className={`group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
        ${isDisabled
          ? "bg-white/10 text-white/30 cursor-not-allowed"
          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-95"
        } ${className}`}
    >
      <Download className={`w-4 h-4 transition-transform ${isDisabled ? "" : "group-hover:-translate-y-0.5"}`} />
      {label}
    </button>
  );
}
