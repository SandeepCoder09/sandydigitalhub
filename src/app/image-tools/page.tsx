/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { ToolCard } from "@/components/image-tools/ToolCard";
import {
  Minimize2, User, RefreshCcw, Maximize2, Crop, Eraser, Layers, Zap, FileText, QrCode
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Image & Document Tools | Sandy Digital Hub",
  description: "Free browser-based tools: image compressor, PDF generator, QR code generator, passport photo maker, converter, resizer, cropper & watermark. No uploads, 100% private.",
  keywords: "image compressor, image to pdf, qr code generator, passport photo maker, image converter, image resizer, crop image, remove background, watermark image",
};

const tools = [
  { href: "/image-tools/compress", icon: <Minimize2 className="w-7 h-7" />, title: "Image Compressor", description: "Reduce image file size from MB to KB without any visible quality loss. Perfect for web uploads and WhatsApp.", badge: "Most Popular", color: "from-orange-500 to-orange-600" },
  { href: "/image-tools/passport-photo", icon: <User className="w-7 h-7" />, title: "Passport Photo Maker", description: "Generate standard passport-size photos (35×45mm). Get a printable sheet of 8 photos instantly.", badge: "Print Ready", color: "from-blue-500 to-blue-600" },
  { href: "/image-tools/image-to-pdf", icon: <FileText className="w-7 h-7" />, title: "Image to PDF Converter", description: "Combine single or multiple images (JPG/PNG) into a clean, printable PDF document.", badge: "New Feature", color: "from-emerald-500 to-emerald-600" },
  { href: "/image-tools/qr-generator", icon: <QrCode className="w-7 h-7" />, title: "QR Code & UPI Generator", description: "Generate custom QR codes for Website URLs, UPI Payments, WiFi credentials, and plain text.", badge: "New Feature", color: "from-indigo-500 to-indigo-600" },
  { href: "/image-tools/convert", icon: <RefreshCcw className="w-7 h-7" />, title: "Format Converter", description: "Convert images between JPG, PNG, WebP formats in one click — right in your browser.", color: "from-purple-500 to-purple-600" },
  { href: "/image-tools/resize", icon: <Maximize2 className="w-7 h-7" />, title: "Image Resizer", description: "Resize by exact pixels or percentage. Lock aspect ratio. Supports batch presets for social media.", color: "from-green-500 to-green-600" },
  { href: "/image-tools/crop", icon: <Crop className="w-7 h-7" />, title: "Image Cropper", description: "Crop your image with drag handles. Choose from freehand, square, 16:9, 4:3 and more presets.", color: "from-cyan-500 to-cyan-600" },
  { href: "/image-tools/background-remove", icon: <Eraser className="w-7 h-7" />, title: "Background Remover", description: "Remove plain colour backgrounds and make images transparent or white — great for logos and product photos.", color: "from-pink-500 to-pink-600" },
  { href: "/image-tools/watermark", icon: <Layers className="w-7 h-7" />, title: "Watermark Adder", description: "Stamp custom text watermarks with full control over opacity, position, size, and colour.", color: "from-yellow-500 to-yellow-600" },
];

const stats = [
  { value: "9", label: "Free Tools" },
  { value: "100%", label: "Browser-Based" },
  { value: "0 KB", label: "Server Uploads" },
  { value: "∞", label: "Files Processed" },
];

export default function ImageToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" /> 100% Free · No Sign-up · No Uploads
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
            Free{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Image Tools
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Compress, convert, resize, crop, and more — all processed directly in your browser. Your images never leave your device.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-orange-500">{s.value}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        {/* Privacy banner */}
        <div className="mt-16 rounded-2xl border border-green-200 bg-green-50 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">100% Private — Nothing Leaves Your Browser</h3>
            <p className="text-gray-500 text-sm">
              All image processing happens locally using the Canvas API. We never upload, store, or transmit your images to any server. Your files stay on your device at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
