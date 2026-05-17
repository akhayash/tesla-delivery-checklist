import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '@/store/progress';
import { getTemplate } from '@/data/templates';
import { getScopedCategories } from '@/lib/checklistScope';
import { cn } from '@/lib/utils';

/**
 * Horizontal scrollable section navigator shown above the checklist.
 * Tapping a chip smoothly scrolls to the corresponding category section
 * (anchored by `id="section-<categoryId>"` rendered in ChecklistPage).
 *
 * Tracks the active category by observing which section is closest to
 * the top of the viewport, and auto-scrolls the chip strip so the
 * active chip stays visible.
 */
export function SectionNav() {
  const modelId = useProgress((s) => s.snapshot.meta.modelId);
  const severityFilter = useProgress((s) => s.severityFilter);
  const template = getTemplate(modelId);

  const scoped = useMemo(
    () => getScopedCategories(template, severityFilter),
    [template, severityFilter]
  );

  const [active, setActive] = useState<string | null>(scoped[0]?.id ?? null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Track current section via scroll position.
  useEffect(() => {
    if (scoped.length === 0) return;
    function update() {
      // Find the section whose top is closest to (but not past) the
      // sticky header threshold (~ 140 px from viewport top).
      const threshold = 160;
      let current: string | null = scoped[0]?.id ?? null;
      for (const c of scoped) {
        const el = document.getElementById(`section-${c.id}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) current = c.id;
      }
      setActive(current);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [scoped]);

  // Keep the active chip in view inside the horizontal scroller.
  useEffect(() => {
    if (!active) return;
    const chip = scrollerRef.current?.querySelector<HTMLElement>(
      `[data-section-chip="${active}"]`
    );
    chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active]);

  if (scoped.length <= 1) return null;

  return (
    <nav
      aria-label="セクションナビゲーション"
      className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      ref={scrollerRef}
      data-testid="section-nav"
    >
      <ol className="flex w-max items-center gap-1.5">
        {scoped.map((cat, idx) => {
          const isActive = active === cat.id;
          // Use only the leading "N." + first word(s) before delimiters so
          // chips stay compact on mobile.
          const shortTitle = compactTitle(cat.title, idx + 1);
          return (
            <li key={cat.id}>
              <button
                type="button"
                data-section-chip={cat.id}
                onClick={() => {
                  const el = document.getElementById(`section-${cat.id}`);
                  if (!el) return;
                  const y = el.getBoundingClientRect().top + window.scrollY - 140;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }}
                className={cn(
                  'whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors',
                  isActive
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border text-muted-foreground hover:border-accent/60 hover:text-foreground'
                )}
              >
                {shortTitle}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Convert "3. 外装ウォークアラウンド (フロント ▸ …)" to "3. 外装" for chip
 * display. We keep the leading numbering if present, otherwise inject one.
 * Splits at parenthesis or arrow delimiters but preserves internal spaces
 * (Japanese titles use ASCII spaces between number suffix and the noun,
 * e.g. "2 列目").
 */
function compactTitle(full: string, fallbackNum: number): string {
  const numMatch = full.match(/^\s*(\d+)\s*\.\s*(.*)$/);
  const n = numMatch ? numMatch[1] : String(fallbackNum);
  const rest = numMatch ? numMatch[2] : full;
  // Trim at the first delimiter that signals supplementary info.
  const truncated = rest.split(/[（(:：▸&/]/)[0] ?? rest;
  // Collapse runs of whitespace and trim ends.
  const compact = truncated.replace(/\s+/g, ' ').trim();
  return `${n}. ${compact}`;
}
