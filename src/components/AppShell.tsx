import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ProgressHeader } from './ProgressHeader';

export function AppShell() {
  const loc = useLocation();
  const showProgress = loc.pathname.startsWith('/checklist') || loc.pathname === '/summary';

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
      </header>
      <main className="mx-auto w-full max-w-screen-md flex-1 px-4 py-5">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
