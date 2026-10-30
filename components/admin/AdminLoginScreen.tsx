'use client';

import React, { useState } from 'react';
import TappingLogo from '@/components/brand/TappingLogo';
import { useToast } from '@/components/ui/Toast';
import { 
  AUTHORIZED_SUPERADMIN_EMAIL, 
  createAdminGoogleSession 
} from '@/lib/storage';
import { AdminSession } from '@/lib/types';

interface AdminLoginScreenProps {
  onLoginSuccess: (session: AdminSession) => void;
}

export default function AdminLoginScreen({ onLoginSuccess }: AdminLoginScreenProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      // In production Google OAuth, this authenticates via the user's active Google session
      const result = createAdminGoogleSession({
        email: AUTHORIZED_SUPERADMIN_EMAIL,
        name: 'Admin',
      });

      if (result.success && result.session) {
        showToast('Signed In', 'Welcome back', 'success');
        onLoginSuccess(result.session);
      } else {
        setErrorMessage('Access denied. You do not have administrator permissions.');
        showToast('Access Denied', 'Unauthorized account', 'error');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm bg-white rounded-4xl border border-black/10 p-8 shadow-card text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <TappingLogo size="lg" />
          <h1 className="text-2xl font-black mt-4 tracking-tight text-charcoal">
            Admin Sign In
          </h1>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Sign in with your authorized Google account to continue.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-left">
            <p className="text-xs font-bold text-rose-800">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-3 shadow-md shadow-[#4F83FF]/20 transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>

      </div>
    </div>
  );
}
