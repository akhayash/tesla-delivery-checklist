import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ChecklistSnapshot,
  DeliveryMeta,
  ItemStatus,
  SeverityFilter,
  UserItemState,
} from '@/data/schema';
import { defaultModelId, getTemplate } from '@/data/templates';
import { deleteMany } from '@/store/media';

const CURRENT_TEMPLATE_VERSION = '0.5.0';

interface ProgressState {
  snapshot: ChecklistSnapshot;
  severityFilter: SeverityFilter;
  migrationWarning: string | null;
  /** The id of the last item that was checked (ok / issue / na). Persisted to localStorage. */
  lastCheckedItemId: string | null;
  setStatus: (itemId: string, status: ItemStatus) => void;
  setSeverityFilter: (filter: SeverityFilter) => void;
  setNote: (itemId: string, note: string) => void;
  addMedia: (itemId: string, mediaId: string) => void;
  removeMedia: (itemId: string, mediaId: string) => void;
  setMeta: (meta: Partial<DeliveryMeta>) => void;
  bulkSetStatus: (itemIds: string[], status: Exclude<ItemStatus, 'unchecked'>) => void;
  bulkClearStatus: (itemIds: string[]) => void;
  switchModel: (modelId: string) => void;
  reset: () => void;
  importSnapshot: (snap: ChecklistSnapshot) => void;
  dismissMigrationWarning: () => void;
  /** Manually override the last-checked pointer (used by scroll-restore logic). */
  setLastCheckedItemId: (id: string | null) => void;
}

function initialSnapshot(modelId: string = defaultModelId): ChecklistSnapshot {
  const now = new Date().toISOString();
  return {
    meta: { modelId },
    states: {},
    startedAt: now,
    updatedAt: now,
    templateVersion: CURRENT_TEMPLATE_VERSION,
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

function upsertItems(
  snap: ChecklistSnapshot,
  itemIds: string[],
  patch: Partial<UserItemState>
): ChecklistSnapshot {
  if (itemIds.length === 0) return snap;
  let next = snap;
  for (const itemId of itemIds) {
    next = upsertItem(next, itemId, patch);
  }
  return next;
}

function normalizeSnapshot(snap: ChecklistSnapshot): {
  snapshot: ChecklistSnapshot;
  warning: string | null;
} {
  const template = getTemplate(snap.meta?.modelId ?? defaultModelId);
  const now = new Date().toISOString();
  const next: ChecklistSnapshot = {
    ...snap,
    meta: {
      ...snap.meta,
      modelId: template.modelId,
    },
    states: snap.states ?? {},
    startedAt: snap.startedAt ?? now,
    updatedAt: snap.updatedAt ?? now,
    templateVersion: template.version,
  };

  if (snap.templateVersion === template.version) {
    return { snapshot: next, warning: null };
  }

  return {
    snapshot: next,
    warning:
      `保存済みデータをテンプレート v${snap.templateVersion ?? '不明'} から ` +
      `v${template.version} に移行しました。既存項目は保持し、新規項目は未チェックです。`,
  };
}

function isSeverityFilter(value: unknown): value is SeverityFilter {
  return value === 'critical' || value === 'standard' || value === 'all';
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      snapshot: initialSnapshot(),
      severityFilter: 'all',
      migrationWarning: null,
      lastCheckedItemId: null,
      setStatus: (itemId, status) =>
        set((s) => ({
          snapshot: upsertItem(s.snapshot, itemId, { status }),
          // Track last actively-checked item (not "unchecked" resets)
          lastCheckedItemId: status !== 'unchecked' ? itemId : s.lastCheckedItemId,
        })),
      setSeverityFilter: (severityFilter) => set({ severityFilter }),
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
      bulkSetStatus: (itemIds, status) =>
        set((s) => ({ snapshot: upsertItems(s.snapshot, itemIds, { status }) })),
      bulkClearStatus: (itemIds) =>
        set((s) => ({ snapshot: upsertItems(s.snapshot, itemIds, { status: 'unchecked' }) })),
      switchModel: (modelId) => {
        set((s) => {
          const allMediaIds = Object.values(s.snapshot.states).flatMap((st) => st.mediaIds);
          void deleteMany(allMediaIds);
          return {
            snapshot: initialSnapshot(modelId),
            migrationWarning: null,
            lastCheckedItemId: null,
          };
        });
      },
      reset: () =>
        set((s) => {
          const allMediaIds = Object.values(s.snapshot.states).flatMap((st) => st.mediaIds);
          void deleteMany(allMediaIds);
          return {
            snapshot: initialSnapshot(s.snapshot.meta.modelId),
            migrationWarning: null,
            lastCheckedItemId: null,
          };
        }),
      importSnapshot: (snap) => {
        const normalized = normalizeSnapshot(snap);
        set({
          snapshot: normalized.snapshot,
          migrationWarning: normalized.warning,
        });
      },
      dismissMigrationWarning: () => set({ migrationWarning: null }),
      setLastCheckedItemId: (id) => set({ lastCheckedItemId: id }),
    }),
    {
      name: 'tesla-delivery-progress',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        snapshot: state.snapshot,
        severityFilter: state.severityFilter,
        lastCheckedItemId: state.lastCheckedItemId,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ProgressState> | undefined;
        const normalized = persisted?.snapshot
          ? normalizeSnapshot(persisted.snapshot)
          : { snapshot: currentState.snapshot, warning: null };

        return {
          ...currentState,
          snapshot: normalized.snapshot,
          severityFilter: isSeverityFilter(persisted?.severityFilter)
            ? persisted.severityFilter
            : currentState.severityFilter,
          migrationWarning: normalized.warning,
          lastCheckedItemId: persisted?.lastCheckedItemId ?? currentState.lastCheckedItemId,
        };
      },
    }
  )
);
