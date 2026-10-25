import { VCardProfile } from './types';

export function generateVCardString(vcard: VCardProfile): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vcard.lastName || ''};${vcard.firstName || ''};;;`,
    `FN:${vcard.firstName} ${vcard.lastName || ''}`.trim(),
  ];

  if (vcard.organization) {
    lines.push(`ORG:${vcard.organization}`);
  }

  if (vcard.jobTitle) {
    lines.push(`TITLE:${vcard.jobTitle}`);
  }

  if (vcard.workPhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${vcard.workPhone}`);
  }

  if (vcard.mobilePhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${vcard.mobilePhone}`);
  }

  if (vcard.workEmail) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${vcard.workEmail}`);
  }

  if (vcard.website) {
    lines.push(`URL:${vcard.website}`);
  }

  if (vcard.streetAddress || vcard.city || vcard.country) {
    lines.push(`ADR;TYPE=WORK:;;${vcard.streetAddress || ''};${vcard.city || ''};;;${vcard.country || ''}`);
  }

  if (vcard.note) {
    lines.push(`NOTE:${vcard.note}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export function downloadVCardFile(vcard: VCardProfile, filename = 'contact.vcf') {
  const vcardText = generateVCardString(vcard);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  
  if (typeof window !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 1500);
  }
}
