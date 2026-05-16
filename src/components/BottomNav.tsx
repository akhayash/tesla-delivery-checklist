import { NavLink } from 'react-router-dom';
import { ClipboardCheck, FileBarChart2, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', label: 'ホーム', icon: Home, end: true },
  { to: '/checklist', label: 'チェック', icon: ClipboardCheck },
  { to: '/summary', label: 'レポート', icon: FileBarChart2 },
  { to: '/settings', label: '設定', icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="safe-pb sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 no-print">
      <ul className="mx-auto grid max-w-screen-md grid-cols-4">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <it.icon className={cn('h-5 w-5', isActive && 'stroke-[2.3]')} />
                  <span>{it.label}</span>
                  {isActive && (
                    <span className="block h-0.5 w-6 -mt-0.5 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
