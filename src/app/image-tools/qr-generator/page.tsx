"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { ToolHero } from "@/components/image-tools/ToolHero";

type QRType = "url" | "upi" | "wifi" | "text";

export default function QrGeneratorPage() {
  const [qrType, setQrType] = useState<QRType>("url");
  
  // Custom inputs
  const [urlInput, setUrlInput] = useState("https://sandydigitalhub.com");
  const [upiVpa, setUpiVpa] = useState("8756454282@upi");
  const [upiName, setUpiName] = useState("Sandy Digital Hub");
  const [upiAmount, setUpiAmount] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [plainText, setPlainText] = useState("");

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = useCallback((): string => {
    switch (qrType) {
      case "url":
        return urlInput.startsWith("http") ? urlInput : `https://${urlInput}`;
      case "upi": {
        let uri = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiName)}`;
        if (upiAmount && !isNaN(Number(upiAmount))) {
          uri += `&am=${encodeURIComponent(upiAmount)}`;
        }
        uri += `&cu=INR`;
        return uri;
      }
      case "wifi":
        return `WIFI:S:${wifiSsid};T:WPA;P:${wifiPass};;`;
      case "text":
        return plainText || "Sandy Digital Hub";
      default:
        return urlInput;
    }
  }, [qrType, urlInput, upiVpa, upiName, upiAmount, wifiSsid, wifiPass, plainText]);

  // Generate QR Code using QuickChart QR API (client side image fetch)
  const generateQR = useCallback(() => {
    const text = getPayload();
    if (!text) return;

    const encodedText = encodeURIComponent(text);
    const fgClean = fgColor.replace("#", "");
    const bgClean = bgColor.replace("#", "");
    
    // High-res QR URL
    const chartUrl = `https://quickchart.io/qr?text=${encodedText}&size=400&dark=${fgClean}&light=${bgClean}&margin=2`;
    setQrDataUrl(chartUrl);
  }, [getPayload, fgColor, bgColor]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getPayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHero
        icon={<QrCode className="w-9 h-9" />}
        title="QR Code & UPI Generator"
        description="Create custom QR codes for Website URLs, UPI Payments, WiFi networks, and Contact Text."
        badge="Instant Download"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "url", label: "🌐 Website URL" },
            { id: "upi", label: "💳 UPI Payment QR" },
            { id: "wifi", label: "📶 WiFi Network" },
            { id: "text", label: "📝 Plain Text" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setQrType(tab.id as QRType)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                qrType === tab.id
                  ? "border-blue-500 bg-blue-500 text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls Form */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
            <h3 className="text-gray-900 font-bold text-lg">QR Configuration</h3>

            {qrType === "url" && (
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Website URL</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. https://sandydigitalhub.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {qrType === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="e.g. 8756454282@upi"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">Payee Name</label>
                  <input
                    type="text"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    placeholder="e.g. Sandy Digital Hub"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">Optional Amount (₹)</label>
                  <input
                    type="number"
                    value={upiAmount}
                    onChange={(e) => setUpiAmount(e.target.value)}
                    placeholder="Leave empty for customer choice"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {qrType === "wifi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">WiFi SSID (Name)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="WiFi Network Name"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">WiFi Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {qrType === "text" && (
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">Plain Text</label>
                <textarea
                  rows={4}
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Type any message, address or note..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>
            )}

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-gray-600 text-xs font-medium mb-1">QR Code Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="text-gray-500 text-xs font-mono">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs font-medium mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="text-gray-500 text-xs font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Preview & Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-6">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Live QR Preview
            </span>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-md inline-block">
              {qrDataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 object-contain rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-gray-300">
                  Generating...
                </div>
              )}
            </div>

            <div className="w-full flex flex-col gap-2">
              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download="qrcode.png"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all active:scale-95 shadow-md shadow-blue-200 text-sm"
                >
                  <Download className="w-4 h-4" /> Download QR Code Image
                </a>
              )}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Payload Copied!" : "Copy QR Payload Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
