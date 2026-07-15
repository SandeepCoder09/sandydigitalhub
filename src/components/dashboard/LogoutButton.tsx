'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-red-400 text-left mt-2 hover:underline flex items-center gap-2 disabled:opacity-50 cursor-pointer"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </button>
  );
}
