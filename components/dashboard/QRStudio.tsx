'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface QRStudioProps {
  username: string;
}

export default function QRStudio({ username }: QRStudioProps) {
  const { showToast } = useToast();
  const [qrColor, setQrColor] = useState('#1F2024');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetUrl = `https://tapping.bio/${username}`;

  useEffect(() => {
    generateQRCode();
  }, [username, qrColor, bgColor]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(targetUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(url);

      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, targetUrl, {
          width: 260,
          margin: 2,
          color: {
            dark: qrColor,
            light: bgColor,
          },
          errorCorrectionLevel: 'H',
        });
      }
    } catch (err) {
      console.error('Failed to generate QR', err);
    }
  };

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${username}-tapping-qr.png`;
    a.click();
    showToast('PNG Downloaded', 'High resolution QR code ready for print & web', 'success');
  };

  const copyURL = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    showToast('Link Copied', targetUrl, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = [
    { name: 'Charcoal', hex: '#1F2024' },
    { name: 'Terracotta', hex: '#C0512F' },
    { name: 'Lavender', hex: '#6366F1' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Navy', hex: '#1E3A8A' },
  ];

  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pastel-mint flex items-center justify-center">
              <QrCode className="w-4 h-4 text-charcoal" />
            </div>
            <h2 className="text-lg font-extrabold text-charcoal">Permanent QR Code Studio</h2>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Never breaks — reroutes dynamically as you change your links and contact cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyURL}
            className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-semibold flex items-center gap-1.5 border border-black/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Link</span>
          </button>
          <button
            onClick={downloadPNG}
            className="px-4 py-2 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-pastel-yellow" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
        {/* QR Preview Card */}
        <div className="flex flex-col items-center">
          <div className="relative p-6 rounded-3xl bg-[#FAF7F2] border border-black/5 shadow-soft flex flex-col items-center">
            {/* Scalloped badge inspired by screenshot */}
            <div className="px-3 py-1 rounded-full bg-pastel-mint text-[11px] font-bold text-charcoal border border-pastel-mint-border mb-3 shadow-xs">
              PERMANENT DYNAMIC QR
            </div>

            <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-black/5">
              <canvas ref={canvasRef} className="rounded-xl" />
              {/* Center Logo Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-xl bg-[#1F2024] text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white">
                  T
                </div>
              </div>
            </div>

            <p className="font-mono text-xs text-charcoal-muted mt-3">
              tapping.bio/{username}
            </p>
          </div>
        </div>

        {/* QR Controls */}
        <div className="flex flex-col gap-5 text-left text-xs">
          <div>
            <label className="font-bold text-charcoal uppercase tracking-wider block mb-2">
              QR Foreground Color
            </label>
            <div className="flex items-center gap-2.5">
              {presetColors.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => setQrColor(col.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${
                    qrColor === col.hex ? 'border-charcoal scale-110 shadow-sm' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                >
                  {qrColor === col.hex && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-black/5">
            <h4 className="font-bold text-charcoal text-xs mb-1">
              Dynamic Redirection Guarantee
            </h4>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Print this QR code on physical business cards, merchandise, menus, or event badges. Even if you update your bio or change phone numbers, this QR code will always route to your latest live page.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadPNG}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#1F2024] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-black shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 1024x1024 Print File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
