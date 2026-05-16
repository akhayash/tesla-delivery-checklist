/**
 * Resize an image File/Blob using a Canvas so the longest edge is at most
 * `maxEdge` (default 1600px). Re-encoded as JPEG to drop EXIF and reduce size.
 */
export async function resizeImage(
  file: Blob,
  maxEdge: number = 1600,
  quality: number = 0.85
): Promise<Blob> {
  // Decode the image. createImageBitmap is fastest & off-main-thread.
  const bitmap = await createImageBitmap(file).catch(async () => {
    // Safari fallback: HTMLImageElement
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      return await createImageBitmap(c);
    } finally {
      URL.revokeObjectURL(url);
    }
  });

  const { width, height } = bitmap;
  const longest = Math.max(width, height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to encode JPEG'))),
      'image/jpeg',
      quality
    );
  });
}
