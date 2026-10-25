import { jsPDF } from 'jspdf';
import QRCodeGenerator from 'qrcode';
import { NFCCardDesign, CardMaterial } from './types';

export async function exportCardAsPng(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back',
  username: string,
  host: string = 'tapping.bio'
): Promise<void> {
  const width = 1024;
  const height = 648;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cfg = side === 'front' ? card.frontSide : card.backSide;
  const isBack = side === 'back';

  // 1. Draw Card Material Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (material === 'matte_black') {
    gradient.addColorStop(0, '#1E2024');
    gradient.addColorStop(0.5, '#141518');
    gradient.addColorStop(1, '#0C0D0F');
  } else if (material === 'brushed_gold') {
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.5, '#C8A44D');
    gradient.addColorStop(1, '#997D2E');
  } else if (material === 'rose_gold') {
    gradient.addColorStop(0, '#D99B9B');
    gradient.addColorStop(0.5, '#C98A94');
    gradient.addColorStop(1, '#A86C76');
  } else {
    // titanium silver
    gradient.addColorStop(0, '#EAECEF');
    gradient.addColorStop(0.5, '#D5D8DF');
    gradient.addColorStop(1, '#B0B4BC');
  }

  // Rounded Card Body
  const radius = 48;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, radius);
  ctx.fill();

  // Subtle metallic chamfer border
  ctx.lineWidth = 4;
  ctx.strokeStyle = material === 'matte_black' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)';
  ctx.stroke();

  const textColor = material === 'matte_black' ? '#FFFFFF' : '#141518';
  const subColor = material === 'matte_black' ? 'rgba(255,255,255,0.7)' : 'rgba(20,21,24,0.7)';

  // 2. Draw Top Header / Brand
  const brandX = 64 + (cfg?.brandOffsetX || 0) * 2;
  const brandY = 72 + (cfg?.brandOffsetY || 0) * 2;
  ctx.fillStyle = textColor;
  ctx.font = '900 32px sans-serif';
  ctx.fillText(cfg?.topLabel || 'TAPPING', brandX, brandY);

  ctx.fillStyle = subColor;
  ctx.font = '700 18px monospace';
  ctx.fillText('NFC 13.56MHz CONTACTLESS', brandX, brandY + 28);

  // 3. Draw Smart Chip Contacts on front side
  if (!isBack && cfg?.showChip !== false) {
    const chipX = width - 180;
    const chipY = 60;
    ctx.fillStyle = '#E5B842';
    ctx.strokeStyle = '#B38924';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 110, 80, 12);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.moveTo(chipX + 35, chipY);
    ctx.lineTo(chipX + 35, chipY + 80);
    ctx.moveTo(chipX + 75, chipY);
    ctx.lineTo(chipX + 75, chipY + 80);
    ctx.moveTo(chipX, chipY + 40);
    ctx.lineTo(chipX + 110, chipY + 40);
    ctx.stroke();
  }

  // 4. Primary Name & Tagline
  const nameBaseX = 64 + (cfg?.nameOffsetX || 0) * 2;
  const nameBaseY = height - 160 + (cfg?.nameOffsetY || 0) * 2;

  const secBaseX = 64 + (cfg?.secondaryOffsetX || 0) * 2;
  const secBaseY = nameBaseY - 32 + (cfg?.secondaryOffsetY || 0) * 2;

  // Tagline
  ctx.fillStyle = subColor;
  ctx.font = '700 22px monospace';
  const tagline = cfg?.secondaryText || card.engravedTagline || 'DIGITAL CREATOR & FOUNDER';
  ctx.fillText(tagline.toUpperCase(), secBaseX, secBaseY);

  // Primary Engraved Name
  ctx.fillStyle = textColor;
  ctx.font = '900 48px sans-serif';
  const primaryName = cfg?.primaryText || card.engravedName || username.toUpperCase();
  ctx.fillText(primaryName.toUpperCase(), nameBaseX, nameBaseY + 12);

  // URL / UID
  const bottomX = 64 + (cfg?.bottomLabelOffsetX || 0) * 2;
  const bottomY = height - 64 + (cfg?.bottomLabelOffsetY || 0) * 2;
  ctx.fillStyle = subColor;
  ctx.font = '700 20px monospace';
  ctx.fillText(`${host}/${username}`, bottomX, bottomY);

  // 5. Draw QR Code if on back or enabled
  if (isBack || cfg?.showQrCode) {
    const qrTarget = `https://${host}/${username}`;
    try {
      const qrDataUrl = await QRCodeGenerator.toDataURL(qrTarget, {
        width: 240,
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const qrX = width - 260 + (cfg?.qrOffsetX || 0) * 2;
          const qrY = height - 260 + (cfg?.qrOffsetY || 0) * 2;
          // White QR backing card
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(qrX - 12, qrY - 12, 220, 220, 24);
          ctx.fill();
          ctx.drawImage(img, qrX, qrY, 196, 196);
          resolve();
        };
        img.src = qrDataUrl;
      });
    } catch (e) {
      console.error('Error generating QR for PNG', e);
    }
  }

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `tapping-metal-card-${material}-${side}-${username}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportCardAsPdf(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back',
  username: string,
  host: string = 'tapping.bio'
): Promise<void> {
  // Standard Credit Card Size: 85.6mm x 53.98mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98],
  });

  const cfg = side === 'front' ? card.frontSide : card.backSide;
  const isBack = side === 'back';

  // Fill background
  if (material === 'matte_black') {
    doc.setFillColor(20, 21, 24);
  } else if (material === 'brushed_gold') {
    doc.setFillColor(200, 164, 77);
  } else if (material === 'rose_gold') {
    doc.setFillColor(201, 138, 148);
  } else {
    doc.setFillColor(220, 224, 230);
  }
  doc.roundedRect(2, 2, 81.6, 49.98, 3, 3, 'F');

  const textColor = material === 'matte_black' ? [255, 255, 255] : [20, 21, 24];
  const subColor = material === 'matte_black' ? [180, 185, 195] : [60, 65, 75];

  // Brand Header
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(cfg?.topLabel || 'TAPPING', 8, 10);

  doc.setTextColor(subColor[0], subColor[1], subColor[2]);
  doc.setFont('courier', 'normal');
  doc.setFontSize(5);
  doc.text('NFC 13.56MHz CONTACTLESS', 8, 13);

  // Tagline
  doc.setTextColor(subColor[0], subColor[1], subColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  const tagline = cfg?.secondaryText || card.engravedTagline || 'DIGITAL CREATOR & ARCHITECT';
  doc.text(tagline.toUpperCase(), 8, 32);

  // Primary Name
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const primaryName = cfg?.primaryText || card.engravedName || username.toUpperCase();
  doc.text(primaryName.toUpperCase(), 8, 39);

  // URL
  doc.setTextColor(subColor[0], subColor[1], subColor[2]);
  doc.setFont('courier', 'bold');
  doc.setFontSize(6);
  doc.text(`${host}/${username}`, 8, 47);

  // QR Code on back
  if (isBack || cfg?.showQrCode) {
    try {
      const qrDataUrl = await QRCodeGenerator.toDataURL(`https://${host}/${username}`, {
        width: 140,
        margin: 1,
      });
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(57, 23, 22, 22, 2, 2, 'F');
      doc.addImage(qrDataUrl, 'PNG', 58, 24, 20, 20);
    } catch (e) {
      console.error('Error in PDF QR generation', e);
    }
  }

  doc.save(`tapping-metal-card-${material}-${side}-${username}.pdf`);
}

