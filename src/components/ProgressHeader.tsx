import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/store/progress';
import { getTemplate } from '@/data/templates';

export function ProgressHeader() {
  const snapshot = useProgress((s) => s.snapshot);
  const template = getTemplate(snapshot.meta.modelId);

  const stats = useMemo(() => {
    let total = 0;
    let checked = 0;
    let issues = 0;
    for (const c of template.categories) {
      for (const item of c.items) {
        total++;
        const st = snapshot.states[item.id]?.status;
        if (st && st !== 'unchecked') checked++;
        if (st === 'issue') issues++;
      }
    }
    const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
    return { total, checked, issues, pct };
  }, [snapshot, template]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="tabular">
          進捗 <strong className="text-foreground">{stats.checked}</strong> / {stats.total}
          {stats.issues > 0 && (
            <span className="ml-3 text-accent">問題 {stats.issues}</span>
          )}
        </span>
        <span className="tabular font-medium text-foreground">{stats.pct}%</span>
      </div>
      <Progress value={stats.pct} />
    </div>
  );
}
