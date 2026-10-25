'use client';

import React from 'react';
import { AlertTriangle, Check, X, ShieldAlert, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm & Apply',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <ShieldAlert className="w-6 h-6 text-rose-600 stroke-[2.4]" />,
          iconBg: 'bg-rose-50 border border-rose-200',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 stroke-[2.4]" />,
          iconBg: 'bg-amber-50 border border-amber-200',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'success':
        return {
          icon: <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />,
          iconBg: 'bg-emerald-50 border border-emerald-200',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-[#4F83FF] stroke-[2.4]" />,
          iconBg: 'bg-[#EFF4FF] border border-[#4F83FF]/20',
          btnBg: 'bg-[#141518] hover:bg-black text-white',
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-4xl p-6 sm:p-7 max-w-md w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${vStyles.iconBg}`}>
              {vStyles.icon}
            </div>
            <div>
              <h3 className="text-base font-black text-charcoal">{title}</h3>
              <p className="text-[11px] font-bold text-charcoal/50">Confirmation required</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-black/5 text-charcoal/50 hover:text-charcoal cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-charcoal/70 leading-relaxed font-medium">
          {description}
        </p>

        <div className="flex gap-2.5 pt-2 border-t border-black/5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-black/5 text-xs font-bold text-charcoal border border-black/10 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black shadow-xs transition-transform active:scale-95 cursor-pointer ${vStyles.btnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
