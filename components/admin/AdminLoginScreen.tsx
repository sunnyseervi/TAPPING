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
      showToast('Superuser Access Granted', `Welcome to TAPPING Central Control`, 'success');
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
    <div className="min-h-screen bg-[#0F1013] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4F83FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#B6F554]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Chassis Card */}
      <div className="w-full max-w-md bg-[#16181D] rounded-[2.5rem] border border-[#2D3036] p-8 sm:p-10 shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo and Shield Header */}
        <div className="flex flex-col items-center mb-6">
          <TappingLogo size="lg" variant="markOnly" />
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FDF166] text-[10px] font-mono font-black tracking-wider border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FDF166]" />
            <span>ROOT ADMINISTRATOR GATE</span>
          </div>
          <h1 className="text-2xl font-black mt-3 tracking-tight">TAPPING Admin Console</h1>
          <p className="text-xs text-white/60 mt-1 font-medium">
            Central ledger and operations hub for creators, hardware, and payments.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Admin Email */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 block mb-1.5">
              Authorized Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tapping.bio"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0F1013] border border-[#2D3036] text-xs font-mono font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#4F83FF]"
                required
              />
            </div>
          </div>

          {/* Security PIN */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 block mb-1.5">
              Master Security Key / PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin PIN or tapping2026"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0F1013] border border-[#2D3036] text-xs font-mono font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-[#4F83FF]"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <span>Authenticate Superuser</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Autofill Shortcut */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleFillCredentials}
            className="text-[11px] font-mono font-bold text-[#FDF166] hover:underline cursor-pointer"
          >
            Auto-fill Root Credentials (tapping2026)
          </button>
          <p className="text-[10px] text-white/40 font-mono">
            Default superuser: admin@tapping.bio / tapping2026
          </p>
        </div>
      </div>
    </div>
  );
}
