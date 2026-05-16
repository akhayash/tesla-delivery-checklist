import { createStore, del, entries, get, set } from 'idb-keyval';

const store = createStore('tesla-delivery-media', 'blobs');

export interface StoredMedia {
  id: string;
  itemId: string;
  kind: 'image' | 'video';
  mimeType: string;
  size: number;
  createdAt: string;
  blob: Blob;
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Returns storage usage ratio [0, 1], or null if the API is unavailable. */
export async function getStorageRatio(): Promise<number | null> {
  if (typeof navigator !== 'undefined' && 'storage' in navigator && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    const quota = est.quota ?? 0;
    if (quota === 0) return null;
    return (est.usage ?? 0) / quota;
  }
  return null;
}

export async function saveMedia(
  params: Omit<StoredMedia, 'id' | 'createdAt'>
): Promise<StoredMedia> {
  const media: StoredMedia = {
    ...params,
    id: randomId(),
    createdAt: new Date().toISOString(),
  };
  try {
    await set(media.id, media, store);
  } catch (e) {
    // IndexedDB write failed – surface as a typed error so callers can handle it
    throw Object.assign(new Error('IndexedDB write failed'), { cause: e, code: 'IDB_WRITE_FAILED' });
  }
  return media;
}

export async function getMedia(id: string): Promise<StoredMedia | undefined> {
  return (await get(id, store)) as StoredMedia | undefined;
}

export async function deleteMedia(id: string): Promise<void> {
  await del(id, store);
}

export async function deleteMany(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => del(id, store)));
}

export async function listAllMedia(): Promise<StoredMedia[]> {
  const all = await entries(store);
  return all.map(([, v]) => v as StoredMedia);
}

export async function getStorageUsage(): Promise<{ used: number; quota: number } | null> {
  if (typeof navigator !== 'undefined' && 'storage' in navigator && navigator.storage.estimate) {
    const est = await navigator.storage.estimate();
    return { used: est.usage ?? 0, quota: est.quota ?? 0 };
  }
  return null;
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
