import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/store/progress';
import { getTemplate } from '@/data/templates';
import { getScopedStats, severityFilterMeta } from '@/lib/checklistScope';

export function ProgressHeader() {
  const snapshot = useProgress((s) => s.snapshot);
  const severityFilter = useProgress((s) => s.severityFilter);
  const template = getTemplate(snapshot.meta.modelId);

  const stats = useMemo(() => {
    const scoped = getScopedStats(template, snapshot, severityFilter);
    const pct = scoped.total === 0 ? 0 : Math.round((scoped.checked / scoped.total) * 100);
    return { ...scoped, pct };
  }, [severityFilter, snapshot, template]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="tabular">
          進捗 <strong className="text-foreground">{stats.checked}</strong> / {stats.total}
          <span className="ml-3">{severityFilterMeta[severityFilter].label}</span>
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
