"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles } from "lucide-react";
import Image from "next/image";

export type ServiceFormData = {
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  status: "ACTIVE" | "INACTIVE";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServiceFormData & { _id: string } | null;
  onSuccess: () => void;
};

interface ServicePreset {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
}

const SERVICE_PRESETS: ServicePreset[] = [
  {
    id: 'aay_certificate',
    title: 'Aay Praman Patra (Income Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    description: 'Official online application and verification for Income Certificate (आय प्रमाण पत्र) via UP e-District portal.'
  },
  {
    id: 'jati_certificate',
    title: 'Jati Praman Patra (Caste Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    description: 'Official online application and verification for Caste Certificate (जाति प्रमाण पत्र) for OBC/SC/ST categories.'
  },
  {
    id: 'niwas_certificate',
    title: 'Niwas Praman Patra (Domicile / Residence Certificate)',
    category: 'Jan Seva Kendra / e-District',
    price: 120,
    description: 'Official online application for Domicile / Residence Certificate (निवास प्रमाण पत्र) via UP e-District.'
  },
  {
    id: 'voter_id',
    title: 'Voter ID Card Application / Correction',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    description: 'New Voter ID card registration, address update, name correction, and digital voter card PDF download.'
  },
  {
    id: 'ration_card',
    title: 'Ration Card Application / Member Addition',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    description: 'New Ration Card filing, adding new family members, unit update, and e-Ration slip printout.'
  },
  {
    id: 'bhulekh',
    title: 'Khasra Khatauni / Bhulekh Land Records',
    category: 'Jan Seva Kendra / e-District',
    price: 50,
    description: 'Instant download and certified printout of UP Bhulekh Khasra-Khatauni land record details.'
  },
  {
    id: 'dl_application',
    title: 'Driving License (DL) Learning & Permanent Form',
    category: 'Transport & Cyber Services',
    price: 350,
    description: 'Online application form submission, RTO slot booking, and fee payment for Learning & Permanent Driving License.'
  },
  {
    id: 'scholarship',
    title: 'UP Scholarship Online Form Submission',
    category: 'Cyber Cafe Services',
    price: 150,
    description: 'Pre-matric and Post-matric UP Scholarship online application filling, renewal, and document upload.'
  },
  {
    id: 'pf_withdrawal',
    title: 'PF / EPFO Balance Withdrawal & KYC Update',
    category: 'Cyber Cafe Services',
    price: 250,
    description: 'UAN activation, Aadhaar/PAN/Bank KYC linking, and online Provident Fund (PF) advance/claim withdrawal.'
  },
  {
    id: 'birth_death_cert',
    title: 'Birth / Death Certificate Application',
    category: 'Jan Seva Kendra / e-District',
    price: 150,
    description: 'Online registration and application for municipal Birth or Death certificates.'
  },
  {
    id: 'web_dev',
    title: 'Website Development',
    category: 'Web Development',
    price: 4999,
    description: 'Custom responsive website development with fast loading speed, modern UI design, SEO optimization, and mobile-friendly layouts.'
  },
  {
    id: 'resume',
    title: 'Resume & Cover Letter Building',
    category: 'Graphic Design & Documents',
    price: 299,
    description: 'Professional resume formatting and ATS-friendly cover letter building tailored for job applications and corporate standards.'
  },
  {
    id: 'pan',
    title: 'PAN Card Application / Correction',
    category: 'Cyber Cafe Services',
    price: 199,
    description: 'Fast online application or correction service for physical and instant digital e-PAN cards.'
  },
  {
    id: 'aadhaar',
    title: 'Aadhaar Card Download & Print',
    category: 'Cyber Cafe Services',
    price: 50,
    description: 'High-quality color printout and PVC plastic card printing for original Aadhaar card downloads.'
  },
  {
    id: 'passport_photo',
    title: 'Passport Size Photo Printing',
    category: 'Digital Services',
    price: 100,
    description: 'Professional background editing, retouching, and high-grade glossy photo printing for passport-size photographs.'
  },
  {
    id: 'online_form',
    title: 'Online Form Submission & Counselling',
    category: 'Cyber Cafe Services',
    price: 150,
    description: 'Error-free online application filling for government exams, jobs, admissions, and competitive entrance forms.'
  },
  {
    id: 'graphic_design',
    title: 'Graphic Design & Poster Creation',
    category: 'Graphic Design',
    price: 499,
    description: 'Creative banner, flyer, logo, social media post, and business branding graphic design services.'
  },
  {
    id: 'photocopy',
    title: 'Photocopy & Document Scanning',
    category: 'Document Services',
    price: 20,
    description: 'High-speed black & white / color document photocopying, PDF scanning, and email forwarding.'
  },
];

