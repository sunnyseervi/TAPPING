export interface CompressedImage {
  dataUrl: string;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
}

export async function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
  const maxWidth = options.maxWidth ?? 1400;
  const maxHeight = options.maxHeight ?? 1400;
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
  const outputType = file.type === 'image/png' && file.size < 500000 ? 'image/png' : 'image/webp';
  const dataUrl = canvas.toDataURL(outputType, outputType === 'image/png' ? undefined : quality);
  const compressedBytes = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
  return { dataUrl, originalBytes: file.size, compressedBytes, width, height };
}
