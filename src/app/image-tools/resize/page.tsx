"use client";

import { useState, useCallback, useRef } from "react";
import { Maximize2, Lock, Unlock } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { ImagePreview } from "@/components/image-tools/ImagePreview";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

const PRESETS = [
  { label: "Original", w: 0, h: 0 },
  { label: "HD (1280×720)", w: 1280, h: 720 },
  { label: "Full HD (1920×1080)", w: 1920, h: 1080 },
  { label: "4K (3840×2160)", w: 3840, h: 2160 },
  { label: "Thumbnail (300×300)", w: 300, h: 300 },
  { label: "Profile (512×512)", w: 512, h: 512 },
  { label: "Banner (1200×630)", w: 1200, h: 630 },
  { label: "WhatsApp DP (192×192)", w: 192, h: 192 },
];

export default function ResizePage() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [resizedSrc, setResizedSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [percentage, setPercentage] = useState(100);
  const [mode, setMode] = useState<"pixels" | "percentage">("pixels");
  const nameRef = useRef("resized.jpg");

  const handleFile = useCallback((file: File) => {
    nameRef.current = file.name.replace(/\.[^.]+$/, "") + "_resized.jpg";
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setOrigW(img.width); setOrigH(img.height);
      setWidth(img.width); setHeight(img.height);
      const reader = new FileReader();
      reader.onload = (e) => setOriginalSrc(e.target?.result as string);
      reader.readAsDataURL(file);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setResizedSrc(null);
  }, []);

  const onWidthChange = (v: number) => {
    setWidth(v);
    if (locked && origW > 0) setHeight(Math.round((v / origW) * origH));
  };
  const onHeightChange = (v: number) => {
    setHeight(v);
    if (locked && origH > 0) setWidth(Math.round((v / origH) * origW));
  };

  const applyPreset = (w: number, h: number) => {
    if (w === 0) { setWidth(origW); setHeight(origH); return; }
    setWidth(w); setHeight(h);
  };

  const resize = useCallback(() => {
    if (!originalSrc) return;
    setProcessing(true);
    let targetW = width;
    let targetH = height;
    if (mode === "percentage") {
      targetW = Math.round(origW * percentage / 100);
      targetH = Math.round(origH * percentage / 100);
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob((blob) => {
        if (!blob) { setProcessing(false); return; }
        setResizedSrc(URL.createObjectURL(blob));
        setProcessing(false);
      }, "image/jpeg", 0.92);
    };
    img.src = originalSrc;
  }, [originalSrc, width, height, mode, percentage, origW, origH]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<Maximize2 className="w-9 h-9" />}
        title="Image Resizer"
        description="Resize images to exact pixel dimensions or by percentage. Includes social media presets."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          {/* Mode tabs */}
          <div className="flex gap-2 mb-5">
            {(["pixels", "percentage"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${mode === m ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {mode === "pixels" ? (
            <>
              {/* Presets */}
              <div className="flex flex-wrap gap-2 mb-5">
                {PRESETS.map((p) => (
                  <button key={p.label} onClick={() => applyPreset(p.w, p.h)}
                    className="px-3 py-1.5 rounded-lg bg-white text-gray-500 text-xs hover:bg-blue-100 hover:text-blue-400 border border-gray-200 hover:border-blue-500/30 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>
              {/* WxH inputs */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Width (px)</label>
                  <input type="number" value={width} onChange={(e) => onWidthChange(Number(e.target.value))}
                    className="w-32 bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <button onClick={() => setLocked(!locked)} className="mt-5 p-2 rounded-lg bg-white hover:bg-blue-100 text-gray-400 hover:text-blue-400 transition-all border border-gray-200">
                  {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Height (px)</label>
                  <input type="number" value={height} onChange={(e) => onHeightChange(Number(e.target.value))}
                    className="w-32 bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              {origW > 0 && <p className="text-gray-400 text-xs mt-2">Original: {origW}×{origH}px</p>}
            </>
          ) : (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-gray-600 text-sm">Scale</label>
                <span className="text-blue-500 font-bold">{percentage}%</span>
              </div>
              <input type="range" min={5} max={400} step={5} value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full accent-blue-500" />
              {origW > 0 && (
                <p className="text-gray-400 text-xs mt-1">
                  Output: {Math.round(origW * percentage / 100)}×{Math.round(origH * percentage / 100)}px
                </p>
              )}
            </div>
          )}
        </div>

        {!originalSrc && <DropZone onFileSelect={handleFile} />}

        {originalSrc && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePreview label="Original" src={originalSrc} info={`${origW}×${origH}px`} />
              <ImagePreview label="Resized" src={resizedSrc}
                info={resizedSrc ? (mode === "pixels" ? `${width}×${height}px` : `${Math.round(origW * percentage / 100)}×${Math.round(origH * percentage / 100)}px`) : undefined}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={resize} disabled={processing}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95">
                {processing ? "Resizing…" : "Resize Image"}
              </button>
              <DownloadButton dataUrl={resizedSrc} filename={nameRef.current} label="Download" />
              <button onClick={() => { setOriginalSrc(null); setResizedSrc(null); }}
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
