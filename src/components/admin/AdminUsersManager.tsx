"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: 'PROMOTE' | 'DEMOTE' | 'SUSPEND' | 'ACTIVATE';
    title: string;
    message: string;
    confirmText: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
      </div>
      
      <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white/80">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id.toString()}>
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm">{user.mobile}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.status === 'SUSPENDED' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-sm flex flex-wrap gap-3">
                    {user.role === 'CUSTOMER' ? (
                      <button 
                        onClick={() => setConfirmAction({
                          id: user._id,
                          type: 'PROMOTE',
                          title: 'Promote to Admin',
                          message: `Are you sure you want to promote ${user.name} to Admin? They will have full access to manage services and other users.`,
                          confirmText: 'Promote'
                        })}
                        className="text-purple-400 hover:underline transition-colors"
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
                        className="text-gray-400 hover:underline transition-colors"
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
                        className="text-red-400 hover:underline transition-colors"
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
                        className="text-green-400 hover:underline transition-colors"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
