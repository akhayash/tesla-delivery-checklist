import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Check,
  CircleDashed,
  MinusCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { BuiltReport, ReportEntry } from '@/lib/report';
import type { Severity } from '@/data/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface Props {
  report: BuiltReport;
}

const severityLabel: Record<Severity, string> = {
  critical: '必須',
  major: '標準',
  minor: '任意',
};

const severityRank: Record<Severity, number> = { critical: 0, major: 1, minor: 2 };

/**
 * Native React preview of the delivery report.
 *
 * Layout principle: don't hide what matters. Problem items and unchecked
 * items are always visible because they're the report's purpose. OK / N/A
 * entries are kept behind a toggle so the report doesn't drown the reader
 * in 50+ "OK" lines — they exist for evidence, not for review.
 */
export function NativeReportPreview({ report }: Props) {
  const { template, snapshot, generatedAt, totals, entries, issueEntries } = report;
  const meta = snapshot.meta;

  const sortedIssues = useMemo(
    () =>
      [...issueEntries].sort(
        (a, b) => (severityRank[a.severity ?? 'minor'] ?? 9) - (severityRank[b.severity ?? 'minor'] ?? 9)
      ),
    [issueEntries]
  );

  const uncheckedEntries = useMemo(
    () => entries.filter((e) => e.status === 'unchecked'),
    [entries]
  );
  const okEntries = useMemo(() => entries.filter((e) => e.status === 'ok'), [entries]);
  const naEntries = useMemo(() => entries.filter((e) => e.status === 'na'), [entries]);

  const [showOk, setShowOk] = useState(false);
  const [showNa, setShowNa] = useState(false);

  return (
    <article className="space-y-6 px-4 py-5">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Tesla Delivery Inspection Report
        </p>
        <h2 className="font-display text-2xl font-light leading-tight">
          {template.modelNameJa}
        </h2>
        <div className="h-[3px] w-12 bg-accent" />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 text-[11px] sm:grid-cols-4">
          <Meta label="生成日時" value={formatDate(generatedAt)} />
          <Meta label="開始日時" value={formatDate(snapshot.startedAt)} />
          <Meta label="VIN" value={meta.vin || '—'} />
          <Meta label="納車場所" value={meta.deliveryLocation || '—'} />
          <Meta label="オーナー" value={meta.ownerName || '—'} />
          <Meta label="担当アドバイザー" value={meta.advisorName || '—'} />
          <Meta label="Software" value={meta.softwareVersion || '—'} />
          <Meta label="Template" value={`v${template.version}`} />
        </dl>
      </header>

      {/* Totals */}
      <section className="flex flex-wrap gap-2 tabular">
        <Badge variant="success" className="text-xs">
          <Check className="mr-1 h-3 w-3" />
          OK {totals.ok}
        </Badge>
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="mr-1 h-3 w-3" />
          問題 {totals.issue}
        </Badge>
        <Badge variant="muted" className="text-xs">
          <MinusCircle className="mr-1 h-3 w-3" />
          対象外 {totals.na}
        </Badge>
        <Badge variant="warning" className="text-xs">
          <CircleDashed className="mr-1 h-3 w-3" />
          未チェック {totals.unchecked}
        </Badge>
        <Badge variant="outline" className="text-xs">
          合計 {totals.total}
        </Badge>
      </section>

      {/* Issues */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-display text-lg">
          <AlertTriangle className="h-5 w-5 text-accent" />
          問題があった項目（{sortedIssues.length} 件）
        </h3>
        {sortedIssues.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            問題として記録された項目はありません。
          </p>
        ) : (
          <div className="space-y-3">
            {sortedIssues.map((e) => (
              <IssueCard key={e.itemId} entry={e} />
            ))}
          </div>
        )}
      </section>

      {/* Unchecked — highlighted as risk */}
      {uncheckedEntries.length > 0 && (
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 font-display text-lg">
            <CircleDashed className="h-5 w-5 text-warning" />
            未チェックの項目（{uncheckedEntries.length} 件）
            <span className="text-xs font-normal text-muted-foreground">
              — 受領前に再確認を推奨
            </span>
          </h3>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="divide-y divide-warning/15 p-0">
              {uncheckedEntries.map((e) => (
                <FlatRow key={e.itemId} entry={e} tone="warning" />
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* OK / NA — collapsible evidence */}
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowOk((v) => !v)}
            data-testid="toggle-ok"
          >
            {showOk ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            OK な項目 ({okEntries.length}) を{showOk ? '隠す' : '表示'}
          </Button>
          {naEntries.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNa((v) => !v)}
              data-testid="toggle-na"
            >
              {showNa ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              対象外 ({naEntries.length}) を{showNa ? '隠す' : '表示'}
            </Button>
          )}
        </div>

        {showOk && okEntries.length > 0 && (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {okEntries.map((e) => (
                <FlatRow key={e.itemId} entry={e} tone="ok" />
              ))}
            </CardContent>
          </Card>
        )}
        {showNa && naEntries.length > 0 && (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {naEntries.map((e) => (
                <FlatRow key={e.itemId} entry={e} tone="na" />
              ))}
            </CardContent>
          </Card>
        )}
      </section>

      <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">
        本レポートは tesla-delivery-checklist によって生成されました。
        写真・動画はすべて閲覧者の端末にのみ保存されています。
        第三者と共有する際は内容にご注意ください。
      </p>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular text-foreground">{value}</dd>
    </div>
  );
}

function IssueCard({ entry }: { entry: ReportEntry }) {
  return (
    <Card data-testid={`preview-issue-${entry.itemId}`}>
      <CardContent className="space-y-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityPill severity={entry.severity} />
          <h4 className="text-sm font-medium leading-snug">{entry.title}</h4>
        </div>
        <p className="text-[11px] text-muted-foreground">{entry.category}</p>
        {entry.note && (
          <p className="whitespace-pre-wrap rounded-md bg-secondary/40 p-2 text-xs leading-relaxed">
            {entry.note}
          </p>
        )}
        {entry.media.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {entry.media.map((m) => (
              <div
                key={m.id}
                className="aspect-square overflow-hidden rounded border border-border bg-black/40"
              >
                {m.kind === 'image' ? (
                  <img
                    src={m.dataUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={m.dataUrl}
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FlatRow({
  entry,
  tone,
}: {
  entry: ReportEntry;
  tone: 'ok' | 'na' | 'warning';
}) {
  const Icon =
    tone === 'ok' ? Check : tone === 'na' ? MinusCircle : CircleDashed;
  const iconClass =
    tone === 'ok'
      ? 'text-success'
      : tone === 'na'
        ? 'text-muted-foreground'
        : 'text-warning';
  return (
    <div className="flex items-start gap-2 px-3 py-2 text-xs">
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${iconClass}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{entry.title}</p>
        <p className="truncate text-[10px] text-muted-foreground">{entry.category}</p>
      </div>
      {entry.severity && (
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
          {severityLabel[entry.severity]}
        </span>
      )}
    </div>
  );
}

function SeverityPill({ severity }: { severity?: Severity }) {
  const s = severity ?? 'minor';
  const variant: 'destructive' | 'warning' | 'muted' =
    s === 'critical' ? 'destructive' : s === 'major' ? 'warning' : 'muted';
  return (
    <Badge variant={variant} className="text-[10px] uppercase tracking-wider">
      {severityLabel[s]}
    </Badge>
  );
}
