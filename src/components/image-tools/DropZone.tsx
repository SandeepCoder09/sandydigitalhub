"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxMB?: number;
  className?: string;
}

export function DropZone({
  onFileSelect,
  accept = "image/*",
  maxMB = 20,
  className = "",
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/")) return "Please select an image file.";
      if (file.size > maxMB * 1024 * 1024) return `File size must be under ${maxMB} MB.`;
      return null;
    },
    [maxMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) { setError(err); return; }
      setError(null);
      onFileSelect(file);
    },
    [validate, onFileSelect]
  );

  const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 p-10 min-h-[220px]
          ${dragging
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
          ${dragging ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"}`}>
          {dragging ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg">
            {dragging ? "Drop your image here" : "Drop image here or click to browse"}
          </p>
          <p className="text-gray-400 text-sm mt-1">Supports JPG, PNG, WebP — Max {maxMB} MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />
      </div>
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
