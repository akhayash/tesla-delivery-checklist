import type { ChecklistSnapshot } from '@/data/schema';
import { blobToBase64, getMedia, saveMedia, type StoredMedia } from '@/store/media';

export interface JsonExport {
  schema: 'tesla-delivery-checklist@1';
  exportedAt: string;
  snapshot: ChecklistSnapshot;
  media?: SerializedMedia[];
}

export interface SerializedMedia {
  id: string;
  itemId: string;
  kind: 'image' | 'video';
  mimeType: string;
  size: number;
  createdAt: string;
  dataUrl: string;
}

export async function exportJson(
  snapshot: ChecklistSnapshot,
  options: { includeMedia: boolean }
): Promise<JsonExport> {
  const mediaIds = Object.values(snapshot.states).flatMap((s) => s.mediaIds);
  let media: SerializedMedia[] | undefined;
  if (options.includeMedia && mediaIds.length > 0) {
    const stored = (await Promise.all(mediaIds.map(getMedia))).filter(
      (m): m is StoredMedia => !!m
    );
    media = await Promise.all(
      stored.map(async (m) => ({
        id: m.id,
        itemId: m.itemId,
        kind: m.kind,
        mimeType: m.mimeType,
        size: m.size,
        createdAt: m.createdAt,
        dataUrl: await blobToBase64(m.blob),
      }))
    );
  }
  return {
    schema: 'tesla-delivery-checklist@1',
    exportedAt: new Date().toISOString(),
    snapshot,
    media,
  };
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(',');
  const mime = /data:([^;]+)/.exec(meta)?.[1] ?? 'application/octet-stream';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function importJson(json: JsonExport): Promise<ChecklistSnapshot> {
  if (!json?.schema?.startsWith('tesla-delivery-checklist@')) {
    throw new Error('対応していないファイル形式です');
  }
  if (json.media?.length) {
    // Recreate blobs in IDB and remap ids (keep original ids so snapshot links match).
    await Promise.all(
      json.media.map(async (m) => {
        await saveMedia({
          itemId: m.itemId,
          kind: m.kind,
          mimeType: m.mimeType,
          size: m.size,
          blob: dataUrlToBlob(m.dataUrl),
        }).then(async (saved) => {
          // Replace media id in the snapshot references with the new id
          for (const state of Object.values(json.snapshot.states)) {
            state.mediaIds = state.mediaIds.map((id) => (id === m.id ? saved.id : id));
          }
        });
      })
    );
  }
  return json.snapshot;
}
