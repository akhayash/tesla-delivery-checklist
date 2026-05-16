import LZString from 'lz-string';
import type { ChecklistSnapshot } from '@/data/schema';

/**
 * Build a viewer URL that embeds the snapshot (without media blobs) in the
 * URL hash. Anyone who opens the URL will see a read-only view of the
 * checklist results, notes, and statuses. Photos / videos are intentionally
 * NOT included — they remain only in the HTML report and on the original
 * device.
 */
export function buildViewerUrl(appUrl: string, snapshot: ChecklistSnapshot): string {
  // Strip media references but keep everything else readable.
  const sanitized: ChecklistSnapshot = {
    ...snapshot,
    states: Object.fromEntries(
      Object.entries(snapshot.states).map(([id, s]) => [id, { ...s, mediaIds: [] }])
    ),
  };
  const payload = JSON.stringify(sanitized);
  const compressed = LZString.compressToEncodedURIComponent(payload);
  // Hash route so GitHub Pages handles it cleanly with HashRouter.
  const base = appUrl.endsWith('/') ? appUrl : `${appUrl}/`;
  return `${base}#/view?d=${compressed}`;
}

export function tryDecodeSnapshot(encoded: string): ChecklistSnapshot | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as ChecklistSnapshot;
    if (!parsed || typeof parsed !== 'object' || !parsed.meta || !parsed.states) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Approximate the resulting QR data length (useful for fallback decisions). */
export function viewerUrlByteLength(appUrl: string, snapshot: ChecklistSnapshot): number {
  return new TextEncoder().encode(buildViewerUrl(appUrl, snapshot)).length;
}
