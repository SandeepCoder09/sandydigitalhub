"use client";

import { useState, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { ImagePreview } from "@/components/image-tools/ImagePreview";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

type Format = "image/jpeg" | "image/png" | "image/webp";

const FORMATS: { label: string; mime: Format; ext: string; desc: string }[] = [
  { label: "JPG / JPEG", mime: "image/jpeg", ext: "jpg", desc: "Best for photos. Smaller files." },
  { label: "PNG",        mime: "image/png",  ext: "png", desc: "Lossless. Supports transparency." },
  { label: "WebP",       mime: "image/webp", ext: "webp",desc: "Modern format. Smaller than JPG & PNG." },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ConvertPage() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("image");
  const [originalType, setOriginalType] = useState("—");
  const [originalSize, setOriginalSize] = useState(0);
  const [targetFormat, setTargetFormat] = useState<typeof FORMATS[number]>(FORMATS[1]);
  const [quality, setQuality] = useState(90);
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    setOriginalName(file.name.replace(/\.[^.]+$/, ""));
    setOriginalType(file.type);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => { setOriginalSrc(e.target?.result as string); setConvertedSrc(null); };
    reader.readAsDataURL(file);
  }, []);

  const convert = useCallback(() => {
    if (!originalSrc) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (targetFormat.mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, img.width, img.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) { setProcessing(false); return; }
          setConvertedSize(blob.size);
          setConvertedSrc(URL.createObjectURL(blob));
          setProcessing(false);
        },
        targetFormat.mime,
        targetFormat.mime === "image/png" ? undefined : quality / 100
      );
    };
    img.src = originalSrc;
  }, [originalSrc, targetFormat, quality]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<RefreshCcw className="w-9 h-9" />}
        title="Format Converter"
        description="Convert between JPG, PNG, and WebP formats instantly in your browser."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

        {/* Format selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-gray-900 font-bold mb-4">Convert to:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {FORMATS.map((f) => (
              <button
                key={f.mime}
                onClick={() => setTargetFormat(f)}
                className={`p-4 rounded-xl border text-left transition-all
                  ${targetFormat.mime === f.mime
                    ? "border-purple-500 bg-purple-100"
                    : "border-gray-200 bg-gray-50 hover:border-purple-300"}`}
              >
                <p className={`font-bold text-sm ${targetFormat.mime === f.mime ? "text-purple-500" : "text-gray-700"}`}>{f.label}</p>
                <p className="text-gray-400 text-xs mt-1">{f.desc}</p>
              </button>
            ))}
          </div>
          {targetFormat.mime !== "image/png" && (
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-gray-600 text-sm">Quality</label>
                <span className="text-purple-500 font-bold">{quality}%</span>
              </div>
              <input type="range" min={10} max={100} step={5} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
          )}
        </div>

        {!originalSrc && <DropZone onFileSelect={handleFile} />}

        {originalSrc && (
          <>
            {/* Meta row */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Original Type", value: originalType },
                { label: "Original Size", value: formatBytes(originalSize) },
                { label: "Converted Size", value: convertedSize ? formatBytes(convertedSize) : "—" },
              ].map((m) => (
                <div key={m.label} className="px-4 py-2 rounded-xl bg-white border border-gray-200">
                  <p className="text-gray-400 text-xs">{m.label}</p>
                  <p className="text-gray-900 font-semibold text-sm">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePreview label="Original" src={originalSrc} />
              <ImagePreview label={`Converted (${targetFormat.label})`} src={convertedSrc} />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={convert} disabled={processing}
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95"
              >
                {processing ? "Converting…" : `Convert to ${targetFormat.label}`}
              </button>
              <DownloadButton dataUrl={convertedSrc} filename={`${originalName}.${targetFormat.ext}`} label="Download" />
              <button onClick={() => { setOriginalSrc(null); setConvertedSrc(null); }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-800 text-sm transition-all">
                Change Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
