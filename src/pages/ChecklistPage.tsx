import { useMemo } from 'react';
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
  const template = getTemplate(snapshot.meta.modelId);

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

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display text-xl">{template.modelNameJa}</h2>
        <p className="text-xs text-muted-foreground">
          項目をタップして OK / 問題 / 対象外 を記録。問題ありの項目には写真や動画を添付できます。
        </p>
      </div>

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
