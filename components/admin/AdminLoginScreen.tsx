'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import TappingLogo from '@/components/brand/TappingLogo';
import { useToast } from '@/components/ui/Toast';
import { verifyAdminCredentials, saveAdminSession } from '@/lib/storage';
import { AdminSession } from '@/lib/types';

interface AdminLoginScreenProps {
  onLoginSuccess: (session: AdminSession) => void;
}

export default function AdminLoginScreen({ onLoginSuccess }: AdminLoginScreenProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@tapping.bio');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (verifyAdminCredentials(email, pin)) {
      const session: AdminSession = {
        isAuthenticated: true,
        adminEmail: email.trim().toLowerCase(),
        token: `adm_tok_${Date.now()}`,
        loginTime: new Date().toISOString(),
      };
      saveAdminSession(session);
      showToast('Superuser Access Granted', 'Welcome to Tapping Central Control', 'success');
      onLoginSuccess(session);
    } else {
      showToast('Authentication Failed', 'Invalid administrator email or PIN code', 'error');
    }
    setIsSubmitting(false);
  };

  const handleFillCredentials = () => {
    setEmail('admin@tapping.bio');
    setPin('tapping2026');
    showToast('Credentials Populated', 'Default administrator key set', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal flex flex-col items-center justify-center p-6 select-none">
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-4xl border border-black/10 p-8 sm:p-10 shadow-card text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo and Shield Header */}
        <div className="flex flex-col items-center mb-6">
          <TappingLogo size="lg" />
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-charcoal text-[10px] font-mono font-black tracking-wider border border-black/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>ROOT ADMINISTRATOR GATE</span>
          </div>
          <h1 className="text-2xl font-black mt-3 tracking-tight text-charcoal">Tapping Admin Console</h1>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Central ledger and operations hub for creators, hardware, and payments.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Admin Email */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal/60 block mb-1.5">
              Authorized Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tapping.bio"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-[#4F83FF]/30"
              />
            </div>
          </div>

          {/* Master PIN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal/60">
                Master Security Key / PIN
              </label>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[10px] font-mono font-bold text-[#4F83FF] hover:underline cursor-pointer"
              >
                Autofill Demo PIN
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (e.g. tapping2026)"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-[#4F83FF]/30"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-5 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate Root Session</span>
                <ArrowRight className="w-4 h-4 text-[#FDF166]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-black/5 flex items-center justify-center gap-2 text-[11px] font-mono text-charcoal/40">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Default Key: admin@tapping.bio / tapping2026</span>
        </div>
      </div>
    </div>
  );
}
