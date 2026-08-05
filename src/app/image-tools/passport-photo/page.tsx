"use client";

import { useState, useCallback, useRef } from "react";
import { User, Printer, Info } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

// Standard passport sizes in mm -> pixels at 300 DPI
const SIZES = {
  "India (35×45mm)":    { w: 413, h: 531 },
  "US (2×2 inch)":      { w: 600, h: 600 },
  "UK (35×45mm)":       { w: 413, h: 531 },
  "EU (35×45mm)":       { w: 413, h: 531 },
  "Canada (50×70mm)":   { w: 590, h: 826 },
  "Australia (35×45mm)":{ w: 413, h: 531 },
};

const LAYOUTS = {
  "Sheet of 8 (A4)": { cols: 4, rows: 2 },
  "Sheet of 4":      { cols: 2, rows: 2 },
  "Single":          { cols: 1, rows: 1 },
};

const BACKGROUNDS = [
  { label: "White",   value: "#ffffff" },
  { label: "Off-White", value: "#f0eeea" },
  { label: "Light Blue", value: "#a8c8f0" },
  { label: "None (keep)", value: "keep" },
];

export default function PassportPhotoPage() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [sheetSrc, setSheetSrc] = useState<string | null>(null);
  const [size, setSize] = useState<keyof typeof SIZES>("India (35×45mm)");
  const [layout, setLayout] = useState<keyof typeof LAYOUTS>("Sheet of 8 (A4)");
  const [bg, setBg] = useState("#ffffff");
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<File | null>(null);

  const handleFile = useCallback((file: File) => {
    fileRef.current = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalSrc(e.target?.result as string);
      setPreviewSrc(null);
      setSheetSrc(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const generate = useCallback(() => {
    if (!originalSrc) return;
    setProcessing(true);

    const { w, h } = SIZES[size];
    const { cols, rows } = LAYOUTS[layout];

    const img = new Image();
    img.onload = () => {
      // --- Single passport photo canvas ---
      const singleCanvas = document.createElement("canvas");
      singleCanvas.width = w;
      singleCanvas.height = h;
      const sCtx = singleCanvas.getContext("2d")!;

      if (bg !== "keep") {
        sCtx.fillStyle = bg;
        sCtx.fillRect(0, 0, w, h);
      }

      // Cover-fit the image (centre crop)
      const scale = Math.max(w / img.width, h / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      const sx = (w - sw) / 2;
      const sy = (h - sh) / 2;
      sCtx.drawImage(img, sx, sy, sw, sh);

      // Preview of single photo
      setPreviewSrc(singleCanvas.toDataURL("image/jpeg", 0.95));

      // --- Sheet canvas ---
      const GAP = 20; // pixels between photos
      const MARGIN = 40;
      const sheetW = MARGIN * 2 + cols * w + (cols - 1) * GAP;
      const sheetH = MARGIN * 2 + rows * h + (rows - 1) * GAP;

      const sheetCanvas = document.createElement("canvas");
      sheetCanvas.width = sheetW;
      sheetCanvas.height = sheetH;
      const shCtx = sheetCanvas.getContext("2d")!;
      shCtx.fillStyle = "#ffffff";
      shCtx.fillRect(0, 0, sheetW, sheetH);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = MARGIN + c * (w + GAP);
          const y = MARGIN + r * (h + GAP);
          shCtx.drawImage(singleCanvas, x, y);
          // Thin border
          shCtx.strokeStyle = "#dddddd";
          shCtx.lineWidth = 1;
          shCtx.strokeRect(x, y, w, h);
        }
      }

      setSheetSrc(sheetCanvas.toDataURL("image/jpeg", 0.95));
      setProcessing(false);
    };
    img.src = originalSrc;
  }, [originalSrc, size, layout, bg]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<User className="w-9 h-9" />}
        title="Passport Photo Maker"
        description="Generate print-ready passport size photos in standard dimensions. Multiple countries supported."
        badge="Print Ready"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Passport Size Standard</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as keyof typeof SIZES)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-blue-500"
            >
              {Object.keys(SIZES).map((s) => <option key={s} value={s} className="bg-white">{s}</option>)}
            </select>
            <p className="text-gray-400 text-xs mt-1">
              {SIZES[size].w}×{SIZES[size].h}px at 300 DPI
            </p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Sheet Layout</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as keyof typeof LAYOUTS)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-blue-500"
            >
              {Object.keys(LAYOUTS).map((l) => <option key={l} value={l} className="bg-white">{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Background Colour</label>
            <div className="flex gap-2 flex-wrap">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBg(b.value)}
                  title={b.label}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${bg === b.value ? "border-blue-500 text-blue-600" : "border-gray-200 text-gray-400 hover:border-white/30"}`}
                  style={b.value !== "keep" ? { backgroundColor: `${b.value}20` } : {}}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload */}
        {!originalSrc && <DropZone onFileSelect={handleFile} />}

        {/* Result */}
        {originalSrc && (
          <div className="space-y-6">
            {/* Info */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Info className="w-3.5 h-3.5" />
              Image will be centre-cropped to fit passport dimensions. For best results, use a close-up portrait with face centred.
            </div>

            {/* Preview row */}
            {previewSrc && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">Single Photo Preview</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-white p-2 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewSrc} alt="Passport preview" className="max-h-48 object-contain" />
                  </div>
                </div>
                {sheetSrc && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">Print Sheet Preview</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sheetSrc} alt="Passport sheet" className="w-full max-h-48 object-contain" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={generate}
                disabled={processing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                {processing ? "Generating…" : "Generate Photos"}
              </button>
              <DownloadButton dataUrl={previewSrc} filename="passport-single.jpg" label="Download Single" />
              <DownloadButton dataUrl={sheetSrc} filename="passport-sheet.jpg" label="Download Sheet" />
              <button
                onClick={() => { setOriginalSrc(null); setPreviewSrc(null); setSheetSrc(null); }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-300 text-sm transition-all"
              >
                Change Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
