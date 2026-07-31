"use client";

import { useState } from "react";
import { ServiceFormModal, ServiceFormData } from "./ServiceFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Edit, Trash2, Tag, Plus, RefreshCw } from "lucide-react";

type Service = ServiceFormData & {
  _id: string;
};

type Props = {
  initialServices: Service[];
};

export function AdminServicesManager({ initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (res.ok) {
        setServices(data.services);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    const id = serviceToDelete;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setServices(services.filter(s => s._id !== id));
        setServiceToDelete(null);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("An error occurred while deleting the service.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
  };

  const handleModalSuccess = () => {
    fetchServices();
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Services</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchServices}
            className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
            title="Refresh & sync services list"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Sync Services</span>
          </button>
          <button 
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 bg-[#FF4500] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#FF4500]/90 transition-colors shadow-md shadow-orange-200"
          >
            <Plus size={16} />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500 shadow-sm">
          No services found. Click "+ Add Service" to create one.
        </div>
      ) : (
        <>
          {/* Mobile Service Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {services.map((service) => (
              <div key={service._id.toString()} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{service.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Tag size={12} className="text-[#FF4500]" />
                      <span>{service.category}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    service.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-sm font-bold text-[#FF4500]">
                    ₹{service.price}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(service._id)}
                      disabled={isDeleting === service._id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      {isDeleting === service._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Service Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-800">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm bg-white">
                  {services.map((service) => (
                    <tr key={service._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{service.title}</td>
                      <td className="p-4 text-gray-600">{service.category}</td>
                      <td className="p-4 font-bold text-[#FF4500]">₹{service.price}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          service.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-3">
                        <button 
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:underline transition-colors font-semibold"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(service._id)}
                          disabled={isDeleting === service._id}
                          className="text-red-600 hover:underline transition-colors disabled:opacity-50 font-semibold"
                        >
                          {isDeleting === service._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ServiceFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingService}
        onSuccess={handleModalSuccess}
      />

      <ConfirmModal
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        isLoading={!!isDeleting}
      />
    </>
  );
}
