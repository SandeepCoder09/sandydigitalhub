'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Check, Loader2 } from 'lucide-react';

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    mobile?: string;
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-xl text-xs sm:text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {!isEditing ? (
        <div className="text-gray-700 space-y-2">
          <p><span className="text-gray-400">Email:</span> {user.email}</p>
          <p><span className="text-gray-400">Mobile:</span> {user.mobile || 'Not set'}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-100 text-[#2563EB] font-bold text-xs hover:bg-blue-200 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-gray-500 text-xs font-semibold block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs font-semibold block mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs font-semibold block mb-1">Mobile</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +91 8756454282"
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-[#2563EB] text-gray-800 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#2563EB]/90 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
