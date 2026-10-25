'use client';

import React, { useState } from 'react';
import { VCardProfile } from '@/lib/types';
import { Download, Check, UserCheck, Phone, Mail, Building, MapPin, Globe, FileText } from 'lucide-react';
import { downloadVCardFile } from '@/lib/vcard';
import { useToast } from '@/components/ui/Toast';

interface VCardEditorProps {
  vcard: VCardProfile;
  onUpdateVCard: (updated: VCardProfile) => void;
}

export default function VCardEditor({ vcard, onUpdateVCard }: VCardEditorProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<VCardProfile>(vcard);

  const handleChange = (field: keyof VCardProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateVCard(formData);
    showToast('Contact Card Saved!', 'Your vCard 3.0 identity is updated', 'success');
  };

  const handleTestDownload = () => {
    downloadVCardFile(formData, `${formData.firstName.toLowerCase()}_contact.vcf`);
    showToast('vCard Downloaded!', 'Testing phonebook contact import', 'info');
  };

  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pastel-lavender flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-charcoal" />
            </div>
            <h2 className="text-lg font-extrabold text-charcoal">Digital Business Card & vCard</h2>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            1-tap export to Apple Contacts & Google Contacts when people tap your card
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestDownload}
            className="px-3.5 py-2 rounded-full bg-pastel-lavender hover:bg-pastel-lavender-border text-charcoal text-xs font-semibold flex items-center gap-1.5 border border-pastel-lavender-border transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Test .vcf Download</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Card</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-charcoal-muted" /> First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-charcoal-muted" /> Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <Building className="w-3.5 h-3.5 text-charcoal-muted" /> Company / Organization
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <Building className="w-3.5 h-3.5 text-charcoal-muted" /> Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <Phone className="w-3.5 h-3.5 text-charcoal-muted" /> Mobile Phone
          </label>
          <input
            type="text"
            value={formData.mobilePhone}
            onChange={(e) => handleChange('mobilePhone', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <Mail className="w-3.5 h-3.5 text-charcoal-muted" /> Work Email
          </label>
          <input
            type="email"
            value={formData.workEmail}
            onChange={(e) => handleChange('workEmail', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <Globe className="w-3.5 h-3.5 text-charcoal-muted" /> Profile or Website
          </label>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-charcoal-muted" /> Location / Address
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5 text-charcoal-muted" /> Card Note (appears in contact info)
          </label>
          <textarea
            rows={2}
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-black/10 focus:outline-none focus:border-black font-medium resize-none"
          />
        </div>
      </div>
    </div>
  );
}
