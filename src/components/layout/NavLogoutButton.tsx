'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export function NavLogoutButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className={className || "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-50 hover:bg-rose-100/90 text-rose-600 hover:text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-xs cursor-pointer h-9.5"}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
        ) : (
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
        )}
        {isLoading ? 'Signing out...' : 'Sign Out'}
      </Button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out Account"
        message="Are you sure you want to sign out of your Sandy Digital Hub account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
}
