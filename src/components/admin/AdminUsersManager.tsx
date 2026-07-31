"use client";

import { useState } from "react";
type UserRole = "ADMIN" | "CUSTOMER";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ShieldCheck, UserCheck, ShieldAlert, UserX, Search, Mail, Phone, Calendar } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type UserType = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  status?: "ACTIVE" | "SUSPENDED";
  createdAt?: string;
};

type Props = {
  initialUsers: UserType[];
};

export function AdminUsersManager({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirm Modal state
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "PROMOTE" | "DEMOTE" | "SUSPEND" | "ACTIVATE";
    title: string;
    message: string;
    confirmText: string;
  } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        setConfirmAction(null);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating user role");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: "ACTIVE" | "SUSPENDED") => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u)));
        setConfirmAction(null);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating user status");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeConfirmAction = () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;

    if (type === "PROMOTE") handleUpdateRole(id, "ADMIN");
    if (type === "DEMOTE") handleUpdateRole(id, "CUSTOMER");
    if (type === "SUSPEND") handleUpdateStatus(id, "SUSPENDED");
    if (type === "ACTIVATE") handleUpdateStatus(id, "ACTIVE");
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.mobile && user.mobile.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (roleFilter === "CUSTOMERS") return user.role === "CUSTOMER";
    if (roleFilter === "ADMINS") return user.role === "ADMIN";

    return true;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h1>
      </div>

      {/* Search Bar & Role Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4500]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search User Name, Mobile, Email..."
            className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#FF4500] outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: "ALL", label: `All Users (${users.length})` },
            { id: "CUSTOMERS", label: `Customers (${users.filter((u) => u.role === "CUSTOMER").length})` },
            { id: "ADMINS", label: `Admins (${users.filter((u) => u.role === "ADMIN").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                roleFilter === tab.id
                  ? "bg-[#FF4500] text-white shadow-md font-bold"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 shadow-sm">
          No users match your search criteria.
        </div>
      ) : (
        <>
          {/* Mobile User Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user._id.toString()} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF4500] flex items-center justify-center font-bold text-xs uppercase">
                      {user.name ? user.name.slice(0, 2) : "U"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Mail size={11} />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === "SUSPENDED"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {user.status || "ACTIVE"}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {user.role === "CUSTOMER" ? (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            id: user._id,
                            type: "PROMOTE",
                            title: "Promote to Admin",
                            message: `Are you sure you want to promote ${user.name} to Admin?`,
                            confirmText: "Promote",
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 transition-colors"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            id: user._id,
                            type: "DEMOTE",
                            title: "Demote to User",
                            message: `Are you sure you want to demote ${user.name} to a regular User?`,
                            confirmText: "Demote",
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors"
                      >
                        Demote
                      </button>
                    )}

                    {user.status === "ACTIVE" || !user.status ? (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            id: user._id,
                            type: "SUSPEND",
                            title: "Suspend User",
                            message: `Are you sure you want to suspend ${user.name}? They will be blocked from accessing service requests.`,
                            confirmText: "Suspend",
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            id: user._id,
                            type: "ACTIVATE",
                            title: "Activate User",
                            message: `Re-activate ${user.name}'s account?`,
                            confirmText: "Activate",
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop User Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-800">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{user.name}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">{user.mobile || "N/A"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.status === "SUSPENDED"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {user.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="p-4 flex flex-wrap gap-3">
                        {user.role === "CUSTOMER" ? (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: user._id,
                                type: "PROMOTE",
                                title: "Promote to Admin",
                                message: `Are you sure you want to promote ${user.name} to Admin?`,
                                confirmText: "Promote",
                              })
                            }
                            className="text-purple-600 hover:underline transition-colors font-semibold"
                          >
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: user._id,
                                type: "DEMOTE",
                                title: "Demote to User",
                                message: `Are you sure you want to demote ${user.name} to a regular User?`,
                                confirmText: "Demote",
                              })
                            }
                            className="text-gray-500 hover:underline transition-colors font-semibold"
                          >
                            Demote
                          </button>
                        )}

                        {user.status === "ACTIVE" || !user.status ? (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: user._id,
                                type: "SUSPEND",
                                title: "Suspend User",
                                message: `Are you sure you want to suspend ${user.name}? They will be blocked from placing orders.`,
                                confirmText: "Suspend",
                              })
                            }
                            className="text-red-600 hover:underline transition-colors font-semibold"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                id: user._id,
                                type: "ACTIVATE",
                                title: "Activate User",
                                message: `Re-activate ${user.name}'s account?`,
                                confirmText: "Activate",
                              })
                            }
                            className="text-green-600 hover:underline transition-colors font-semibold"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmModal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={executeConfirmAction}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmText={confirmAction.confirmText}
          isLoading={isProcessing}
        />
      )}
    </>
  );
}