export function ServiceFormModal({ isOpen, onClose, initialData, onSuccess }: Props) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "",
    price: 0,
    image: "",
    status: "ACTIVE",
  });
  
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [imageMode, setImageMode] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        price: initialData.price,
        image: initialData.image,
        status: initialData.status,
      });
      if (initialData.image?.startsWith('/uploads/')) {
        setImageMode('gallery');
      } else if (initialData.image?.startsWith('http')) {
        setImageMode('url');
      }
      setSelectedPresetId('custom');
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        price: 0,
        image: "",
        status: "ACTIVE",
      });
      setSelectedPresetId("");
      setImageMode('upload');
    }
    setError("");

    if (isOpen) {
      fetchExistingImages();
    }
  }, [initialData, isOpen]);

  const fetchExistingImages = async () => {
    try {
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      if (res.ok && data.images) {
        setExistingImages(data.images);
      }
    } catch (err) {
      console.error("Failed to fetch existing backend images:", err);
    }
  };

  if (!isOpen) return null;

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom' || !presetId) return;

    const found = SERVICE_PRESETS.find(p => p.id === presetId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        title: found.title,
        category: found.category,
        price: found.price,
        description: found.description,
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      setFormData(prev => ({ ...prev, image: data.url }));
      fetchExistingImages();
    } catch (err: any) {
      setError(err.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = initialData 
        ? `/api/services/${initialData._id}` 
        : '/api/services';
        
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save service');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#111111]/95 backdrop-blur p-4 sm:p-6 border-b border-white/10 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {initialData ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Preset Quick Select Bar */}
          <div className="bg-gradient-to-r from-[#FF7A00]/20 to-orange-600/10 p-4 rounded-2xl border border-[#FF7A00]/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] uppercase tracking-wider">
              <Sparkles size={15} />
              <span>Quick Select Service Preset</span>
            </div>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm font-medium outline-none focus:border-[#FF7A00] transition-colors"
            >
              <option value="">Select a service preset to auto-fill Title, Price & Description...</option>
              {SERVICE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title} (₹{preset.price})
                </option>
              ))}
              <option value="custom">Custom Service / Type Manually...</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title with Preset Dropdown & Custom Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-white/80">Service Title</label>
              <div className="space-y-2">
                <select
                  value={SERVICE_PRESETS.some(p => p.title === formData.title) ? SERVICE_PRESETS.find(p => p.title === formData.title)?.id : 'custom'}
                  onChange={(e) => handlePresetSelect(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white/80 text-xs focus:outline-none focus:border-[#FF7A00] transition-colors"
                >
                  <option value="custom">-- Choose Preset Title or Custom --</option>
                  {SERVICE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF7A00] transition-colors"
                  placeholder="e.g. Website Development"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-white/80">Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF7A00] transition-colors"
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-white/80">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF7A00] transition-colors"
                placeholder="e.g. 4999"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-white/80">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF7A00] transition-colors"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {/* Service Photo Upload & Gallery Selection */}
            <div className="space-y-3 md:col-span-2 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-[#FF7A00]" />
                  Service Photo Management
                </label>

                {/* Tab Controls */}
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-2.5 py-1 rounded-lg transition-all inline-flex items-center gap-1 ${
                      imageMode === 'upload' ? 'bg-[#FF7A00] text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Upload size={12} />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('gallery')}
                    className={`px-2.5 py-1 rounded-lg transition-all inline-flex items-center gap-1 ${
                      imageMode === 'gallery' ? 'bg-[#FF7A00] text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <ImageIcon size={12} />
                    <span>Server Photos ({existingImages.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-2.5 py-1 rounded-lg transition-all inline-flex items-center gap-1 ${
                      imageMode === 'url' ? 'bg-[#FF7A00] text-white font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <LinkIcon size={12} />
                    <span>URL</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: File Upload */}
              {imageMode === 'upload' && (
                <div className="bg-black/40 p-4 rounded-xl border border-dashed border-white/20 text-center space-y-3">
                  <input
                    type="file"
                    id="service-photo-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="service-photo-input"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-md"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Uploading Photo...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={15} />
                        <span>Choose Photo from Device</span>
                      </>
                    )}
                  </label>
                  <p className="text-[11px] text-white/40">Supports JPG, PNG, WEBP, SVG (Max 5MB)</p>
                </div>
              )}

              {/* Mode 2: Existing Backend Photos Gallery */}
              {imageMode === 'gallery' && (
                <div className="space-y-3">
                  {existingImages.length === 0 ? (
                    <div className="text-xs text-white/40 p-4 bg-black/40 rounded-xl text-center">
                      No uploaded photos found in server backend. Upload one using the "Upload" tab.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                      {existingImages.map((imgPath, idx) => {
                        const isSelected = formData.image === imgPath;
                        return (
                          <div
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, image: imgPath }))}
                            className={`relative h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                              isSelected ? 'border-[#FF7A00] ring-2 ring-[#FF7A00]/30 scale-95' : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <Image
                              src={imgPath}
                              alt="Server image"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-[#FF7A00] text-white rounded-full p-0.5 shadow">
                                <Check size={10} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Custom Image URL */}
              {imageMode === 'url' && (
                <div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF7A00] transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* Live Preview Box */}
              {formData.image && (
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-white/60 mb-1 flex justify-between items-center">
                    <span>Selected Photo Path: <code className="text-[#FF7A00] font-mono">{formData.image}</code></span>
                  </div>
                  <div className="w-full h-36 bg-black/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                    <Image 
                      src={formData.image} 
                      alt="Preview" 
                      fill
                      className="object-contain"
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs sm:text-sm font-medium text-white/80">Description</label>
                <span className="text-[11px] text-white/40">Select preset above to auto-fill description</span>
              </div>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF7A00] transition-colors resize-y"
                placeholder="Service description..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-medium text-white text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.image}
              className="px-6 py-3 rounded-xl font-medium bg-[#FF7A00] text-white text-sm hover:bg-[#FF7A00]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Service'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
