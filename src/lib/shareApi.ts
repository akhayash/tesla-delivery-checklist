export interface ShareData {
  title: string;
  text: string;
  files?: File[];
}

export function canShareFiles(files: File[]): boolean {
  if (typeof navigator === 'undefined' || !('share' in navigator)) return false;
  const n = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
  };
  return !!n.canShare && n.canShare({ files });
}

export async function shareReport(data: ShareData): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('share' in navigator)) return false;
  try {
    await navigator.share(data);
    return true;
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') return true;
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}
