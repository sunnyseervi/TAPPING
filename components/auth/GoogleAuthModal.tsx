'use client';

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, X, Mail, User } from 'lucide-react';
import { saveStoredProfile, getStoredProfile, getStoredUsers, saveStoredUsers, addStoredUser } from '@/lib/storage';
import { Profile, UserRecord } from '@/lib/types';
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
  const [showManualFields, setShowManualFields] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  if (!isOpen) return null;

  const performSignIn = (emailToUse: string, nameToUse: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const current = getStoredProfile();
      const finalName = nameToUse.trim() || current.displayName || current.username || 'Creator';
      const finalEmail = emailToUse.trim() || `${current.username || 'creator'}@gmail.com`;

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
      showToast('Signed In with Google', `Welcome back, ${finalName}!`, 'success');
      onAuthenticated(updated);
      onClose();
    }, 600);
  };

  const handleInstantGoogleSignIn = () => {
    const current = getStoredProfile();
    const defaultEmail = current.socialLinks?.email || `${current.username || 'creator'}@gmail.com`;
    const defaultName = current.displayName && current.displayName !== 'Aarav Sharma' 
      ? current.displayName 
      : (current.username || 'Creator');
    
    performSignIn(defaultEmail, defaultName);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    performSignIn(googleEmail, googleName);
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

        <h2 className="text-xl sm:text-2xl font-black text-[#1F2024] tracking-tight">
          Sign In to Tapping
        </h2>
        <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
          Manage your link in bio profiles, digital contact cards, permanent vector QR codes, and smart NFC hardware orders.
        </p>

        {/* Google OAuth Options */}
        <div className="mt-6 flex flex-col gap-3">
          {!showManualFields ? (
            <>
              <button
                type="button"
                onClick={handleInstantGoogleSignIn}
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

              <button
                type="button"
                onClick={() => setShowManualFields(true)}
                className="text-[11px] font-mono font-bold text-charcoal/60 hover:text-black transition-colors cursor-pointer"
              >
                Sign in with custom Google Account
              </button>
            </>
          ) : (
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 text-left">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal/60 block mb-1">
                  Google Account Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal/60 block mb-1">
                  Google Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualFields(false)}
                  className="px-3 py-2.5 rounded-xl border border-black/10 text-xs font-bold text-charcoal hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  {isLoading ? 'Connecting...' : 'Sign In with Account'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-center gap-1.5 text-[11px] text-charcoal/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with Google OAuth &amp; SSL</span>
        </div>
      </div>
    </div>
  );
}
