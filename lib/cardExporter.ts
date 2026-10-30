import { jsPDF } from 'jspdf';
import QRCodeGenerator from 'qrcode';
import { NFCCardDesign, CardMaterial, CardSideConfig } from './types';

function isDarkHex(hex: string): boolean {
  if (!hex) return true;
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 160;
}

/**
 * Renders a card face to a high-resolution 600 DPI canvas (2022 × 1276 px)
 * Standard ISO 7810 ID-1 / CR80 Credit Card Size (85.60 mm × 53.98 mm)
 * Factory print-ready for fiber laser engraving & industrial UV printing.
 */
export async function renderCardSideCanvas(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back',
  username: string,
  host: string = 'tapping.bio'
): Promise<HTMLCanvasElement> {
  const width = 2022; // 600 DPI width for 85.6mm
  const height = 1276; // 600 DPI height for 53.98mm
  const scale = width / 340; // Scale relative to 340px preview (~5.947x)

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2D canvas context');

  const cfg: CardSideConfig | undefined = side === 'front' ? card.frontSide : card.backSide;
  const isBack = side === 'back';
  const isCustom = material === 'custom_color';
  const customColor = card.customColor || '#1A365D';
  const isDark = material === 'matte_black' || (isCustom && isDarkHex(customColor));

  // Default etch text color
  const defaultTextColor = isDark ? '#FFFFFF' : '#141518';
  const textColor = cfg?.textColor || defaultTextColor;
  const subColor = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(20, 21, 24, 0.75)';
  const qrColor = cfg?.qrColor || textColor;

  // 1. Clip CR80 Rounded Corners (3.18mm radius = ~75px at 600 DPI)
  const cornerRadius = 75;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, cornerRadius);
  ctx.clip();

  // 2. Render Photorealistic Metallic Material Background
  if (material === 'brushed_gold') {
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#DFB750');
    goldGrad.addColorStop(0.18, '#B88A28');
    goldGrad.addColorStop(0.38, '#FFF4CC');
    goldGrad.addColorStop(0.54, '#DAA520');
    goldGrad.addColorStop(0.72, '#996515');
    goldGrad.addColorStop(1, '#F3D068');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Fine brushed metallic hairline texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let y = 0; y < height; y += 8) {
      ctx.fillRect(0, y, width, 3);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let y = 4; y < height; y += 8) {
      ctx.fillRect(0, y, width, 3);
    }
  } else if (material === 'titanium_silver') {
    const silverGrad = ctx.createLinearGradient(0, 0, width, height);
    silverGrad.addColorStop(0, '#FFFFFF');
    silverGrad.addColorStop(0.2, '#D1D5DB');
    silverGrad.addColorStop(0.4, '#F9FAFB');
    silverGrad.addColorStop(0.6, '#9CA3AF');
    silverGrad.addColorStop(0.8, '#E5E7EB');
    silverGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = silverGrad;
    ctx.fillRect(0, 0, width, height);

    // Fine brushed metallic hairline texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let y = 0; y < height; y += 8) {
      ctx.fillRect(0, y, width, 3);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let y = 4; y < height; y += 8) {
      ctx.fillRect(0, y, width, 3);
    }
  } else if (material === 'rose_gold') {
    const roseGrad = ctx.createLinearGradient(0, 0, width, height);
    roseGrad.addColorStop(0, '#FAD0C4');
    roseGrad.addColorStop(0.22, '#E89EAD');
    roseGrad.addColorStop(0.42, '#FFF0EB');
    roseGrad.addColorStop(0.65, '#C77383');
    roseGrad.addColorStop(0.8, '#A85A6A');
    roseGrad.addColorStop(1, '#F7C0C8');
    ctx.fillStyle = roseGrad;
    ctx.fillRect(0, 0, width, height);

    // Fine brushed metallic hairline texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let y = 0; y < height; y += 8) {
      ctx.fillRect(0, y, width, 3);
    }
  } else if (material === 'matte_black') {
    const blackGrad = ctx.createRadialGradient(
      width * 0.25, height * 0.2, 0,
      width * 0.5, height * 0.5, width * 0.8
    );
    blackGrad.addColorStop(0, '#2D3039');
    blackGrad.addColorStop(0.5, '#17181D');
    blackGrad.addColorStop(1, '#0A0B0D');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, width, height);
  } else {
    // Custom Color
    ctx.fillStyle = customColor;
    ctx.fillRect(0, 0, width, height);

    // Subtle specular sheen
    const sheen = ctx.createLinearGradient(0, 0, width, height);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Custom Uploaded Artwork Layer (if provided)
  if (cfg?.artworkUrl) {
    try {
      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        artImg.onload = () => resolve();
        artImg.onerror = () => resolve(); // continue if image fails
        artImg.src = cfg.artworkUrl!;
      });
      if (artImg.width > 0) {
        ctx.save();
        ctx.globalAlpha = (cfg.artworkOpacity ?? 90) / 100;
        const zoom = (cfg.artworkZoom ?? 100) / 100;
        const dw = width * zoom;
        const dh = height * zoom;
        const dx = (width - dw) / 2 + (cfg.artworkPosX ?? 0) * (width / 100);
        const dy = (height - dh) / 2 + (cfg.artworkPosY ?? 0) * (height / 100);
        ctx.drawImage(artImg, dx, dy, dw, dh);
        ctx.restore();
      }
    } catch {
      // ignore artwork failure
    }
  }

  // 4. Chamfered Metallic Edge Rim
  ctx.lineWidth = 10;
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.2)';
  ctx.stroke();

  // If back face is explicitly set to plain surface, return early with pure finish
  if (isBack && cfg?.isPlain) {
    ctx.restore();
    return canvas;
  }

  // Safe Print Area Margin (5mm = ~118px at 600 DPI)
  const safeMargin = 118;

  // 5. Contactless Smart Chip (Front Face only, if enabled)
  if (!isBack && cfg?.showChip !== false) {
    const chipPos = cfg?.chipPosition || 'top-right';
    let chipX = width - safeMargin - 220;
    let chipY = safeMargin;
    if (chipPos === 'top-left') {
      chipX = safeMargin;
      chipY = safeMargin;
    } else if (chipPos === 'bottom-right') {
      chipX = width - safeMargin - 220;
      chipY = height - safeMargin - 150;
    }

    if (chipPos !== 'hidden') {
      const chipW = 220;
      const chipH = 150;
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipGrad.addColorStop(0, '#F59E0B');
      chipGrad.addColorStop(0.5, '#D97706');
      chipGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = chipGrad;
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(chipX, chipY, chipW, chipH, 20);
      ctx.fill();
      ctx.stroke();

      // Chip contact traces
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(chipX + 70, chipY);
      ctx.lineTo(chipX + 70, chipY + chipH);
      ctx.moveTo(chipX + 150, chipY);
      ctx.lineTo(chipX + 150, chipY + chipH);
      ctx.moveTo(chipX, chipY + 75);
      ctx.lineTo(chipX + chipW, chipY + 75);
      ctx.stroke();
    }
  }

  // 6. Typography Helpers
  const fontFam = cfg?.fontFamily || "'Plus Jakarta Sans', sans-serif";

  // Position helper based on anchors
  const getAnchorCoords = (
    pos: string,
    w: number,
    h: number
  ): { x: number; y: number; align: CanvasTextAlign } => {
    switch (pos) {
      case 'top-right':
        return { x: width - safeMargin, y: safeMargin, align: 'right' };
      case 'top-center':
        return { x: width / 2, y: safeMargin, align: 'center' };
      case 'bottom-left':
        return { x: safeMargin, y: height - safeMargin - h, align: 'left' };
      case 'bottom-right':
        return { x: width - safeMargin, y: height - safeMargin - h, align: 'right' };
      case 'bottom-center':
        return { x: width / 2, y: height - safeMargin - h, align: 'center' };
      case 'center':
        return { x: width / 2, y: height / 2 - h / 2, align: 'center' };
      case 'top-left':
      default:
        return { x: safeMargin, y: safeMargin, align: 'left' };
    }
  };

  // 7. Brand Label (Top/Header)
  const brandSize = (cfg?.brandSize || 13) * scale;
  const brandCoords = getAnchorCoords(cfg?.brandPosition || 'top-left', 300, brandSize * 1.5);
  const brandX = brandCoords.x + (cfg?.brandOffsetX || 0) * scale;
  const brandY = brandCoords.y + (cfg?.brandOffsetY || 0) * scale;

  ctx.fillStyle = textColor;
  ctx.textAlign = brandCoords.align;
  ctx.textBaseline = 'top';
  ctx.font = `900 ${brandSize}px ${fontFam}`;
  ctx.fillText(cfg?.topLabel || 'TAPPING', brandX, brandY);

  // Bottom Label under brand (only if set by user, strictly avoiding NFC/13.56 text)
  if (cfg?.bottomLabel && !cfg.bottomLabel.includes('13.56') && !cfg.bottomLabel.includes('NFC')) {
    ctx.fillStyle = subColor;
    ctx.font = `700 ${brandSize * 0.65}px monospace`;
    ctx.fillText(cfg.bottomLabel, brandX, brandY + brandSize * 1.25);
  }

  // 8. Primary Name & Tagline
  const primarySize = (cfg?.primaryTextSize || 18) * scale;
  const secondarySize = (cfg?.secondaryTextSize || 9) * scale;
  const nameCoords = getAnchorCoords(
    cfg?.namePosition || (isBack ? 'top-left' : 'bottom-left'),
    500,
    primarySize + secondarySize * 2.5
  );

  const nameX = nameCoords.x + (cfg?.nameOffsetX || 0) * scale;
  const nameY = nameCoords.y + (cfg?.nameOffsetY || 0) * scale;

  ctx.textAlign = nameCoords.align;
  ctx.textBaseline = 'top';

  if (!isBack) {
    // Front Face: Tagline then Name
    const tagline = cfg?.secondaryText || card.engravedTagline || 'DIGITAL CREATOR';
    ctx.fillStyle = subColor;
    ctx.font = `700 ${secondarySize}px monospace`;
    const secY = nameY + (cfg?.secondaryOffsetY || 0) * scale;
    ctx.fillText(tagline.toUpperCase(), nameX + (cfg?.secondaryOffsetX || 0) * scale, secY);

    const primaryName = cfg?.primaryText || card.engravedName || username.toUpperCase();
    ctx.fillStyle = textColor;
    ctx.font = `900 ${primarySize}px ${fontFam}`;
    ctx.fillText(primaryName.toUpperCase(), nameX, secY + secondarySize * 1.4);

    // Profile URL
    ctx.fillStyle = subColor;
    ctx.font = `700 ${secondarySize * 0.95}px monospace`;
    ctx.fillText(`${host}/${username}`, nameX, secY + secondarySize * 1.4 + primarySize * 1.2);
  } else {
    // Back Face: Connection instruction & destination URL
    const backHeading = cfg?.primaryText || 'TAP ANY PHONE TO CONNECT';
    ctx.fillStyle = textColor;
    ctx.font = `900 ${primarySize * 0.85}px ${fontFam}`;
    ctx.fillText(backHeading.toUpperCase(), nameX, nameY);

    const backSub = cfg?.secondaryText || `${host}/${username}`;
    ctx.fillStyle = subColor;
    ctx.font = `700 ${secondarySize * 1.1}px monospace`;
    ctx.fillText(backSub, nameX, nameY + primarySize * 1.15);

    // Custom Note (sanitized)
    if (cfg?.customNote && !cfg.customNote.includes('NTAG') && !cfg.customNote.includes('Lifetime')) {
      ctx.fillStyle = subColor;
      ctx.font = `600 ${secondarySize * 0.9}px monospace`;
      ctx.fillText(cfg.customNote, nameX, nameY + primarySize * 1.15 + secondarySize * 1.5);
    }
  }

  // 9. Barcode / Dynamic QR Code (Seamless Transparent Background)
  const shouldRenderQr = isBack ? (cfg?.showQrCode !== false) : (card.sideMode === 'single_sided' || cfg?.showQrCode);
  if (shouldRenderQr) {
    const qrPx = (cfg?.qrSize || 56) * scale;
    const qrAnchor = getAnchorCoords(cfg?.qrPosition || 'bottom-right', qrPx, qrPx);
    let qrX = qrAnchor.x + (cfg?.qrOffsetX || 0) * scale;
    let qrY = qrAnchor.y + (cfg?.qrOffsetY || 0) * scale;

    // Adjust for right-aligned anchors
    if (qrAnchor.align === 'right') {
      qrX -= qrPx;
    } else if (qrAnchor.align === 'center') {
      qrX -= qrPx / 2;
    }

    const origin = `https://${host}`;
    const targetUrl = card.redirectMode === 'direct_vcard'
      ? `${origin}/${username}?download=vcard`
      : `${origin}/${username}`;

    try {
      const qrDataUrl = await QRCodeGenerator.toDataURL(targetUrl, {
        width: 1024,
        margin: 0,
        errorCorrectionLevel: 'M',
        color: {
          dark: qrColor,
          light: '#00000000', // 100% transparent background
        },
      });

      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = reject;
        qrImg.src = qrDataUrl;
      });

      // Draw QR code directly onto metallic surface with NO white backing box
      ctx.drawImage(qrImg, qrX, qrY, qrPx, qrPx);
    } catch (e) {
      console.error('Error generating transparent QR for card print', e);
    }
  }

  ctx.restore();
  return canvas;
}

