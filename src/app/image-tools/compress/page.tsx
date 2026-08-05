"use client";

import { useState, useCallback, useRef } from "react";
import { Minimize2, Info } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { ImagePreview } from "@/components/image-tools/ImagePreview";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function CompressPage() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [maxDimension, setMaxDimension] = useState(2048);
  const [processing, setProcessing] = useState(false);
  const fileNameRef = useRef("compressed.jpg");

  const handleFile = useCallback((file: File) => {
    fileNameRef.current = file.name.replace(/\.[^.]+$/, "") + "_compressed.jpg";
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalSrc(e.target?.result as string);
      setCompressedSrc(null);
      setCompressedSize(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const compress = useCallback(() => {
    if (!originalSrc) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { setProcessing(false); return; }
          setCompressedSize(blob.size);
          const url = URL.createObjectURL(blob);
          setCompressedSrc(url);
          setProcessing(false);
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = originalSrc;
  }, [originalSrc, quality, maxDimension]);

  const reduction = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<Minimize2 className="w-9 h-9" />}
        title="Image Compressor"
        description="Reduce image file size from MB to KB — adjustable quality with live preview."
        badge="Most Popular"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 mb-8">
          <h2 className="text-gray-900 font-bold mb-5">Compression Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quality */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-600 text-sm font-medium">Quality</label>
                <span className="text-blue-500 font-bold">{quality}%</span>
              </div>
              <input
                type="range" min={10} max={100} step={5} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smaller file</span><span>Better quality</span>
              </div>
            </div>
            {/* Max Dimension */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-600 text-sm font-medium">Max Dimension</label>
                <span className="text-blue-500 font-bold">{maxDimension}px</span>
              </div>
              <input
                type="range" min={320} max={4096} step={128} value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smaller</span><span>Full resolution</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5" />
            Recommended: 75–85% quality for best size/quality ratio. Output is always JPEG.
          </div>
        </div>

        {/* Upload */}
        {!originalSrc && (
          <DropZone onFileSelect={handleFile} />
        )}

        {/* Previews */}
        {originalSrc && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePreview
                label="Original"
                src={originalSrc}
                info={formatBytes(originalSize)}
              />
              <ImagePreview
                label="Compressed"
                src={compressedSrc}
                info={compressedSrc
                  ? `${formatBytes(compressedSize)} (${reduction}% smaller)`
                  : undefined}
              />
            </div>

            {/* Reduction badge */}
            {reduction !== null && (
              <div className={`text-center py-3 rounded-xl font-bold text-lg
                ${reduction > 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400"}`}>
                {reduction > 0 ? `🎉 File size reduced by ${reduction}%!` : "⚠️ Compressed file is larger — try a lower quality setting."}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={compress}
                disabled={processing}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95"
              >
                {processing ? "Compressing…" : "Compress Image"}
              </button>
              <DownloadButton
                dataUrl={compressedSrc}
                filename={fileNameRef.current}
                label="Download Compressed"
              />
              <button
                onClick={() => { setOriginalSrc(null); setCompressedSrc(null); }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 text-sm transition-all"
              >
                Change Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
