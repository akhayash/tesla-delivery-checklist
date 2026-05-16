import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChecklistSnapshot, DeliveryMeta, ItemStatus, UserItemState } from '@/data/schema';
import { defaultModelId } from '@/data/templates';

interface ProgressState {
  snapshot: ChecklistSnapshot;
  setStatus: (itemId: string, status: ItemStatus) => void;
  setNote: (itemId: string, note: string) => void;
  addMedia: (itemId: string, mediaId: string) => void;
  removeMedia: (itemId: string, mediaId: string) => void;
  setMeta: (meta: Partial<DeliveryMeta>) => void;
  switchModel: (modelId: string) => void;
  reset: () => void;
  importSnapshot: (snap: ChecklistSnapshot) => void;
}

function initialSnapshot(modelId: string = defaultModelId): ChecklistSnapshot {
  const now = new Date().toISOString();
  return {
    meta: { modelId },
    states: {},
    startedAt: now,
    updatedAt: now,
    templateVersion: '0.1.0',
  };
}

function touch(snap: ChecklistSnapshot): ChecklistSnapshot {
  return { ...snap, updatedAt: new Date().toISOString() };
}

function upsertItem(
  snap: ChecklistSnapshot,
  itemId: string,
  patch: Partial<UserItemState>
): ChecklistSnapshot {
  const prev: UserItemState = snap.states[itemId] ?? {
    itemId,
    status: 'unchecked',
    mediaIds: [],
    updatedAt: new Date().toISOString(),
  };
  const next: UserItemState = {
    ...prev,
    ...patch,
    itemId,
    updatedAt: new Date().toISOString(),
  };
  return touch({ ...snap, states: { ...snap.states, [itemId]: next } });
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      snapshot: initialSnapshot(),
      setStatus: (itemId, status) =>
        set((s) => ({ snapshot: upsertItem(s.snapshot, itemId, { status }) })),
      setNote: (itemId, note) =>
        set((s) => ({ snapshot: upsertItem(s.snapshot, itemId, { note }) })),
      addMedia: (itemId, mediaId) =>
        set((s) => {
          const prev = s.snapshot.states[itemId]?.mediaIds ?? [];
          return {
            snapshot: upsertItem(s.snapshot, itemId, { mediaIds: [...prev, mediaId] }),
          };
        }),
      removeMedia: (itemId, mediaId) =>
        set((s) => {
          const prev = s.snapshot.states[itemId]?.mediaIds ?? [];
          return {
            snapshot: upsertItem(s.snapshot, itemId, {
              mediaIds: prev.filter((id) => id !== mediaId),
            }),
          };
        }),
      setMeta: (meta) =>
        set((s) => ({
          snapshot: touch({
            ...s.snapshot,
            meta: { ...s.snapshot.meta, ...meta },
          }),
        })),
      switchModel: (modelId) => set({ snapshot: initialSnapshot(modelId) }),
      reset: () =>
        set((s) => ({ snapshot: initialSnapshot(s.snapshot.meta.modelId) })),
      importSnapshot: (snap) => set({ snapshot: snap }),
    }),
    {
      name: 'tesla-delivery-progress',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
