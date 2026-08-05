'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload, Download, Image as ImageIcon, CheckCircle2, ShieldCheck,
  RefreshCw, FileText, ArrowRight, Zap, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Preset {
  id: string;
  name: string;
  hindiName: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  maxKb: number;
  desc: string;
}

const PRESETS: Preset[] = [
  {
    id: 'up_edistrict_photo',
    name: 'UP e-District Passport Photo',
    hindiName: 'UP ई-डिस्ट्रिक्ट फोटो (आय/जाति/निवास)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 132,
    heightPx: 170,
    maxKb: 50,
    desc: 'Mandatory size for UP Income, Caste, & Domicile certificate applications'
  },
  {
    id: 'up_edistrict_sig',
    name: 'UP e-District Signature',
    hindiName: 'UP ई-डिस्ट्रिक्ट हस्ताक्षर (Signature)',
    widthMm: 35,
    heightMm: 15,
    widthPx: 132,
    heightPx: 57,
    maxKb: 20,
    desc: 'Mandatory signature dimension for UP Jan Seva portal'
  },
  {
    id: 'pan_photo',
    name: 'PAN Card Photo (NSDL / UTI)',
    hindiName: 'पैन कार्ड फोटो spec',
    widthMm: 25,
    heightMm: 35,
    widthPx: 213,
    heightPx: 295,
    maxKb: 30,
    desc: 'Official 300 DPI specifications for NSDL PAN card portal'
  },
  {
    id: 'pan_sig',
    name: 'PAN Card Signature',
    hindiName: 'पैन कार्ड सिग्नेचर spec',
    widthMm: 45,
    heightMm: 20,
    widthPx: 400,
    heightPx: 180,
    maxKb: 30,
    desc: 'PAN card signature scan spec (<30KB)'
  },
  {
    id: 'passport_official',
    name: 'Indian Passport Photo',
    hindiName: 'पासपोर्ट साइज़ फोटो (Passport Seva)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    maxKb: 100,
    desc: 'High-res 300 DPI photo for official Passport Seva Kendra'
  }
];

export default function GovtPhotoResizerPage() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [fileSizeKb, setFileSizeKb] = useState<number>(0);
  const [originalName, setOriginalName] = useState<string>('photo.jpg');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-process image whenever imageSrc or selectedPreset changes
  useEffect(() => {
    if (!imageSrc) return;

    setIsCompressing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = selectedPreset.widthPx;
      canvas.height = selectedPreset.heightPx;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw image scaled to preset dimensions
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Binary search quality target to meet maxKb limit
      let quality = 0.92;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Calculate byte length
      let head = 'data:image/jpeg;base64,';
      let sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      let kb = sizeInBytes / 1024;

      while (kb > selectedPreset.maxKb && quality > 0.1) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
        kb = sizeInBytes / 1024;
      }

      setResizedDataUrl(dataUrl);
      setFileSizeKb(Math.round(kb * 10) / 10);
      setIsCompressing(false);
    };
  }, [imageSrc, selectedPreset]);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Zap size={14} /> Official Govt Specification Resizer
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Jan Seva Photo & <span className="text-[#2563EB]">Signature Resizer</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium">
            Automatically crop and compress passport photos & signatures to exact UP e-District, PAN Card, & Passport portal dimensions and KB limits!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Preset Selector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#2563EB]" /> Select Govt Portal Specification
              </h2>
              <div className="space-y-2.5">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-[#2563EB] ring-1 ring-[#2563EB]'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-gray-900'}`}>
                          {preset.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-black">
                          Max {preset.maxKb} KB
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium mt-1">
                        {preset.hindiName}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-2">
                        <span>Dimensions: {preset.widthMm}mm × {preset.heightMm}mm ({preset.widthPx}px × {preset.heightPx}px)</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Upload & Live Canvas Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
              
              {/* Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {!imageSrc ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#2563EB] rounded-2xl p-10 text-center transition-all cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">Upload Photo or Signature</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Supports JPG, PNG, WebP (camera photos from mobile supported)
                    </p>
                  </div>
                  <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-bold rounded-xl text-xs px-5">
                    Browse File
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Resized Result Preview */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="text-center space-y-2">
                      <div className="text-xs font-bold text-gray-500">Resized Result Preview</div>
                      <div className="inline-block border-2 border-[#2563EB] rounded-lg overflow-hidden bg-white shadow-md p-1">
                        {resizedDataUrl && (
                          <img
                            src={resizedDataUrl}
                            alt="Resized Govt Spec"
                            style={{ width: `${selectedPreset.widthPx}px`, height: `${selectedPreset.heightPx}px` }}
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span>Ready for Government Submission</span>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        <strong>Preset:</strong> {selectedPreset.name}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        <strong>Target Size:</strong> {selectedPreset.widthPx}px × {selectedPreset.heightPx}px
                      </div>
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
                        Output File Size: {fileSizeKb} KB (Limit: &lt;{selectedPreset.maxKb} KB)
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} /> Change Photo
                    </Button>

                    {resizedDataUrl && (
                      <a
                        href={resizedDataUrl}
                        download={`sdh_govt_${selectedPreset.id}_${originalName.replace(/\.[^/.]+$/, "")}.jpg`}
                      >
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-6 shadow-md flex items-center gap-2">
                          <Download size={16} /> Download Spec Photo (.JPG)
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Notice */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-400">
                  <ShieldCheck size={14} /> 100% Private & Instant Processing
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Your photo is cropped and compressed strictly inside your browser. No files are stored on any server.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
