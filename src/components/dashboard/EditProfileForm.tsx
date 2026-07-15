'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, X, Check } from 'lucide-react';

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    mobile: string;
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState(user.mobile || '');

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
        setIsLoading(false);
        return;
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setIsLoading(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setMobile(user.mobile || '');
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <>
        <div className="text-white/80">
          <p><span className="text-white/50">Email:</span> {user.email}</p>
          <p><span className="text-white/50">Mobile:</span> {user.mobile || 'Not set'}</p>
        </div>
        {success && (
          <p className="text-green-400 text-sm mt-2">{success}</p>
        )}
        <button
          onClick={() => { setIsEditing(true); setSuccess(''); }}
          className="text-[#FF7A00] text-left mt-4 hover:underline flex items-center gap-2 cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
      )}
      <div>
        <label className="text-white/50 text-sm block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF7A00]/50"
        />
      </div>
      <div>
        <label className="text-white/50 text-sm block mb-1">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/40 text-sm cursor-not-allowed"
        />
      </div>
      <div>
        <label className="text-white/50 text-sm block mb-1">Mobile</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF7A00]/50"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-[#FF7A00] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF7A00]/80 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 cursor-pointer"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
