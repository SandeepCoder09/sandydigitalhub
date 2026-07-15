"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

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

export function ServiceFormModal({ isOpen, onClose, initialData, onSuccess }: Props) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "",
    price: 0,
    image: "",
    status: "ACTIVE",
  });
  
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
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        price: 0,
        image: "",
        status: "ACTIVE",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111111] p-6 border-b border-white/10 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
                placeholder="e.g. Website Development"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
                placeholder="e.g. 4999"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white/80">Image URL</label>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2 text-sm text-white/50">
                  Preview available below
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF7A00] transition-colors resize-y"
                placeholder="Service description..."
              />
            </div>
            
            {formData.image && (
              <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-medium text-white/80">Image Preview</label>
                 <div className="w-full h-48 bg-black/50 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                      }}
                    />
                 </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-medium text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-medium bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
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
