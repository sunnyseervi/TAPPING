'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ShieldAlert, 
  Terminal, 
  Sliders, 
  Save, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SystemSettings } from '@/lib/types';
import { SUPABASE_SQL_SCHEMA, getSupabaseConfig } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { resetAllToDefault } from '@/lib/storage';

interface AdminSettingsTabProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export default function AdminSettingsTab({
  settings,
  onSaveSettings,
}: AdminSettingsTabProps) {
  const { showToast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [announcement, setAnnouncement] = useState(settings.globalAnnouncement);
  const [copiedSql, setCopiedSql] = useState(false);

  const supabaseConfig = getSupabaseConfig();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      maintenanceMode,
      globalAnnouncement: announcement,
    });
    showToast('Platform Settings Saved', 'Configuration active across all user sessions', 'success');
  };

  const handleCopySql = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      showToast('SQL Copied to Clipboard', 'Paste into your Supabase project SQL Editor', 'success');
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('WARNING: Are you sure you want to reset all mock databases to default? This will reload initial users and orders.')) {
      resetAllToDefault();
      showToast('Database Reset', 'Initialized default profiles, cards, and orders', 'info');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF4FF] text-[#4F83FF] border border-[#4F83FF]/20 text-[10px] font-black uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Infrastructure &amp; Database</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
            Backend Architecture &amp; System Configuration
          </h2>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Manage Supabase PostgreSQL database tables, global announcements, and maintenance states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${
            supabaseConfig.isConfigured
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-[#FAF7F2] text-charcoal border-black/10'
          }`}>
            {supabaseConfig.isConfigured ? 'Supabase Connected' : 'Local Storage Cache Active'}
          </span>
        </div>
      </div>

      {/* Supabase Integration Card */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/10 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141518] text-[#B6F554] flex items-center justify-center font-mono font-black text-lg">
              S
            </div>
            <div>
              <h3 className="font-black text-base text-charcoal">Supabase PostgreSQL Database Engine</h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Tables: profiles, links, products, metal_card_orders, payments, analytics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="px-4 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-[#B6F554]" /> : <Copy className="w-3.5 h-3.5 text-[#FDF166]" />}
            <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy Supabase SQL'}</span>
          </button>
        </div>

        {/* Configuration Keys Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-black/5 font-mono">
            <span className="text-[10px] font-bold text-charcoal/50 uppercase block">NEXT_PUBLIC_SUPABASE_URL</span>
            <span className="font-bold text-charcoal block truncate mt-1">
              {supabaseConfig.url || 'https://your-project.supabase.co (Add to .env.local)'}
            </span>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-black/5 font-mono">
            <span className="text-[10px] font-bold text-charcoal/50 uppercase block">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <span className="font-bold text-charcoal block truncate mt-1">
              {supabaseConfig.anonKey || 'eyJhbGciOiJIUzI1NiIsIn... (Add to .env.local)'}
            </span>
          </div>
        </div>

        {/* SQL Schema Preview Box */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-charcoal/70 block mb-2">
            Schema DDL Definition (PostgreSQL / Supabase)
          </span>
          <pre className="p-4 bg-[#141518] text-[#B6F554] rounded-3xl font-mono text-[11px] overflow-x-auto max-h-56 no-scrollbar border border-[#2D3036] leading-relaxed">
            {SUPABASE_SQL_SCHEMA.trim()}
          </pre>
        </div>
      </div>

      {/* Global Platform Controls Form */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-4xl bg-white border border-black/10 shadow-soft space-y-5">
        <h3 className="font-black text-base text-charcoal pb-3 border-b border-black/5">
          Global Platform Controls &amp; Notices
        </h3>

        {/* Maintenance Toggle */}
        <div className="p-4 bg-[#FAF7F2] rounded-3xl border border-black/5 flex items-center justify-between">
          <div>
            <p className="font-black text-xs text-charcoal">Maintenance Mode</p>
            <p className="text-[11px] text-charcoal/60 mt-0.5">
              Temporarily show a maintenance notice to visitors on bio profile links.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
              maintenanceMode ? 'bg-[#4F83FF]' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              maintenanceMode ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Global Announcement */}
        <div>
          <label className="text-xs font-black text-charcoal block mb-1">
            Global Announcement Banner
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Banner message displayed on creator spaces..."
            className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
          />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#FDF166]" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
