'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VCardProfile } from '@/lib/types';
import { 
  UserCheck, 
  QrCode, 
  Download, 
  Check, 
  Copy, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Globe, 
  FileText, 
  Save 
} from 'lucide-react';
import { downloadVCardFile } from '@/lib/vcard';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/Toast';

interface DigitalCardStudioProps {
  vcard: VCardProfile;
  username: string;
  onUpdateVCard: (updated: VCardProfile) => void;
}

export default function DigitalCardStudio({
  vcard,
  username,
  onUpdateVCard,
}: DigitalCardStudioProps) {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<'vcard' | 'qr'>('vcard');
  const [formData, setFormData] = useState<VCardProfile>(vcard);

  // QR state
  const [qrColor, setQrColor] = useState('#1F2024');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const targetUrl = origin ? `${origin}/${username}` : `https://tapping.bio/${username}`;

  useEffect(() => {
    generateQRCode();
  }, [username, qrColor, bgColor, activeSection, targetUrl]);

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

  const handleChange = (field: keyof VCardProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveVCard = () => {
    onUpdateVCard(formData);
    showToast('Contact Card Saved', 'Your vCard 3.0 identity is updated', 'success');
  };

  const handleTestDownloadVCard = () => {
    downloadVCardFile(formData, `${formData.firstName.toLowerCase() || username}_contact.vcf`);
    showToast('vCard Downloaded', 'Importing contact card to smartphone phonebook', 'info');
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
    { name: 'Charcoal', hex: '#141518' },
    { name: 'Cobalt', hex: '#4F83FF' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Amber', hex: '#EAB308' },
    { name: 'Crimson', hex: '#EA4335' },
  ];

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
      {/* Header with Segmented Navigation Pill */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
            Check Your
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
            Digital Space
          </h2>
          <p className="text-xs text-charcoal/60 mt-2 font-medium">
            Contactless smartphone phonebook import via vCard 3.0 and permanent vector QR code
          </p>
        </div>

        {/* Tab Switcher: vCard vs QR Studio */}
        <div className="flex items-center bg-[#FAF7F2] p-1.5 rounded-2xl border border-black/5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveSection('vcard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeSection === 'vcard'
                ? 'bg-[#141518] text-white shadow-xs'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>vCard Details</span>
          </button>
          <button
            onClick={() => setActiveSection('qr')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeSection === 'qr'
                ? 'bg-[#141518] text-white shadow-xs'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Permanent QR</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: VCARD DETAILS */}
      {activeSection === 'vcard' && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-charcoal/60 uppercase tracking-wider">
              Smartphone Address Book Fields (RFC 2426 vCard 3.0)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestDownloadVCard}
                className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-white text-charcoal text-xs font-bold flex items-center gap-1.5 border border-black/10 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Test .vcf Download</span>
              </button>
              <button
                onClick={handleSaveVCard}
                className="px-5 py-2 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Card</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-charcoal/50" /> First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-charcoal/50" /> Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-charcoal/50" /> Company / Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-charcoal/50" /> Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-charcoal/50" /> Mobile Phone
              </label>
              <input
                type="tel"
                value={formData.mobilePhone}
                onChange={(e) => handleChange('mobilePhone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-charcoal/50" /> Work Email
              </label>
              <input
                type="email"
                value={formData.workEmail}
                onChange={(e) => handleChange('workEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-charcoal/50" /> Profile or Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-charcoal/50" /> Location / Address
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-charcoal/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-charcoal/50" /> Card Note (appears in contact info)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-medium resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PERMANENT DYNAMIC QR STUDIO */}
      {activeSection === 'qr' && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Vector QR Preview Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-black/5 flex flex-col items-center justify-center relative">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#B6F554] text-charcoal border border-black/10 mb-4">
              PERMANENT DYNAMIC QR
            </span>

            <div className="p-4 bg-white rounded-2xl border border-black/10 shadow-xs relative">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 rounded-lg object-contain" />
              ) : (
                <canvas ref={canvasRef} className="rounded-lg w-56 h-56" />
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-[#1F2024] text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                  T
                </div>
              </div>
            </div>

            <p className="text-[11px] text-charcoal/60 font-mono mt-3">
              tapping.bio/{username}
            </p>
          </div>

          {/* Right: Color customization & Downloads */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-charcoal/80 uppercase tracking-wider block mb-2">
                QR Foreground Color
              </label>
              <div className="flex items-center gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setQrColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-9 h-9 rounded-full transition-transform flex items-center justify-center ${
                      qrColor === color.hex ? 'ring-2 ring-offset-2 ring-charcoal scale-110 shadow-xs' : 'hover:scale-105'
                    }`}
                  >
                    {qrColor === color.hex && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-black/5">
              <p className="text-xs font-black text-charcoal">Dynamic Redirection Guarantee</p>
              <p className="text-[11px] text-charcoal/70 mt-1 leading-relaxed">
                Print this QR code on physical business cards, merchandise, menus, or event badges. Even if you update your bio or change phone numbers, this QR code will always route to your latest live page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={copyURL}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 border border-black/10 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL' : 'Copy Link'}</span>
              </button>

              <button
                onClick={downloadPNG}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}