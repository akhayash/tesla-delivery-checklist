import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, MinusCircle } from 'lucide-react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChecklistItem, ItemStatus, Severity } from '@/data/schema';
import { useProgress } from '@/store/progress';
import { MediaCapture } from './MediaCapture';

const severityBadge: Record<Severity, { label: string; variant: 'destructive' | 'warning' | 'muted' }> = {
  critical: { label: '重大', variant: 'destructive' },
  major: { label: '要対応', variant: 'warning' },
  minor: { label: '軽微', variant: 'muted' },
};

export function ChecklistItemRow({ item }: { item: ChecklistItem }) {
  const state = useProgress((s) => s.snapshot.states[item.id]);
  const setStatus = useProgress((s) => s.setStatus);
  const setNote = useProgress((s) => s.setNote);

  const status: ItemStatus = state?.status ?? 'unchecked';
  const note = state?.note ?? '';
  const mediaIds = state?.mediaIds ?? [];
  const sev = item.severity ?? 'minor';

  const containerCls = useMemo(
    () =>
      cn(
        'rounded-lg border p-3 transition-colors',
        status === 'ok' && 'border-success/40 bg-success/5',
        status === 'issue' && 'border-accent/50 bg-accent/5',
        status === 'na' && 'border-border bg-secondary/30',
        status === 'unchecked' && 'border-border bg-card'
      ),
    [status]
  );

  return (
    <div className={containerCls} data-testid={`item-${item.id}`} data-status={status}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={severityBadge[sev].variant}>{severityBadge[sev].label}</Badge>
            <h4 className="text-sm font-medium leading-snug text-foreground">{item.title}</h4>
          </div>
          {item.description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <ToggleGroup
          type="single"
          value={status === 'unchecked' ? '' : status}
          onValueChange={(v) => {
            const nextStatus = ((v as ItemStatus) || 'unchecked') as ItemStatus;
            setStatus(item.id, nextStatus);
            if (nextStatus !== status) navigator.vibrate?.(10);
          }}
          className="w-full"
          variant="outline"
        >
          <ToggleGroupItem
            value="ok"
            className="min-h-11 flex-1 active:scale-95 transition-transform data-[state=on]:bg-success data-[state=on]:text-success-foreground"
            aria-label="OK"
          >
            <CheckCircle2 className="h-4 w-4" /> OK
          </ToggleGroupItem>
          <ToggleGroupItem
            value="issue"
            className="min-h-11 flex-1 active:scale-95 transition-transform data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            aria-label="問題あり"
          >
            <AlertTriangle className="h-4 w-4" /> 問題
          </ToggleGroupItem>
          <ToggleGroupItem
            value="na"
            className="min-h-11 flex-1 active:scale-95 transition-transform data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
            aria-label="対象外"
          >
            <MinusCircle className="h-4 w-4" /> 対象外
          </ToggleGroupItem>
        </ToggleGroup>
        {status !== 'unchecked' && (
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            選択中のボタンをもう一度タップすると未チェックに戻ります
          </p>
        )}
      </div>

      {(status === 'issue' || note || mediaIds.length > 0) && (
        <div className="mt-3 space-y-3" data-testid={`detail-${item.id}`}>
          <Textarea
            placeholder="メモ (問題の詳細・気になった点など)"
            value={note}
            onChange={(e) => setNote(item.id, e.target.value)}
            rows={2}
            className="min-h-11"
            data-testid={`note-${item.id}`}
          />
          <MediaCapture itemId={item.id} mediaIds={mediaIds} />
        </div>
      )}
    </div>
  );
}