/**
 * High-Definition PDF Export for Factory Printing & UV/Laser Engravers
 * Standard ISO 7810 ID-1 / CR80 Credit Card Size: 85.60 mm × 53.98 mm @ 600 DPI
 */
export async function exportCardAsPdf(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back' | 'both',
  username: string,
  host: string = 'tapping.bio'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98],
    compress: true,
  });

  if (side === 'both') {
    // Page 1: Front Face (600 DPI)
    const frontCanvas = await renderCardSideCanvas(card, material, 'front', username, host);
    const frontData = frontCanvas.toDataURL('image/png');
    doc.addImage(frontData, 'PNG', 0, 0, 85.6, 53.98, undefined, 'FAST');

    // Page 2: Back Face (600 DPI)
    doc.addPage([85.6, 53.98], 'landscape');
    const backCanvas = await renderCardSideCanvas(card, material, 'back', username, host);
    const backData = backCanvas.toDataURL('image/png');
    doc.addImage(backData, 'PNG', 0, 0, 85.6, 53.98, undefined, 'FAST');
  } else {
    // Single Side
    const canvas = await renderCardSideCanvas(card, material, side, username, host);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98, undefined, 'FAST');
  }

  const filename = side === 'both'
    ? `metal-card-print-${material}-${username}.pdf`
    : `metal-card-print-${material}-${side}-${username}.pdf`;

  doc.save(filename);
}

