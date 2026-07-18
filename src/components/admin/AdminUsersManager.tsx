"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { User as UserIcon, Mail, Phone, Shield, ShieldAlert, Search } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
};

type Props = {
  initialUsers: User[];
};

export function AdminUsersManager({ initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: 'PROMOTE' | 'DEMOTE' | 'SUSPEND' | 'ACTIVATE';
    title: string;
    message: string;
    confirmText: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.mobile || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (roleFilter === 'CUSTOMERS') return u.role === 'CUSTOMER';
    if (roleFilter === 'ADMINS') return u.role === 'ADMIN';

    return true;
  });

  const executeAction = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);

    try {
      let updateData = {};
      if (confirmAction.type === 'PROMOTE') updateData = { role: 'ADMIN' };
      if (confirmAction.type === 'DEMOTE') updateData = { role: 'CUSTOMER' };
      if (confirmAction.type === 'SUSPEND') updateData = { status: 'SUSPENDED' };
      if (confirmAction.type === 'ACTIVATE') updateData = { status: 'ACTIVE' };

      const res = await fetch(`/api/admin/users/${confirmAction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(users.map(u => u._id === confirmAction.id ? { ...u, ...data.user } : u));
        setConfirmAction(null);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("An error occurred while updating the user.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Users</h1>
      </div>

      {/* Search Bar & Role Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF7A00]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search User Name, Mobile, Email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#FF7A00] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: `All Users (${users.length})` },
            { id: 'CUSTOMERS', label: `Customers (${users.filter(u => u.role === 'CUSTOMER').length})` },
            { id: 'ADMINS', label: `Admins (${users.filter(u => u.role === 'ADMIN').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                roleFilter === tab.id
                  ? 'bg-[#FF7A00] text-white shadow-md font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-[#111111] p-8 rounded-2xl border border-white/10 text-center text-white/50">
          No users match your search criteria.
        </div>
      ) : (
        <>
          {/* Mobile User Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user._id.toString()} className="bg-[#111111] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {user.name ? user.name.slice(0, 2) : 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{user.name}</h3>
                      <div className="text-[11px] text-white/50 flex items-center gap-1">
                        <Mail size={11} />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {user.role}
                  </span>
                </div>

                {user.mobile && (
                  <div className="text-xs text-white/60 flex items-center gap-1.5 pl-1">
                    <Phone size={12} className="text-[#FF7A00]" />
                    <span>{user.mobile}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    user.status === 'SUSPENDED' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {user.status || 'ACTIVE'}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {user.role === 'CUSTOMER' ? (
                      <button 
                        onClick={() => setConfirmAction({
                          id: user._id,
                          type: 'PROMOTE',
                          title: 'Promote to Admin',
                          message: `Are you sure you want to promote ${user.name} to Admin?`,
                          confirmText: 'Promote'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                      >
                        Promote
                      </button>
                    ) : (
                      <button 
                        onClick={() => setConfirmAction({
                          id: user._id,
                          type: 'DEMOTE',
                          title: 'Demote to User',
                          message: `Are you sure you want to demote ${user.name} to a regular User?`,
                          confirmText: 'Demote'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30 transition-colors"
                      >
                        Demote
                      </button>
                    )}

                    {(user.status === 'ACTIVE' || !user.status) ? (
                      <button 
                        onClick={() => setConfirmAction({
                          id: user._id,
                          type: 'SUSPEND',
                          title: 'Suspend User',
                          message: `Are you sure you want to suspend ${user.name}?`,
                          confirmText: 'Suspend'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        onClick={() => setConfirmAction({
                          id: user._id,
                          type: 'ACTIVATE',
                          title: 'Activate User',
                          message: `Are you sure you want to activate ${user.name}'s account?`,
                          confirmText: 'Activate'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
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
          <div className="hidden md:block bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-white/50 font-semibold">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredUsers.map((user) => (
                    <tr key={user._id.toString()} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-medium text-white">{user.name}</td>
                      <td className="p-4 text-white/70">{user.email}</td>
                      <td className="p-4 text-white/70">{user.mobile || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.status === 'SUSPENDED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {user.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 flex flex-wrap gap-3">
                        {user.role === 'CUSTOMER' ? (
                          <button 
                            onClick={() => setConfirmAction({
                              id: user._id,
                              type: 'PROMOTE',
                              title: 'Promote to Admin',
                              message: `Are you sure you want to promote ${user.name} to Admin? They will have full access to manage services and other users.`,
                              confirmText: 'Promote'
                            })}
                            className="text-purple-400 hover:underline transition-colors font-medium"
                          >
                            Promote to Admin
                          </button>
                        ) : (
                          <button 
                            onClick={() => setConfirmAction({
                              id: user._id,
                              type: 'DEMOTE',
                              title: 'Demote to User',
                              message: `Are you sure you want to demote ${user.name} to a regular User? They will lose access to the admin dashboard.`,
                              confirmText: 'Demote'
                            })}
                            className="text-gray-400 hover:underline transition-colors font-medium"
                          >
                            Demote to User
                          </button>
                        )}

                        {(user.status === 'ACTIVE' || !user.status) ? (
                          <button 
                            onClick={() => setConfirmAction({
                              id: user._id,
                              type: 'SUSPEND',
                              title: 'Suspend User',
                              message: `Are you sure you want to suspend ${user.name}? They will no longer be able to log in.`,
                              confirmText: 'Suspend'
                            })}
                            className="text-red-400 hover:underline transition-colors font-medium"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button 
                            onClick={() => setConfirmAction({
                              id: user._id,
                              type: 'ACTIVATE',
                              title: 'Activate User',
                              message: `Are you sure you want to activate ${user.name}'s account? They will regain access to log in.`,
                              confirmText: 'Activate'
                            })}
                            className="text-green-400 hover:underline transition-colors font-medium"
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

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeAction}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
        confirmText={confirmAction?.confirmText}
        isLoading={isProcessing}
      />
    </>
  );
}
