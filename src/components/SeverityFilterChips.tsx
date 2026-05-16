import { Button } from '@/components/ui/button';
import { useProgress } from '@/store/progress';
import { severityFilterMeta } from '@/lib/checklistScope';
import type { SeverityFilter } from '@/data/schema';
import { cn } from '@/lib/utils';

const MODES: SeverityFilter[] = ['critical', 'standard', 'all'];

/**
 * Compact 3-chip severity filter bar.
 * Rendered inside AppShell's sticky header on the checklist page so it
 * stays accessible while scrolling through items.
 */
export function SeverityFilterChips() {
  const severityFilter = useProgress((s) => s.severityFilter);
  const setSeverityFilter = useProgress((s) => s.setSeverityFilter);

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
              'h-9 flex-1 px-2 text-xs',
              active && 'shadow-[0_0_0_1px_hsl(var(--accent))]'
            )}
            role="radio"
            aria-checked={active}
            onClick={() => setSeverityFilter(mode)}
            data-testid={`checklist-filter-${mode}`}
            data-active={active}
          >
            {severityFilterMeta[mode].label}
          </Button>
        );
      })}
    </div>
  );
}