/**
 * High-Definition 600 DPI PNG Export
 */
export async function exportCardAsPng(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back',
  username: string,
  host: string = 'tapping.bio'
): Promise<void> {
  const canvas = await renderCardSideCanvas(card, material, side, username, host);
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `metal-card-${material}-${side}-${username}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Clean HTML Blueprint Export
 */
export function exportCardAsHtml(
  card: NFCCardDesign,
  material: CardMaterial,
  side: 'front' | 'back',
  username: string,
  host: string = 'tapping.bio'
): void {
  const cfg = side === 'front' ? card.frontSide : card.backSide;
  const primaryName = cfg?.primaryText || card.engravedName || username.toUpperCase();
  const tagline = cfg?.secondaryText || card.engravedTagline || 'DIGITAL IDENTITY';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Metal Card Blueprint - ${primaryName}</title>
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
      border-radius: 20px;
      padding: 28px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.18);
      ${
        material === 'custom_color'
          ? `background: ${card.customColor || '#1e293b'}; color: #ffffff;`
          : material === 'matte_black'
          ? 'background: radial-gradient(circle at 25% 20%, #2D3039 0%, #17181D 50%, #0A0B0D 100%); color: #ffffff;'
          : material === 'brushed_gold'
          ? 'background: linear-gradient(135deg, #ECC86A 0%, #B88A28 20%, #FFF4CC 40%, #DAA520 60%, #996515 80%, #F3D068 100%); color: #141518;'
          : material === 'rose_gold'
          ? 'background: linear-gradient(135deg, #FAD0C4 0%, #E89EAD 25%, #FFF0EB 45%, #C77383 68%, #F7C0C8 100%); color: #141518;'
          : 'background: linear-gradient(135deg, #FFFFFF 0%, #D1D5DB 20%, #F9FAFB 40%, #9CA3AF 60%, #E5E7EB 80%, #FFFFFF 100%); color: #141518;'
      }
    }
    .brand { font-size: 18px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; }
    .name { font-size: 24px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin: 4px 0; }
    .tagline { font-family: monospace; font-size: 11px; opacity: 0.75; letter-spacing: 0.1em; }
    .footer { font-family: monospace; font-size: 11px; opacity: 0.8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">${cfg?.topLabel || 'TAPPING'}</div>
    <div>
      <div class="tagline">${tagline}</div>
      <div class="name">${primaryName}</div>
    </div>
    <div class="footer">
      <div>https://${host}/${username}</div>
      <div>UID: ${card.cardUid || 'TAP-IN-001'}</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `metal-card-${material}-${side}-${username}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
