import { Outlet, useLocation } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { ProgressHeader } from './ProgressHeader';
import { SeverityFilterChips } from './SeverityFilterChips';
import { SectionNav } from './SectionNav';
import { useProgress } from '@/store/progress';

export function AppShell() {
  const loc = useLocation();
  const showProgress = loc.pathname.startsWith('/checklist') || loc.pathname === '/summary';
  const showFilterChips = loc.pathname.startsWith('/checklist');
  const migrationWarning = useProgress((s) => s.migrationWarning);
  const dismissMigrationWarning = useProgress((s) => s.dismissMigrationWarning);

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <header className="app-header safe-pt sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur no-print">
        <div className="mx-auto flex max-w-screen-md items-center justify-between px-4 pb-3 pt-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-base font-medium tracking-wide">
              TESLA
              <span className="ml-1 inline-block h-1 w-1 rounded-full bg-accent align-middle" />
            </span>
            <span className="text-xs text-muted-foreground">納車チェックリスト</span>
          </div>
        </div>
        {showProgress && (
          <div className="mx-auto max-w-screen-md px-4 pb-3">
            <ProgressHeader />
          </div>
        )}
        {showFilterChips && (
          <div className="mx-auto max-w-screen-md px-4 pb-3">
            <SeverityFilterChips />
          </div>
        )}
        {showFilterChips && (
          <div className="mx-auto max-w-screen-md px-4 pb-2">
            <SectionNav />
          </div>
        )}
        {migrationWarning && (
          <div className="border-t border-warning/30 bg-warning/10">
            <div className="mx-auto flex max-w-screen-md items-start gap-3 px-4 py-3 text-xs text-warning-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="flex-1">{migrationWarning}</p>
              <button
                type="button"
                onClick={dismissMigrationWarning}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-black/10 hover:text-foreground"
                aria-label="移行警告を閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-screen-md flex-1 px-4 py-5">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
