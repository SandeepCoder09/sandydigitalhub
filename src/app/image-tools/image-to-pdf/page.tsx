"use client";

import { useState, useCallback, useRef } from "react";
import { FileText, Plus, Trash2, ArrowUp, ArrowDown, Download } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { ToolHero } from "@/components/image-tools/ToolHero";
import jsPDF from "jspdf";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("a4");
  const [orientation, setOrientation] = useState<"p" | "l">("p");
  const [margin, setMargin] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    const newItem: ImageItem = {
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    };
    setImages((prev) => [...prev, newItem]);
    setPdfUrl(null);
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
    setPdfUrl(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      let doc: jsPDF | null = null;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const imgWidth = img.width;
        const imgHeight = img.height;

        let pdfPageW = 210; // A4 portrait width in mm
        let pdfPageH = 297; // A4 portrait height in mm

        if (pageSize === "letter") {
          pdfPageW = 215.9;
          pdfPageH = 279.4;
        } else if (pageSize === "fit") {
          // Convert pixels to mm approx (300 DPI)
          pdfPageW = (imgWidth / 300) * 25.4;
          pdfPageH = (imgHeight / 300) * 25.4;
        }

        if (pageSize !== "fit" && orientation === "l") {
          const temp = pdfPageW;
          pdfPageW = pdfPageH;
          pdfPageH = temp;
        }

        if (i === 0) {
          doc = new jsPDF({
            orientation: orientation === "l" && pageSize !== "fit" ? "landscape" : "portrait",
            unit: "mm",
            format: pageSize === "fit" ? [pdfPageW, pdfPageH] : pageSize,
          });
        } else if (doc) {
          doc.addPage(
            pageSize === "fit" ? [pdfPageW, pdfPageH] : pageSize,
            orientation === "l" && pageSize !== "fit" ? "landscape" : "portrait"
          );
        }

        if (!doc) continue;

        const availW = pdfPageW - margin * 2;
        const availH = pdfPageH - margin * 2;

        const ratio = Math.min(availW / imgWidth, availH / imgHeight);
        const drawW = imgWidth * ratio;
        const drawH = imgHeight * ratio;

        const xPos = margin + (availW - drawW) / 2;
        const yPos = margin + (availH - drawH) / 2;

        doc.addImage(img, "JPEG", xPos, yPos, drawW, drawH);
      }

      if (doc) {
        const blob = doc.output("blob");
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<FileText className="w-9 h-9" />}
        title="Image to PDF Converter"
        description="Convert single or multiple images (JPG, PNG, WebP) into a clean, printable PDF document."
        badge="Multi-Page Support"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {/* Settings Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value as any);
                setPdfUrl(null);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="a4">A4 (Standard Document)</option>
              <option value="letter">US Letter</option>
              <option value="fit">Fit to Image Size</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Page Orientation</label>
            <select
              value={orientation}
              disabled={pageSize === "fit"}
              onChange={(e) => {
                setOrientation(e.target.value as any);
                setPdfUrl(null);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="p">Portrait (Vertical)</option>
              <option value="l">Landscape (Horizontal)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Margin (mm)</label>
            <input
              type="number"
              min={0}
              max={30}
              value={margin}
              onChange={(e) => {
                setMargin(Number(e.target.value));
                setPdfUrl(null);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dropzone */}
        <DropZone onFileSelect={handleFileSelect} />

        {/* Image List / Order */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 font-bold text-lg">
                Selected Images ({images.length})
              </h3>
              <p className="text-gray-400 text-xs">Reorder images using up/down arrows</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm flex items-center gap-3 relative group"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={`Image ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium text-xs truncate">{item.file.name}</p>
                    <p className="text-gray-400 text-[11px]">
                      {(item.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveImage(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 text-xs"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, "down")}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 text-xs"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeImage(item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold transition-all active:scale-95 shadow-md shadow-blue-200"
              >
                <FileText className="w-4 h-4" />
                {isGenerating ? "Generating PDF…" : "Convert to PDF"}
              </button>

              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download="document.pdf"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all active:scale-95 shadow-md shadow-green-200"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              )}

              <button
                onClick={() => {
                  images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
                  setImages([]);
                  setPdfUrl(null);
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 text-sm transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
