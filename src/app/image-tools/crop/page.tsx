"use client";

import { useState, useCallback, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { Crop } from "lucide-react";
import { DropZone } from "@/components/image-tools/DropZone";
import { DownloadButton } from "@/components/image-tools/DownloadButton";
import { ToolHero } from "@/components/image-tools/ToolHero";

const ASPECT_PRESETS = [
  { label: "Free", ratio: null },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:4", ratio: 3 / 4 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "9:16", ratio: 9 / 16 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "A4", ratio: 210 / 297 },
];

interface Rect { x: number; y: number; w: number; h: number; }

export default function CropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPt, setStartPt] = useState({ x: 0, y: 0 });
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const nameRef = useRef("cropped.jpg");

  const handleFile = useCallback((file: File) => {
    nameRef.current = file.name.replace(/\.[^.]+$/, "") + "_cropped.jpg";
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setNaturalW(img.width);
      setNaturalH(img.height);
      imgRef.current = img;
    };
    img.src = url;
    setImageSrc(url);
    setCroppedSrc(null);
    setRect({ x: 0, y: 0, w: 0, h: 0 });
  }, []);

  // Draw the image + selection rectangle on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
    if (rect.w > 2 && rect.h > 2) {
      // Dim overlay
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Clear inside selection
      ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      // Dim again
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Bright inside
      ctx.drawImage(
        imgRef.current,
        (rect.x / canvas.width) * naturalW,
        (rect.y / canvas.height) * naturalH,
        (rect.w / canvas.width) * naturalW,
        (rect.h / canvas.height) * naturalH,
        rect.x, rect.y, rect.w, rect.h
      );
      // Border
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.setLineDash([]);
      // Handles
      const handleSize = 8;
      ctx.fillStyle = "#f97316";
      [[rect.x, rect.y], [rect.x + rect.w, rect.y], [rect.x, rect.y + rect.h], [rect.x + rect.w, rect.y + rect.h]].forEach(([hx, hy]) => {
        ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
      });
    }
  }, [rect, imageSrc, naturalW, naturalH]);

  const getPos = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const bounds = canvas.getBoundingClientRect();
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - bounds.left) * scaleX,
      y: (clientY - bounds.top) * scaleY,
    };
  };

  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setStartPt(pos);
    setDragging(true);
    setRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setCroppedSrc(null);
  };

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!dragging || !canvasRef.current) return;
    const pos = getPos(e);
    let w = pos.x - startPt.x;
    let h = pos.y - startPt.y;
    if (aspectRatio) h = Math.abs(w) / aspectRatio * Math.sign(h);
    const x = w < 0 ? pos.x : startPt.x;
    const y = h < 0 ? (aspectRatio ? startPt.y - Math.abs(h) : pos.y) : startPt.y;
    setRect({ x, y, w: Math.abs(w), h: Math.abs(h) });
  };

  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 1) return;
    const pos = getPos(e);
    setStartPt(pos);
    setDragging(true);
    setRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setCroppedSrc(null);
  };

  const onTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (!dragging || !canvasRef.current || e.touches.length > 1) return;
    const pos = getPos(e);
    let w = pos.x - startPt.x;
    let h = pos.y - startPt.y;
    if (aspectRatio) h = Math.abs(w) / aspectRatio * Math.sign(h);
    const x = w < 0 ? pos.x : startPt.x;
    const y = h < 0 ? (aspectRatio ? startPt.y - Math.abs(h) : pos.y) : startPt.y;
    setRect({ x, y, w: Math.abs(w), h: Math.abs(h) });
  };

  const cropImage = useCallback(() => {
    if (!imgRef.current || !canvasRef.current || rect.w < 2 || rect.h < 2) return;
    const canvas = canvasRef.current;
    const scaleX = naturalW / canvas.width;
    const scaleY = naturalH / canvas.height;
    const out = document.createElement("canvas");
    out.width = Math.round(rect.w * scaleX);
    out.height = Math.round(rect.h * scaleY);
    const ctx = out.getContext("2d")!;
    ctx.drawImage(imgRef.current,
      rect.x * scaleX, rect.y * scaleY, rect.w * scaleX, rect.h * scaleY,
      0, 0, out.width, out.height
    );
    out.toBlob((blob) => {
      if (!blob) return;
      setCroppedSrc(URL.createObjectURL(blob));
    }, "image/jpeg", 0.95);
  }, [rect, naturalW, naturalH]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<Crop className="w-9 h-9" />}
        title="Image Cropper"
        description="Draw a selection on your image to crop it. Choose from aspect-ratio presets or go freehand."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-6">

        {/* Aspect ratio presets */}
        <div className="flex flex-wrap gap-2">
          {ASPECT_PRESETS.map((p) => (
            <button key={p.label}
              onClick={() => setAspectRatio(p.ratio)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                ${aspectRatio === p.ratio
                  ? "border-purple-500 bg-purple-100 text-blue-400"
                  : "border-gray-200 bg-white text-gray-400 hover:border-purple-300"}`}>
              {p.label}
            </button>
          ))}
        </div>

        {!imageSrc && <DropZone onFileSelect={handleFile} />}

        {imageSrc && (
          <>
            <p className="text-gray-400 text-sm">Click/touch and drag on the image to select the crop area.</p>
            <div className="rounded-2xl overflow-hidden border border-gray-200 touch-none">
              <canvas
                ref={canvasRef}
                width={800} height={600}
                className="w-full cursor-crosshair select-none"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onMouseUp}
              />
            </div>

            {croppedSrc && (
              <div>
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wider">Cropped Result</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={croppedSrc} alt="Cropped" className="max-h-64 rounded-xl border border-gray-200 object-contain" />
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button onClick={cropImage}
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-blue-400 text-white font-semibold transition-all active:scale-95">
                Crop Image
              </button>
              <DownloadButton dataUrl={croppedSrc} filename={nameRef.current} label="Download Cropped" />
              <button onClick={() => { setImageSrc(null); setCroppedSrc(null); imgRef.current = null; }}
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
