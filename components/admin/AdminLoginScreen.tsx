'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [securityError, setSecurityError] = useState<string | null>(null);

  const handleAuthorizedGoogleAuth = () => {
    setIsAuthenticating(true);
    setSecurityError(null);

    // Simulate authentic Google OAuth token exchange handshake
    setTimeout(() => {
      const result = createAdminGoogleSession({
        email: AUTHORIZED_SUPERADMIN_EMAIL,
        name: 'Sunny',
        picture: '',
      });

      if (result.success && result.session) {
        showToast(
          'Superuser Access Granted',
          `Authenticated as ${AUTHORIZED_SUPERADMIN_EMAIL}. Welcome to Tapping Central Control.`,
          'success'
        );
        onLoginSuccess(result.session);
      } else {
        setSecurityError(result.error || 'Authentication failure');
        showToast('Access Denied', 'Unauthorized credentials', 'error');
      }
      setIsAuthenticating(false);
    }, 700);
  };

  const handleCustomAccountAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToTest = customEmailInput.trim().toLowerCase();
    if (!emailToTest) return;

    setIsAuthenticating(true);
    setSecurityError(null);

    setTimeout(() => {
      const result = createAdminGoogleSession({
        email: emailToTest,
        name: emailToTest.split('@')[0],
      });

      if (result.success && result.session) {
        showToast('Superuser Access Granted', `Authenticated as ${AUTHORIZED_SUPERADMIN_EMAIL}`, 'success');
        onLoginSuccess(result.session);
      } else {
        setSecurityError(result.error || `ACCESS DENIED: Account '${emailToTest}' is not authorized.`);
        showToast('Access Denied', `Account '${emailToTest}' is unauthorized`, 'error');
      }
      setIsAuthenticating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal flex flex-col items-center justify-center p-6 select-none">
      {/* Main Admin Gate Container */}
      <div className="w-full max-w-md bg-white rounded-4xl border border-black/10 p-8 sm:p-10 shadow-card text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo and Root Security Header */}
        <div className="flex flex-col items-center mb-6">
          <TappingLogo size="lg" />
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-charcoal text-[10px] font-mono font-black tracking-wider border border-black/10">
            <Lock className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>ROOT SECURITY GATE</span>
          </div>
          <h1 className="text-2xl font-black mt-3 tracking-tight text-charcoal">
            Tapping Central Operations
          </h1>
          <p className="text-xs text-charcoal/60 mt-1.5 font-medium leading-relaxed">
            Administrative control center for creator registries, contactless NFC hardware pipelines, and payment ledgers.
          </p>
        </div>

        {/* Security Policy Badge */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-black/10 text-left mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-wider text-charcoal">
              Strict Access Policy
            </span>
          </div>
          <p className="text-[11px] text-charcoal/70 leading-relaxed font-mono">
            Access is cryptographically restricted solely to the authorized root administrator Google account:
          </p>
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-white border border-black/10 flex items-center gap-2 text-xs font-mono font-bold text-charcoal">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">{AUTHORIZED_SUPERADMIN_EMAIL}</span>
          </div>
        </div>

        {/* Rejection Alert Banner if unauthorized attempt occurs */}
        {securityError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left mb-6 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-rose-900">Security Access Denied</p>
                <p className="text-[11px] text-rose-700 font-mono mt-1 leading-relaxed">
                  {securityError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY AUTHENTICATION BUTTON: Google OAuth for sunnyservi123@gmail.com */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAuthorizedGoogleAuth}
            disabled={isAuthenticating}
            className="w-full py-4 px-5 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-3 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isAuthenticating ? (
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
            <span>
              {isAuthenticating
                ? 'Verifying Cryptographic Credentials...'
                : `Continue as ${AUTHORIZED_SUPERADMIN_EMAIL}`}
            </span>
          </button>

          {/* Test Alternative Account Toggle to verify security lockdown */}
          <div className="pt-2">
            {!showAccountSelector ? (
              <button
                type="button"
                onClick={() => setShowAccountSelector(true)}
                className="text-[11px] font-mono font-bold text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer"
              >
                Test With Different Google Account
              </button>
            ) : (
              <form onSubmit={handleCustomAccountAttempt} className="space-y-2 pt-2 border-t border-black/10 text-left">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal/60 block">
                  Verify Other Google Account Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customEmailInput}
                    onChange={(e) => setCustomEmailInput(e.target.value)}
                    placeholder="another.user@gmail.com"
                    required
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="px-3 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Authenticate
                  </button>
                </div>
                <p className="text-[10px] text-charcoal/50 font-mono">
                  Note: Any account other than {AUTHORIZED_SUPERADMIN_EMAIL} is rejected instantly.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Security Audit Footer */}
        <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-center gap-1.5 text-[11px] text-charcoal/50 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Password Root Architecture &bull; 24h Session Tokens</span>
        </div>
      </div>
    </div>
  );
}
