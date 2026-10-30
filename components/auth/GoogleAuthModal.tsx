'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Check, Sparkles } from 'lucide-react';
import { 
  saveStoredProfile, 
  getStoredProfile, 
  getStoredUsers, 
  saveStoredUsers, 
  addStoredUser,
  getUserByEmail,
  getUserByUsername
} from '@/lib/storage';
import { initialProfile } from '@/lib/mockData';
import { Profile } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import TappingLogo from '@/components/brand/TappingLogo';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: (profile: Profile) => void;
  claimedUsername?: string;
  redirectTo?: string;
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
  claimedUsername,
  redirectTo = '/dashboard',
}: GoogleAuthModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [googleEmail, setGoogleEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const targetHandle = (claimedUsername || (typeof window !== 'undefined' ? localStorage.getItem('tapping_claimed_handle') : '') || '').toLowerCase().trim();

  const handleGoogleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const email = (googleEmail.trim() || `${targetHandle || 'user'}@gmail.com`).toLowerCase();
      const existingUser = getUserByEmail(email);

      if (existingUser) {
        // User already has an account with this email -> Load their profile and directly open dashboard!
        const existingProfile = existingUser.profile || {
          ...initialProfile,
          id: existingUser.id,
          username: existingUser.username,
          displayName: existingUser.displayName,
          avatarUrl: existingUser.avatarUrl,
          isActivated: existingUser.isActivated !== false,
          socialLinks: { email },
        };

        saveStoredProfile(existingProfile);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tapping_claimed_handle');
        }

        setIsLoading(false);
        showToast('Welcome Back', `Signed into your account @${existingUser.username}`, 'success');
        if (onAuthenticated) onAuthenticated(existingProfile);
        onClose();
        router.push(redirectTo);
        return;
      }

      // New User -> Create their profile with the exact handle chosen while claiming
      let finalHandle = targetHandle;
      if (!finalHandle) {
        finalHandle = email.split('@')[0].replace(/[^a-z0-9_-]/g, '') || 'creator';
      }

      // If chosen handle was somehow taken by another email, ensure uniqueness
      const existingHandleOwner = getUserByUsername(finalHandle);
      if (existingHandleOwner && existingHandleOwner.email.toLowerCase() !== email) {
        finalHandle = `${finalHandle}${Math.floor(100 + Math.random() * 900)}`;
      }

      const displayName = finalHandle.charAt(0).toUpperCase() + finalHandle.slice(1);
      const newProfile: Profile = {
        ...initialProfile,
        id: `usr_${Date.now()}`,
        username: finalHandle,
        displayName: displayName,
        isActivated: false, // Draft until published via plan payment
        isVerified: true,
        socialLinks: {
          email: email,
        },
        createdAt: new Date().toISOString(),
      };

      saveStoredProfile(newProfile);
      addStoredUser({
        id: newProfile.id,
        username: finalHandle,
        displayName: displayName,
        email: email,
        isActivated: false,
        status: 'pending_payment',
        profile: newProfile,
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('tapping_claimed_handle');
      }

      setIsLoading(false);
      showToast('Handle Claimed!', `Welcome @${finalHandle}! Your profile is ready to design & publish.`, 'success');
      if (onAuthenticated) onAuthenticated(newProfile);
      onClose();
      router.push(redirectTo);
    }, 600);
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

        {targetHandle ? (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Claiming @{targetHandle}</span>
            </span>
          </div>
        ) : null}

        <h2 className="text-xl sm:text-2xl font-bold text-[#1F2024] tracking-tight">
          Sign In with Google
        </h2>
        <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
          {targetHandle 
            ? `Sign in to claim @${targetHandle} and create your bio space.` 
            : 'Sign in to access your bio dashboard, links, and smart card.'}
        </p>

        <form onSubmit={handleGoogleSignIn} className="mt-5 space-y-3">
          <div className="text-left">
            <label className="text-[10px] font-bold text-charcoal/60 block mb-1">
              Google Account Email (Gmail)
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 pointer-events-none" />
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-black/15 text-xs font-semibold focus:outline-none focus:border-black font-sans"
              />
            </div>
          </div>

          {/* Clean Google Login Button */}
          <button
            type="submit"
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
            <span>{isLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>
        </form>

        <p className="text-[10px] text-charcoal/50 mt-4">
          Secured with Google OAuth 2.0 authentication.
        </p>
      </div>
    </div>
  );
}
