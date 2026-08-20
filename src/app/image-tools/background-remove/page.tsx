"use client";

import { useState, useCallback, useRef } from "react";
import { Eraser } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { ImagePreview } from "@/components/image-tools/ImagePreview";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

const OUTPUT_MODES = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "white" },
  { label: "Black", value: "black" },
  { label: "Custom", value: "custom" },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

export default function BgRemovePage() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(40);
  const [outputMode, setOutputMode] = useState("transparent");
  const [customColor, setCustomColor] = useState("#ff4500");
  const [sampleColor, setSampleColor] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef("bg-removed.png");

  const handleFile = useCallback((file: File) => {
    nameRef.current = file.name.replace(/\.[^.]+$/, "") + "_nobg.png";
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalSrc(e.target?.result as string);
      setResultSrc(null);
      setSampleColor(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // Click/touch on the canvas preview to pick background colour
  const pickColor = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = Math.round((clientX - bounds.left) * scaleX);
    const y = Math.round((clientY - bounds.top) * scaleY);
    const ctx = canvas.getContext("2d")!;
    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${p[0].toString(16).padStart(2, "0")}${p[1].toString(16).padStart(2, "0")}${p[2].toString(16).padStart(2, "0")}`;
    setSampleColor(hex);
  }, []);

  // Draw original to sample canvas
  const onImageLoad = useCallback((src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
    };
    img.src = src;
  }, []);

  const removeBackground = useCallback(() => {
    if (!originalSrc || !sampleColor) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const { r: sr, g: sg, b: sb } = hexToRgb(sampleColor);

      // Determine replacement color
      let repR = 0, repG = 0, repB = 0, repA = 0;
      if (outputMode === "white")  { repR = 255; repG = 255; repB = 255; repA = 255; }
      else if (outputMode === "black") { repA = 255; }
      else if (outputMode === "custom") {
        const { r, g, b } = hexToRgb(customColor);
        repR = r; repG = g; repB = b; repA = 255;
      }
      // transparent: repA stays 0

      for (let i = 0; i < data.length; i += 4) {
        const dist = colorDistance(data[i], data[i + 1], data[i + 2], sr, sg, sb);
        if (dist < threshold) {
          data[i] = repR; data[i + 1] = repG; data[i + 2] = repB; data[i + 3] = repA;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) { setProcessing(false); return; }
        setResultSrc(URL.createObjectURL(blob));
        setProcessing(false);
      }, "image/png");
    };
    img.src = originalSrc;
  }, [originalSrc, sampleColor, threshold, outputMode, customColor]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<Eraser className="w-9 h-9" />}
        title="Background Remover"
        description="Click a background colour on your image to remove it. Great for logos and product photos."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-600 text-sm font-medium">Tolerance / Threshold</label>
              <span className="text-purple-500 font-bold">{threshold}</span>
            </div>
            <input type="range" min={5} max={120} step={1} value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-blue-500" />
            <p className="text-gray-400 text-xs mt-1">Higher = removes more colours</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Replace Background With</label>
            <div className="flex flex-wrap gap-2">
              {OUTPUT_MODES.map((m) => (
                <button key={m.value} onClick={() => setOutputMode(m.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${outputMode === m.value ? "border-purple-500 bg-purple-100 text-blue-400" : "border-gray-200 text-gray-400 hover:border-white/30"}`}>
                  {m.label}
                </button>
              ))}
            </div>
            {outputMode === "custom" && (
              <div className="flex items-center gap-2 mt-3">
                <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-gray-400 text-sm">{customColor}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Sampled Background Colour</label>
            {sampleColor ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-gray-300 shrink-0" style={{ backgroundColor: sampleColor }} />
                <span className="text-gray-500 text-sm font-mono">{sampleColor}</span>
                <button onClick={() => setSampleColor(null)} className="text-gray-400 hover:text-red-400 text-xs">✕ Reset</button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Click on the background colour in the image below to sample it.</p>
            )}
          </div>
        </div>

        {!originalSrc && <DropZone onFileSelect={handleFile} />}

        {originalSrc && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wider">
                  Original — {sampleColor ? "✅ Colour sampled" : "👆 Click background to sample colour"}
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <canvas
                    ref={canvasRef}
                    className="w-full cursor-crosshair"
                    onClick={pickColor}
                    onTouchStart={pickColor}
                    onLoad={() => onImageLoad(originalSrc)}
                  />
                </div>
                {/* draw image to canvas when src changes */}
                {originalSrc && (() => { onImageLoad(originalSrc); return null; })()}
              </div>
              <ImagePreview label="Result" src={resultSrc} />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={removeBackground}
                disabled={processing || !sampleColor}
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95"
              >
                {processing ? "Processing…" : !sampleColor ? "Sample a colour first" : "Remove Background"}
              </button>
              <DownloadButton dataUrl={resultSrc} filename={nameRef.current} label="Download PNG" />
              <button onClick={() => { setOriginalSrc(null); setResultSrc(null); setSampleColor(null); }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-800 text-sm transition-all">
                Change Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
