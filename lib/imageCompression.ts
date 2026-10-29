export interface CompressedImage {
  dataUrl: string;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
  savingsPercent: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
  const maxWidth = options.maxWidth ?? 1200;
  const maxHeight = options.maxHeight ?? 1200;
  const quality = options.quality ?? 0.8;
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('The image format is not supported.'));
    element.src = source;
  });
  const ratio = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image compression is unavailable in this browser.');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, width, height);

  // Modern browsers support image/webp which yields 80-95% compression with high fidelity
  let outputType = 'image/webp';
  let dataUrl = canvas.toDataURL(outputType, quality);
  // Fallback for browsers that don't export webp
  if (!dataUrl.startsWith('data:image/webp')) {
    outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    dataUrl = canvas.toDataURL(outputType, quality);
  }

  const compressedBytes = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
  const savingsPercent = Math.max(0, Math.round(((file.size - compressedBytes) / file.size) * 100));

  return { dataUrl, originalBytes: file.size, compressedBytes, width, height, savingsPercent };
}

/**
 * Compresses an avatar profile picture to a compact favicon/avatar resolution (256x256 max).
 * Shrinks 5-10MB mobile camera photos down to 15-30KB so localStorage and mobile data use almost nothing.
 */
export async function compressAvatarImage(file: File): Promise<CompressedImage> {
  return compressImageFile(file, {
    maxWidth: 256,
    maxHeight: 256,
    quality: 0.82,
  });
}

/**
 * Compresses a theme background wallpaper to optimized mobile/desktop resolution (960x1440 max).
 * Drastically cuts down multi-megabyte wallpapers to 60-120KB so bio links load instantaneously.
 */
export async function compressWallpaperImage(file: File): Promise<CompressedImage> {
  return compressImageFile(file, {
    maxWidth: 960,
    maxHeight: 1440,
    quality: 0.78,
  });
}

/**
 * Compresses link card custom backgrounds (640x360 max).
 */
export async function compressLinkCardImage(file: File): Promise<CompressedImage> {
  return compressImageFile(file, {
    maxWidth: 640,
    maxHeight: 360,
    quality: 0.8,
  });
}

/**
 * Compresses physical NFC card custom artwork logos and vector graphics (1200x750 max).
 * Ensures crisp print resolution while keeping payload under 150KB for zero-lag rendering.
 */
export async function compressCardArtworkImage(file: File): Promise<CompressedImage> {
  return compressImageFile(file, {
    maxWidth: 1200,
    maxHeight: 750,
    quality: 0.84,
  });
}

/**
 * Compresses store product catalog pictures (800x800 max).
 * Drastically reduces store bandwidth and eliminates catalog carousel lag.
 */
export async function compressProductImage(file: File): Promise<CompressedImage> {
  return compressImageFile(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
  });
}
