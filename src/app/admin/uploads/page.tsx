'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { FolderCheck, Search, Download, Eye, FileText, Image as ImageIcon, Calendar, User, ShoppingBag, ExternalLink, X, RefreshCw } from 'lucide-react';
import { formatDateTime, formatOrderId } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

export default function AdminUploadsPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/uploads');
      if (res.ok) {
        const data = await res.json();
        setUploads(data.uploads || []);
      } else {
        toast.error('Failed to load user uploads.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const filteredUploads = uploads.filter((item) => {
    const userName = item.user?.name || 'Rahul Sharma';
    const userEmail = item.user?.email || 'rahulsharma@example.com';
    const fileName = item.documentName || '';
    const orderId = formatOrderId(item._id, item.createdAt);
    const serviceTitles = item.items?.map((i: any) => i.title).join(' ') || '';

    const query = searchQuery.toLowerCase();
    return (
      userName.toLowerCase().includes(query) ||
      userEmail.toLowerCase().includes(query) ||
      fileName.toLowerCase().includes(query) ||
      orderId.toLowerCase().includes(query) ||
      serviceTitles.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FolderCheck className="text-violet-600" size={24} />
            User Uploads Inspector
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Audit customer photos, ID proofs, and document attachments ({uploads.length} uploaded files)
          </p>
        </div>
        <button
          onClick={fetchUploads}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-violet-50 text-gray-700 hover:text-violet-700 font-bold text-xs transition-colors cursor-pointer border border-gray-200 shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Files</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer name, Email, or File name..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs font-bold text-gray-400">
          Loading document attachments...
        </div>
      ) : filteredUploads.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <FolderCheck size={40} className="mx-auto text-gray-300" />
          <h3 className="text-sm font-extrabold text-gray-900">No Uploaded Files Found</h3>
          <p className="text-xs text-gray-500">No customer file uploads match your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUploads.map((item) => {
            const isImage = item.documentUrl?.match(/\.(jpg|jpeg|png|webp|gif)/i);
            const brandedId = formatOrderId(item._id, item.createdAt);

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-violet-300 transition-all group"
              >
                <div className="p-5 space-y-4">
                  {/* File Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                        {isImage ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-gray-900 truncate">
                          {item.documentName || 'Customer Attachment'}
                        </div>
                        <div className="font-mono text-[10px] font-bold text-violet-700">
                          {brandedId}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Thumbnail Preview */}
                  {isImage ? (
                    <div className="relative aspect-video rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 group">
                      <img
                        src={item.documentUrl}
                        alt="User Upload"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="py-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-500">
                      <FileText size={32} className="text-slate-400" />
                      <span className="text-[11px] font-bold">Document Attachment</span>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="space-y-1 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                      <User size={13} className="text-gray-400" />
                      <span>{item.user?.name || 'Customer'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium text-[11px]">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{formatDateTime(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-violet-50 text-gray-700 hover:text-violet-700 border border-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={14} /> View Details
                  </button>
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Inspector Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Document Attachment Inspection</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Order ID: <span className="font-mono font-bold text-violet-700">{formatOrderId(previewItem._id, previewItem.createdAt)}</span>
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {previewItem.documentUrl?.match(/\.(jpg|jpeg|png|webp|gif)/i) ? (
                <div className="max-h-80 overflow-hidden rounded-2xl bg-black/5 flex items-center justify-center p-2">
                  <img src={previewItem.documentUrl} alt="Preview" className="max-h-76 object-contain rounded-xl" />
                </div>
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl text-center space-y-2 border border-slate-200">
                  <FileText size={40} className="mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">{previewItem.documentName || 'Document Attachment'}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 font-medium">Customer:</span>
                  <div className="font-extrabold text-gray-900 mt-0.5">{previewItem.user?.name || 'Customer'}</div>
                  <div className="text-[11px] text-gray-500">{previewItem.user?.email || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Uploaded Date:</span>
                  <div className="font-bold text-gray-900 mt-0.5">{formatDateTime(previewItem.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <a
                href={previewItem.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download size={14} /> Open Full Attachment
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
