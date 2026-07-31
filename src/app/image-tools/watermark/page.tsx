"use client";

import { useState, useCallback, useRef } from "react";
import { Layers } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { ImagePreview } from "@/components/image-tools/ImagePreview";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

const POSITIONS = [
  { label: "Top-Left",     value: "tl" },
  { label: "Top-Right",    value: "tr" },
  { label: "Centre",       value: "c"  },
  { label: "Bottom-Left",  value: "bl" },
  { label: "Bottom-Right", value: "br" },
  { label: "Tiled",        value: "tile"},
];

export default function WatermarkPage() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [text, setText] = useState("© Sandy Digital Hub");
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState("br");
  const [processing, setProcessing] = useState(false);
  const nameRef = useRef("watermarked.jpg");

  const handleFile = useCallback((file: File) => {
    nameRef.current = file.name.replace(/\.[^.]+$/, "") + "_watermarked.jpg";
    const reader = new FileReader();
    reader.onload = (e) => { setOriginalSrc(e.target?.result as string); setResultSrc(null); };
    reader.readAsDataURL(file);
  }, []);

  const applyWatermark = useCallback(() => {
    if (!originalSrc || !text.trim()) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Parse colour to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const alpha = opacity / 100;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textBaseline = "middle";

      const MARGIN = 24;
      const metrics = ctx.measureText(text);
      const tw = metrics.width;
      const th = fontSize;

      const positions: Record<string, [number, number]> = {
        tl: [MARGIN, MARGIN + th / 2],
        tr: [img.width - tw - MARGIN, MARGIN + th / 2],
        c:  [(img.width - tw) / 2, img.height / 2],
        bl: [MARGIN, img.height - MARGIN - th / 2],
        br: [img.width - tw - MARGIN, img.height - MARGIN - th / 2],
      };

      if (position === "tile") {
        const stepX = tw + fontSize * 3;
        const stepY = th + fontSize * 3;
        ctx.save();
        ctx.translate(img.width / 2, img.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.translate(-img.width, -img.height);
        for (let y = -img.height; y < img.height * 2; y += stepY) {
          for (let x = -img.width; x < img.width * 2; x += stepX) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      } else {
        const [px, py] = positions[position] ?? positions.br;
        // Shadow for legibility
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillStyle = "#000000";
        ctx.fillText(text, px + 2, py + 2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(text, px, py);
      }

      ctx.globalAlpha = 1;
      canvas.toBlob((blob) => {
        if (!blob) { setProcessing(false); return; }
        setResultSrc(URL.createObjectURL(blob));
        setProcessing(false);
      }, "image/jpeg", 0.93);
    };
    img.src = originalSrc;
  }, [originalSrc, text, fontSize, opacity, color, position]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<Layers className="w-9 h-9" />}
        title="Watermark Adder"
        description="Stamp text watermarks on your images with full control over opacity, colour, position, and size."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Watermark Text</label>
              <input
                type="text" value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Enter watermark text…"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-gray-600 text-sm">Font Size</label>
                <span className="text-orange-500 font-bold">{fontSize}px</span>
              </div>
              <input type="range" min={12} max={200} step={2} value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-orange-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-gray-600 text-sm">Opacity</label>
                <span className="text-orange-500 font-bold">{opacity}%</span>
              </div>
              <input type="range" min={5} max={100} step={5} value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-orange-500" />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">Colour</label>
              <div className="flex items-center gap-3">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-gray-400 text-sm font-mono">{color}</span>
                <div className="flex gap-2">
                  {["#ffffff", "#000000", "#ff4500", "#ffff00"].map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                      style={{ backgroundColor: c, borderColor: color === c ? "#f97316" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-3">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {POSITIONS.map((p) => (
                <button key={p.value} onClick={() => setPosition(p.value)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all
                    ${position === p.value ? "border-orange-500 bg-orange-100 text-orange-400" : "border-gray-200 bg-gray-50 text-gray-400 hover:border-orange-300"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!originalSrc && <DropZone onFileSelect={handleFile} />}

        {originalSrc && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePreview label="Original" src={originalSrc} />
              <ImagePreview label="With Watermark" src={resultSrc} />
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={applyWatermark} disabled={processing || !text.trim()}
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95">
                {processing ? "Applying…" : "Apply Watermark"}
              </button>
              <DownloadButton dataUrl={resultSrc} filename={nameRef.current} label="Download" />
              <button onClick={() => { setOriginalSrc(null); setResultSrc(null); }}
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
