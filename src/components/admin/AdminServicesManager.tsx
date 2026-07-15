"use client";

import { useState } from "react";
import { ServiceFormModal, ServiceFormData } from "./ServiceFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Services</h1>
        <button 
          onClick={handleAdd}
          className="bg-[#FF7A00] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#FF7A00]/90 transition-colors"
        >
          + Add Service
        </button>
      </div>
      
      <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white/80">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((service) => (
                <tr key={service._id.toString()}>
                  <td className="p-4 font-medium text-white">{service.title}</td>
                  <td className="p-4 text-sm">{service.category}</td>
                  <td className="p-4 text-sm font-bold text-[#FF7A00]">₹{service.price}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      service.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm flex gap-3">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="text-blue-400 hover:underline transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(service._id)}
                      disabled={isDeleting === service._id}
                      className="text-red-400 hover:underline transition-colors disabled:opacity-50"
                    >
                      {isDeleting === service._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">
                    No services found. Click "+ Add Service" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
