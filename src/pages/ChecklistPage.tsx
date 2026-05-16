import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getTemplate } from '@/data/templates';
import type { ChecklistSnapshot, ItemStatus } from '@/data/schema';
import { useProgress } from '@/store/progress';
import { ChecklistItemRow } from '@/components/ChecklistItemRow';
import {
  getScopedCategories,
  getScopedItemIds,
  severityFilterMeta,
} from '@/lib/checklistScope';
import { toast } from 'sonner';

type ConfirmAction = 'issue' | 'clear' | null;

export default function ChecklistPage() {
  const snapshot = useProgress((s) => s.snapshot);
  const severityFilter = useProgress((s) => s.severityFilter);
  const bulkSetStatus = useProgress((s) => s.bulkSetStatus);
  const bulkClearStatus = useProgress((s) => s.bulkClearStatus);
  const importSnapshot = useProgress((s) => s.importSnapshot);
  const lastCheckedItemId = useProgress((s) => s.lastCheckedItemId);
  const template = getTemplate(snapshot.meta.modelId);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const didScrollRef = useRef(false);

  const scopedCategories = useMemo(
    () => getScopedCategories(template, severityFilter),
    [severityFilter, template]
  );

  const visibleItemIds = useMemo(
    () => getScopedItemIds(template, severityFilter),
    [severityFilter, template]
  );

  const uncheckedItemIds = useMemo(
    () =>
      visibleItemIds.filter(
        (itemId) => (snapshot.states[itemId]?.status ?? 'unchecked') === 'unchecked'
      ),
    [snapshot.states, visibleItemIds]
  );

  const counts = useMemo(() => {
    const next: Record<string, { total: number; checked: number; issues: number }> = {};
    for (const category of scopedCategories) {
      let total = 0;
      let checked = 0;
      let issues = 0;
      for (const item of category.items) {
        total++;
        const status = snapshot.states[item.id]?.status ?? 'unchecked';
        if (status !== 'unchecked') checked++;
        if (status === 'issue') issues++;
      }
      next[category.id] = { total, checked, issues };
    }
    return next;
  }, [scopedCategories, snapshot.states]);

  // Total progress numbers used in the resume banner
  const { totalItems, checkedItems } = useMemo(() => {
    let total = 0;
    let checked = 0;
    for (const cat of template.categories) {
      for (const item of cat.items) {
        total++;
        const st = snapshot.states[item.id]?.status;
        if (st && st !== 'unchecked') checked++;
      }
    }
    return { totalItems: total, checkedItems: checked };
  }, [snapshot, template]);

  // Scroll to the last checked item on first mount (resume UX)
  useEffect(() => {
    if (didScrollRef.current || !lastCheckedItemId) return;
    didScrollRef.current = true;
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-testid="item-${lastCheckedItemId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, [lastCheckedItemId]);

  function cloneSnapshot(value: ChecklistSnapshot): ChecklistSnapshot {
    return JSON.parse(JSON.stringify(value)) as ChecklistSnapshot;
  }

  function showUndoToast(message: string, previousSnapshot: ChecklistSnapshot) {
    toast.success(message, {
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => importSnapshot(previousSnapshot),
      },
    });
  }

  function applyBulkStatus(status: Exclude<ItemStatus, 'unchecked'>) {
    if (uncheckedItemIds.length === 0) return;
    const previousSnapshot = cloneSnapshot(snapshot);
    bulkSetStatus(uncheckedItemIds, status);
    showUndoToast(
      `表示中の未チェック ${uncheckedItemIds.length} 件を ${
        status === 'ok' ? 'OK' : status === 'issue' ? '問題あり' : '対象外'
      } にしました`,
      previousSnapshot
    );
  }

  function applyClear() {
    if (visibleItemIds.length === 0) return;
    const previousSnapshot = cloneSnapshot(snapshot);
    bulkClearStatus(visibleItemIds);
    showUndoToast(
      `表示中の ${visibleItemIds.length} 件を未チェックに戻しました`,
      previousSnapshot
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl">{template.modelNameJa}</h2>
        <p className="text-xs text-muted-foreground">
          動線に沿って確認できます。表示中の範囲だけで集計・一括操作されます。
        </p>
      </div>

      {lastCheckedItemId && checkedItems > 0 && (
        <div
          className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm"
          data-testid="resume-banner"
        >
          <span className="text-muted-foreground">
            前回の続きから — <span className="font-medium text-foreground">{checkedItems} 件チェック済み</span>
            {' / 残り '}
            <span className="font-medium text-foreground">{totalItems - checkedItems} 件</span>
          </span>
        </div>
      )}

      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">一括ショートカット</p>
            <p className="text-xs text-muted-foreground" data-testid="bulk-preview">
              現在未チェックの {uncheckedItemIds.length} 件に適用します。未チェックへ戻す操作は
              表示中の {visibleItemIds.length} 件が対象です。
            </p>
          </div>
          <Badge variant="outline" className="tabular">
            {severityFilterMeta[severityFilter].label}
          </Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => applyBulkStatus('ok')}
            disabled={uncheckedItemIds.length === 0}
            data-testid="bulk-ok"
          >
            🟢 未選択を全て OK にする
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => setConfirmAction('issue')}
            disabled={uncheckedItemIds.length === 0}
            data-testid="bulk-issue"
          >
            🔴 未選択を全て 問題あり にする
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => applyBulkStatus('na')}
            disabled={uncheckedItemIds.length === 0}
            data-testid="bulk-na"
          >
            ⚪ 未選択を全て 対象外 にする
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => setConfirmAction('clear')}
            disabled={visibleItemIds.length === 0}
            data-testid="bulk-clear"
          >
            🧹 全項目を 未チェック に戻す
          </Button>
        </div>
      </section>

      <Accordion
        key={severityFilter}
        type="multiple"
        defaultValue={scopedCategories.map((category) => category.id)}
      >
        {scopedCategories.map((category) => {
          const categoryCount = counts[category.id];
          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              data-testid={`cat-${category.id}`}
              id={`section-${category.id}`}
              className="scroll-mt-40"
            >
              <AccordionTrigger>
                <div className="flex flex-1 items-center justify-between gap-3 pr-2">
                  <span>{category.title}</span>
                  <span className="flex items-center gap-1.5">
                    {categoryCount.issues > 0 && (
                      <Badge variant="destructive">問題 {categoryCount.issues}</Badge>
                    )}
                    <Badge variant="muted" className="tabular">
                      {categoryCount.checked}/{categoryCount.total}
                    </Badge>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {category.locationHint && (
                    <div className="rounded-xl border border-border/70 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">📍 ここで確認</span>{' '}
                      {category.locationHint}
                    </div>
                  )}
                  {category.items.map((item) => (
                    <ChecklistItemRow key={item.id} item={item} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'issue'
                ? '未選択をすべて問題ありにしますか？'
                : '表示中の項目を未チェックに戻しますか？'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'issue'
                ? `現在未チェックの ${uncheckedItemIds.length} 件を問題ありにします。誤操作を防ぐため確認しています。`
                : `現在表示中の ${visibleItemIds.length} 件を未チェックへ戻します。`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setConfirmAction(null)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant={confirmAction === 'issue' ? 'destructive' : 'accent'}
              className="flex-1"
              onClick={() => {
                if (confirmAction === 'issue') applyBulkStatus('issue');
                if (confirmAction === 'clear') applyClear();
                setConfirmAction(null);
              }}
              data-testid="bulk-confirm"
            >
              実行する
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
