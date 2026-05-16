import type { ChecklistSnapshot, ChecklistTemplate, ItemStatus, Severity } from '@/data/schema';
import { blobToBase64, getMedia, type StoredMedia } from '@/store/media';

export interface ResolvedMedia {
  id: string;
  kind: 'image' | 'video';
  dataUrl: string;
  mimeType: string;
  size: number;
}

export async function resolveMedia(mediaIds: string[]): Promise<ResolvedMedia[]> {
  const all = await Promise.all(mediaIds.map((id) => getMedia(id)));
  const present = all.filter((m): m is StoredMedia => !!m);
  const items = await Promise.all(
    present.map(async (m) => ({
      id: m.id,
      kind: m.kind,
      mimeType: m.mimeType,
      size: m.size,
      dataUrl: await blobToBase64(m.blob),
    }))
  );
  return items;
}

export interface ReportEntry {
  itemId: string;
  title: string;
  category: string;
  severity?: Severity;
  status: ItemStatus;
  note?: string;
  media: ResolvedMedia[];
}

export interface BuiltReport {
  template: ChecklistTemplate;
  snapshot: ChecklistSnapshot;
  generatedAt: string;
  totals: Record<ItemStatus, number> & { total: number };
  entries: ReportEntry[];
  issueEntries: ReportEntry[];
}

export async function buildReport(
  template: ChecklistTemplate,
  snapshot: ChecklistSnapshot,
  options: { includeMedia: boolean } = { includeMedia: true }
): Promise<BuiltReport> {
  const entries: ReportEntry[] = [];
  const totals = { unchecked: 0, ok: 0, issue: 0, na: 0, total: 0 } as BuiltReport['totals'];

  for (const cat of template.categories) {
    for (const item of cat.items) {
      const state = snapshot.states[item.id];
      const status: ItemStatus = state?.status ?? 'unchecked';
      totals[status]++;
      totals.total++;
      const media = options.includeMedia && state?.mediaIds?.length
        ? await resolveMedia(state.mediaIds)
        : [];
      entries.push({
        itemId: item.id,
        title: item.title,
        category: cat.title,
        severity: item.severity,
        status,
        note: state?.note,
        media,
      });
    }
  }

  return {
    template,
    snapshot,
    generatedAt: new Date().toISOString(),
    totals,
    entries,
    issueEntries: entries.filter((e) => e.status === 'issue'),
  };
}
