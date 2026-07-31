'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <main className="flex-1 space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                <FolderCheck className="text-[#FF4500]" /> User Attached Documents & Photos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View, inspect, and download all document files uploaded by users during checkout.
              </p>
            </div>
            <button
              onClick={fetchUploads}
              className="px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF4500] font-bold text-xs flex items-center gap-1.5 transition-colors border border-orange-200 w-fit shrink-0 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Gallery</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
            <Search className="text-gray-400 shrink-0" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User Name, Email, Order ID, or File Name..."
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Uploads Gallery Grid */}
          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center py-20">
              <RefreshCw size={32} className="animate-spin text-[#FF4500] mx-auto mb-3" />
              <p className="text-gray-500 font-bold">Loading user uploaded files...</p>
            </div>
          ) : filteredUploads.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center py-16">
              <FolderCheck size={48} className="text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg mb-1">No Attached Files Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                When users attach identity proofs, photos, or documents during checkout, they will automatically appear in this gallery.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUploads.map((item) => {
                const isImage = item.documentUrl?.startsWith('data:image/') || item.documentName?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                const orderBrandedId = formatOrderId(item._id, item.createdAt);
                const userName = item.user?.name || 'Rahul Sharma';
                const userEmail = item.user?.email || 'rahulsharma@example.com';
                const firstService = item.items?.[0]?.title || 'Digital Service Request';

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group hover:border-orange-300"
                  >
                    {/* Media Preview Box */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-100">
                      {isImage ? (
                        <img
                          src={item.documentUrl}
                          alt={item.documentName || 'User upload'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-gray-400 text-center">
                          <FileText size={48} className="text-[#FF4500] mb-2" />
                          <span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">
                            {item.documentName || 'Document File'}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-extrabold mt-1">PDF / Document</span>
                        </div>
                      )}

                      {/* Quick Action Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-3 bg-white text-gray-900 rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer font-bold text-xs flex items-center gap-1.5"
                        >
                          <Eye size={16} className="text-[#FF4500]" /> Preview
                        </button>
                        <a
                          href={item.documentUrl}
                          download={item.documentName || 'user_attached_file'}
                          className="p-3 bg-[#FF4500] text-white rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer font-bold text-xs flex items-center gap-1.5"
                        >
                          <Download size={16} /> Download
                        </a>
                      </div>

                      {/* Status Tag */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black uppercase text-gray-800 border border-gray-200 shadow-sm">
                        {orderBrandedId}
                      </div>
                    </div>

                    {/* Information Body */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                          <User size={14} className="text-[#FF4500]" />
                          <span>{userName}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-3">{userEmail}</p>

                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-gray-800 truncate">
                            <ShoppingBag size={13} className="text-[#FF4500] shrink-0" />
                            <span className="truncate">{firstService}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] pt-1">
                            <Calendar size={12} />
                            <span>{formatDateTime(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* File Footer */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-[#FF4500] truncate max-w-[170px]" title={item.documentName}>
                          📎 {item.documentName || 'Attached Document'}
                        </span>
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="text-xs font-bold text-gray-700 hover:text-[#FF4500] flex items-center gap-1 cursor-pointer"
                        >
                          View Full <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* High Resolution Lightbox / Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-100 text-[#FF4500] rounded-xl">
                  <FolderCheck size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    {previewItem.documentName || 'User Document Preview'}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    Attached by {previewItem.user?.name || 'Rahul Sharma'} ({previewItem.user?.email || 'rahulsharma@example.com'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body View */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-100 flex items-center justify-center min-h-[300px]">
              {previewItem.documentUrl?.startsWith('data:image/') || previewItem.documentName?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <img
                  src={previewItem.documentUrl}
                  alt={previewItem.documentName}
                  className="max-h-[60vh] max-w-full object-contain rounded-2xl border border-gray-300 shadow-md"
                />
              ) : (
                <div className="text-center p-12 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md">
                  <FileText size={64} className="text-[#FF4500] mx-auto mb-4" />
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{previewItem.documentName}</h4>
                  <p className="text-xs text-gray-500 mb-6">This document is a PDF or binary file format.</p>
                  <a
                    href={previewItem.documentUrl}
                    download={previewItem.documentName || 'user_file'}
                    className="px-6 py-3 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-2xl inline-flex items-center gap-2 text-sm shadow-lg shadow-orange-500/20"
                  >
                    <Download size={16} /> Download File to View
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium">
                Order ID: <span className="font-bold text-gray-900">{formatOrderId(previewItem._id, previewItem.createdAt)}</span> · Date: {formatDateTime(previewItem.createdAt)}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 text-xs hover:bg-gray-100 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
                <a
                  href={previewItem.documentUrl}
                  download={previewItem.documentName || 'user_file'}
                  className="px-5 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-200 w-full sm:w-auto"
                >
                  <Download size={15} /> Download Document
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
