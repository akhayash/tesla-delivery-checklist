import { useEffect, useState } from 'react';
import * as React from 'react';
import {
  AlertTriangle,
  FileCode2,
  Mail,
  Printer,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useProgress } from '@/store/progress';
import { getTemplate } from '@/data/templates';
import { buildReport, type BuiltReport } from '@/lib/report';
import { generateHtmlReport } from '@/lib/reportHtml';
import { buildMailto } from '@/lib/reportMailto';
import { canShareFiles, shareReport } from '@/lib/shareApi';
import { getAppUrl } from '@/lib/appUrl';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

function ts() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export default function SummaryPage() {
  const snapshot = useProgress((s) => s.snapshot);
  const setMeta = useProgress((s) => s.setMeta);
  const template = getTemplate(snapshot.meta.modelId);

  const [report, setReport] = useState<BuiltReport | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setBusy(true);
    buildReport(template, snapshot, { includeMedia: true })
      .then((r) => {
        if (active) setReport(r);
      })
      .finally(() => active && setBusy(false));
    return () => {
      active = false;
    };
  }, [template, snapshot]);

  async function handleMailto() {
    if (!report) return;
    const url = buildMailto(report);
    window.location.href = url;
  }

  async function handleShare() {
    if (!report) return;
    const html = await generateHtmlReport(report, { appUrl: getAppUrl() });
    const file = new File([html], `tesla-delivery-report-${ts()}.html`, {
      type: 'text/html',
    });
    if (canShareFiles([file])) {
      const ok = await shareReport({
        title: `Tesla 納車チェック — ${template.modelName}`,
        text: '納車チェックレポートです。',
        files: [file],
      });
      if (!ok) toast.error('共有に失敗しました');
    } else {
      toast.info('この環境では共有 API が使えません。HTML をダウンロードしてください。');
    }
  }

  async function handlePrint() {
    if (!report) return;
    const html = await generateHtmlReport(report, { appUrl: getAppUrl() });
    const w = window.open('', '_blank');
    if (!w) {
      toast.error('ポップアップがブロックされました。設定で許可してください。');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 400);
  }

  const totals = report?.totals;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl">レポート</h2>
        <p className="text-xs text-muted-foreground">
          現在の状態を集計して、共有・印刷用のレポートを生成します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">納車情報 (任意)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="VIN"
            value={snapshot.meta.vin ?? ''}
            onChange={(v) => setMeta({ vin: v })}
            placeholder="LRWY××××××××××××××"
          />
          <Field
            label="納車場所"
            value={snapshot.meta.deliveryLocation ?? ''}
            onChange={(v) => setMeta({ deliveryLocation: v })}
            placeholder="Tesla ○○ デリバリーセンター"
          />
          <Field
            label="オーナー名"
            value={snapshot.meta.ownerName ?? ''}
            onChange={(v) => setMeta({ ownerName: v })}
            placeholder="あなたのお名前"
          />
          <Field
            label="担当アドバイザー"
            value={snapshot.meta.advisorName ?? ''}
            onChange={(v) => setMeta({ advisorName: v })}
            placeholder="アドバイザー氏名"
          />
          <Field
            label="ソフトウェアバージョン"
            value={snapshot.meta.softwareVersion ?? ''}
            onChange={(v) => setMeta({ softwareVersion: v })}
            placeholder="2025.xx.x"
          />
          <Field
            label="納車日 (任意)"
            value={snapshot.meta.deliveryDate ?? ''}
            onChange={(v) => setMeta({ deliveryDate: v })}
            placeholder="YYYY-MM-DD"
          />
        </CardContent>
      </Card>

      {totals && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">集計</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 tabular">
            <Badge variant="success">OK {totals.ok}</Badge>
            <Badge variant="destructive">問題 {totals.issue}</Badge>
            <Badge variant="muted">対象外 {totals.na}</Badge>
            <Badge variant="warning">未チェック {totals.unchecked}</Badge>
            <Badge variant="outline">合計 {totals.total}</Badge>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">問題があった項目</CardTitle>
        </CardHeader>
        <CardContent>
          {!report || report.issueEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">問題は記録されていません。</p>
          ) : (
            <ul className="divide-y divide-border">
              {report.issueEntries.map((e) => (
                <li key={e.itemId} className="py-3" data-testid={`issue-${e.itemId}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{e.title}</span>
                    <Badge variant="muted" className="text-[10px]">
                      {e.category}
                    </Badge>
                  </div>
                  {e.note && (
                    <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                      {e.note}
                    </p>
                  )}
                  {e.media.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                      {e.media.slice(0, 12).map((m) => (
                        <div
                          key={m.id}
                          className="aspect-square overflow-hidden rounded border border-border bg-black/40"
                        >
                          {m.kind === 'image' ? (
                            <img
                              src={m.dataUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <video
                              src={m.dataUrl}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">出力</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="accent" className="w-full" data-testid="preview-btn">
            <Link to="/report/preview">
              <FileCode2 className="h-4 w-4" /> HTML レポートをプレビュー
            </Link>
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={handlePrint} disabled={busy} variant="outline" data-testid="export-print">
              <Printer className="h-4 w-4" /> 印刷 / PDF
            </Button>
            <Button onClick={handleMailto} disabled={busy} variant="outline" data-testid="export-mail">
              <Mail className="h-4 w-4" /> メール
            </Button>
            <Button onClick={handleShare} disabled={busy} variant="outline" data-testid="export-share">
              <Share2 className="h-4 w-4" /> 共有
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground">
        最終更新: {formatDate(snapshot.updatedAt)} ・ テンプレート v{template.version}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = React.useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
