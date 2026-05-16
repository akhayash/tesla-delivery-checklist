import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/store/progress';
import { getScopedItemIds, severityFilterMeta } from '@/lib/checklistScope';
import type { SeverityFilter } from '@/data/schema';
import { cn } from '@/lib/utils';
import { getTemplate } from '@/data/templates';

const MODES: SeverityFilter[] = ['critical', 'standard', 'all'];

/**
 * Compact 3-chip severity filter bar.
 * Rendered inside AppShell's sticky header on the checklist page so it
 * stays accessible while scrolling through items.
 */
export function SeverityFilterChips() {
  const severityFilter = useProgress((s) => s.severityFilter);
  const setSeverityFilter = useProgress((s) => s.setSeverityFilter);
  const modelId = useProgress((s) => s.snapshot.meta.modelId);
  const template = getTemplate(modelId);

  const counts = useMemo(
    () => ({
      critical: getScopedItemIds(template, 'critical').length,
      standard: getScopedItemIds(template, 'standard').length,
      all: getScopedItemIds(template, 'all').length,
    }),
    [template]
  );

  return (
    <div className="flex w-full items-center gap-1.5" role="radiogroup" aria-label="重要度フィルタ">
      {MODES.map((mode) => {
        const active = severityFilter === mode;
        return (
          <Button
            key={mode}
            type="button"
            size="sm"
            variant={active ? 'accent' : 'outline'}
            className={cn(
              'min-h-11 flex-1 px-2 text-xs',
              active && 'shadow-[0_0_0_1px_hsl(var(--accent))]'
            )}
            role="radio"
            aria-checked={active}
            onClick={() => setSeverityFilter(mode)}
            data-testid={`checklist-filter-${mode}`}
            data-active={active}
          >
            {severityFilterMeta[mode].label}
            <span
              className={cn(
                'tabular-nums text-[11px] text-muted-foreground',
                active && 'text-accent-foreground/90'
              )}
            >
              ({counts[mode]})
            </span>
          </Button>
        );
      })}
    </div>
  );
}