export function exportCardAsHtml(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back',
  username: string,
  host: string = 'tapping.bio'
): void {
  const cfg = side === 'front' ? card.frontSide : card.backSide;
  const isBack = side === 'back';
  const primaryName = cfg?.primaryText || card.engravedName || username.toUpperCase();
  const tagline = cfg?.secondaryText || card.engravedTagline || 'DIGITAL CREATOR & FOUNDER';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TAPPING Metal Card Blueprint - ${primaryName}</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      background: #0f1013;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 90vh;
    }
    .card {
      width: 540px;
      height: 340px;
      border-radius: 24px;
      padding: 32px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      ${
        material === 'matte_black'
          ? 'background: linear-gradient(135deg, #1e2024 0%, #141518 50%, #0c0d0f 100%); color: #ffffff;'
          : material === 'brushed_gold'
          ? 'background: linear-gradient(135deg, #d4af37 0%, #c8a44d 50%, #997d2e 100%); color: #141518;'
          : material === 'rose_gold'
          ? 'background: linear-gradient(135deg, #d99b9b 0%, #c98a94 50%, #a86c76 100%); color: #141518;'
          : 'background: linear-gradient(135deg, #eaecef 0%, #d5d8df 50%, #b0b4bc 100%); color: #141518;'
      }
    }
    .brand { font-size: 18px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; }
    .chip { font-family: monospace; font-size: 10px; opacity: 0.7; }
    .name { font-size: 24px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin: 4px 0; }
    .tagline { font-family: monospace; font-size: 11px; opacity: 0.75; letter-spacing: 0.1em; }
    .footer { font-family: monospace; font-size: 11px; opacity: 0.8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="card">
    <div>
      <div class="brand">${cfg?.topLabel || 'TAPPING'}</div>
      <div class="chip">NFC 13.56MHz CONTACTLESS &bull; NTAG216 CHIP</div>
    </div>
    <div>
      <div class="tagline">${tagline}</div>
      <div class="name">${primaryName}</div>
    </div>
    <div class="footer">
      <div>https://${host}/${username}</div>
      <div>UID: ${card.cardUid || '04:A2:8F:9B:41:22'}</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tapping-metal-card-${material}-${side}-${username}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
