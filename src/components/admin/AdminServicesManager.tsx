"use client";

import { useState } from "react";
import { ServiceFormModal, ServiceFormData } from "./ServiceFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Edit, Trash2, Tag, Plus } from "lucide-react";

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Services</h1>
        <button 
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 bg-[#FF7A00] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#FF7A00]/90 transition-colors shadow-lg"
        >
          <Plus size={16} />
          <span>Add Service</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-[#111111] p-8 rounded-2xl border border-white/10 text-center text-white/50">
          No services found. Click "+ Add Service" to create one.
        </div>
      ) : (
        <>
          {/* Mobile Service Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {services.map((service) => (
              <div key={service._id.toString()} className="bg-[#111111] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base">{service.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                      <Tag size={12} className="text-[#FF7A00]" />
                      <span>{service.category}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    service.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div className="text-sm font-bold text-[#FF7A00]">
                    ₹{service.price}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(service._id)}
                      disabled={isDeleting === service._id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50"
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
          <div className="hidden md:block bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold uppercase text-white/50">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {services.map((service) => (
                    <tr key={service._id.toString()} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-medium text-white">{service.title}</td>
                      <td className="p-4 text-white/70">{service.category}</td>
                      <td className="p-4 font-bold text-[#FF7A00]">₹{service.price}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          service.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-3">
                        <button 
                          onClick={() => handleEdit(service)}
                          className="text-blue-400 hover:underline transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(service._id)}
                          disabled={isDeleting === service._id}
                          className="text-red-400 hover:underline transition-colors disabled:opacity-50 font-medium"
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
