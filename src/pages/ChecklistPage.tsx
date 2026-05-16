import { useEffect, useMemo, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { getTemplate } from '@/data/templates';
import { useProgress } from '@/store/progress';
import { ChecklistItemRow } from '@/components/ChecklistItemRow';

export default function ChecklistPage() {
  const snapshot = useProgress((s) => s.snapshot);
  const lastCheckedItemId = useProgress((s) => s.lastCheckedItemId);
  const template = getTemplate(snapshot.meta.modelId);
  const didScrollRef = useRef(false);

  // Count totals for badges
  const counts = useMemo(() => {
    const c: Record<string, { total: number; checked: number; issues: number }> = {};
    for (const cat of template.categories) {
      let total = 0;
      let checked = 0;
      let issues = 0;
      for (const item of cat.items) {
        total++;
        const st = snapshot.states[item.id]?.status;
        if (st && st !== 'unchecked') checked++;
        if (st === 'issue') issues++;
      }
      c[cat.id] = { total, checked, issues };
    }
    return c;
  }, [snapshot, template]);

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
    // Wait one frame for the DOM to settle
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-testid="item-${lastCheckedItemId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, [lastCheckedItemId]);

  // Warn before closing if any items are checked (protect against accidental close)
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (checkedItems > 0) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [checkedItems]);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display text-xl">{template.modelNameJa}</h2>
        <p className="text-xs text-muted-foreground">
          項目をタップして OK / 問題 / 対象外 を記録。問題ありの項目には写真や動画を添付できます。
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

      <Accordion type="multiple" defaultValue={template.categories.map((c) => c.id)}>
        {template.categories.map((cat) => {
          const c = counts[cat.id];
          return (
            <AccordionItem key={cat.id} value={cat.id} data-testid={`cat-${cat.id}`}>
              <AccordionTrigger>
                <div className="flex flex-1 items-center justify-between gap-3 pr-2">
                  <span>{cat.title}</span>
                  <span className="flex items-center gap-1.5">
                    {c.issues > 0 && (
                      <Badge variant="destructive">問題 {c.issues}</Badge>
                    )}
                    <Badge variant="muted" className="tabular">
                      {c.checked}/{c.total}
                    </Badge>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <ChecklistItemRow key={item.id} item={item} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
