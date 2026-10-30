'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { saveStoredProfile, getStoredProfile, getStoredUsers, saveStoredUsers, addStoredUser } from '@/lib/storage';
import { Profile } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import TappingLogo from '@/components/brand/TappingLogo';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (profile: Profile) => void;
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
}: GoogleAuthModalProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const current = getStoredProfile();
      const finalName = current.displayName || current.username || 'Creator';
      const finalEmail = current.socialLinks?.email || `${current.username || 'creator'}@gmail.com`;

      const updated: Profile = {
        ...current,
        displayName: finalName,
        isVerified: true,
        socialLinks: {
          ...current.socialLinks,
          email: finalEmail,
        },
      };
      saveStoredProfile(updated);

      // Register or update in master users registry
      const users = getStoredUsers();
      const existingIdx = users.findIndex(
        (u) => u.username.toLowerCase() === updated.username.toLowerCase() || u.id === updated.id
      );

      if (existingIdx !== -1) {
        users[existingIdx] = {
          ...users[existingIdx],
          displayName: finalName,
          email: finalEmail,
          profile: updated,
          lastActiveAt: new Date().toISOString(),
        };
        saveStoredUsers(users);
      } else {
        addStoredUser({
          id: updated.id,
          username: updated.username,
          displayName: finalName,
          email: finalEmail,
          profile: updated,
        });
      }

      setIsLoading(false);
      showToast('Signed In', `Welcome back, ${finalName}`, 'success');
      onAuthenticated(updated);
      onClose();
    }, 500);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white rounded-4xl p-6 sm:p-8 shadow-card border border-black/10 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/5 text-charcoal/60 hover:text-charcoal transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon */}
        <div className="flex justify-center mb-4">
          <TappingLogo size="md" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#1F2024] tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
          Sign in to manage your bio profile, digital contact card, and NFC products.
        </p>

        {/* Clean Google Login Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl border border-black/15 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-xs font-bold text-charcoal shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
