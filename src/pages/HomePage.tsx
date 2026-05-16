import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Camera,
  ClipboardCheck,
  FileBarChart2,
  QrCode as QrIcon,
  Copy,
  Check,
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QrCode } from '@/components/QrCode';
import { getAppUrl } from '@/lib/appUrl';
import { getTemplate, listTemplates } from '@/data/templates';
import { useProgress } from '@/store/progress';
import { severityFilterMeta } from '@/lib/checklistScope';
import { toast } from 'sonner';

export default function HomePage() {
  const modelId = useProgress((s) => s.snapshot.meta.modelId);
  const severityFilter = useProgress((s) => s.severityFilter);
  const snapshot = useProgress((s) => s.snapshot);
  const lastCheckedItemId = useProgress((s) => s.lastCheckedItemId);
  const template = getTemplate(modelId);
  const templates = listTemplates();
  const switchModel = useProgress((s) => s.switchModel);
  const setSeverityFilter = useProgress((s) => s.setSeverityFilter);
  const [copied, setCopied] = useState(false);
  const appUrl = getAppUrl();

  // Calculate overall progress for resume CTA
  const { totalItems, checkedItems } = useMemo(() => {
    let total = 0;
    let checked = 0;
    for (const cat of template.categories) {
      for (const item of cat.items) {
        total++;
        const st = snapshot.states[item.id]?.status;
        if (st && st !== 'unchecked') checked++;
      }
    }
    return { totalItems: total, checkedItems: checked };
  }, [snapshot, template]);

  const hasProgress = checkedItems > 0 && lastCheckedItemId;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast.success('URL をコピーしました');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('クリップボードへのコピーに失敗しました');
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inspection App</p>
        <h1 className="mt-2 text-3xl font-display font-light leading-tight">
          Tesla 納車を、<br />落ち着いて確認しましょう。
        </h1>
        <div className="mt-3 h-[3px] w-14 bg-accent" />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          車種ごとのチェックリストに沿って、外装・内装・機能・書類を 1 つずつ確認。
          問題があった項目は写真・動画・メモを添付し、その場で共有用のレポートを生成します。
        </p>
      </section>

      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="vehicle-info" className="border-b-0">
            <AccordionTrigger className="px-6 py-4 text-sm font-medium" data-testid="vehicle-info-trigger">
              車両情報
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-display text-lg">{template.modelNameJa}</p>
                  <p className="text-xs text-muted-foreground">
                    テンプレート v{template.version}
                    {template.market && <> · {template.market}</>}
                  </p>
                </div>
                {template.specs && (
                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    <Spec label="ホイールベース" value={`${template.specs.wheelbaseMm} mm`} />
                    <Spec label="全長×全幅×全高" value={`${template.specs.lengthMm} × ${template.specs.widthMm} × ${template.specs.heightMm} mm`} />
                    <Spec label="車重" value={`約 ${template.specs.curbWeightKg} kg`} />
                    <Spec label="乗車定員" value={`${template.specs.seats} 名`} />
                    <Spec label="駆動" value={template.specs.drivetrain ?? '—'} />
                  </dl>
                )}
                <div className="flex flex-wrap gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.modelId}
                      onClick={() => switchModel(t.modelId)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground data-[active=true]:border-accent data-[active=true]:text-accent"
                      data-active={t.modelId === modelId}
                    >
                      {t.modelName}
                    </button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>チェック範囲</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            忙しいときは重大項目だけに絞って開始できます。選択はこの端末に保存されます。
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(['critical', 'standard', 'all'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSeverityFilter(mode)}
                className="rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-accent hover:bg-secondary/40 data-[active=true]:border-accent data-[active=true]:bg-accent/5"
                data-active={severityFilter === mode}
                data-testid={`severity-${mode}`}
              >
                <p className="text-sm font-medium">{severityFilterMeta[mode].label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {severityFilterMeta[mode].description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {hasProgress ? (
          <>
            <Button asChild size="lg" variant="accent" className="h-14 text-base" data-testid="resume-cta">
              <Link to="/checklist">
                <PlayCircle className="h-5 w-5" />
                前回の続きから ({checkedItems} 件目 / 残り {totalItems - checkedItems} 件)
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs text-muted-foreground">
              <Link to="/checklist">
                <ClipboardCheck className="h-4 w-4" /> 最初から確認
              </Link>
            </Button>
          </>
        ) : (
          <Button asChild size="lg" variant="accent" className="h-14 text-base">
            <Link to="/checklist">
              <ClipboardCheck className="h-5 w-5" /> チェックを開始 <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        )}
        <div className="grid grid-cols-3 gap-3">
          <Button asChild variant="outline">
            <Link to="/report/preview">
              <FileBarChart2 className="h-4 w-4" /> レポート
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/settings">設定 / データ</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="qr-open">
                <QrIcon className="h-4 w-4" /> QR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>このアプリを共有</DialogTitle>
                <DialogDescription>
                  スマホでスキャンしてアプリを開けます。ホーム画面に追加すれば PWA として使えます。
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-xl bg-white p-3" data-testid="qr-image">
                  <QrCode value={appUrl} size={224} fg="#0B0D0F" bg="#FFFFFF" />
                </div>
                <code className="break-all rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
                  {appUrl}
                </code>
                <Button onClick={copyLink} variant="outline" className="w-full" data-testid="qr-copy">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'コピーしました' : 'URL をコピー'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Tip icon={Camera} title="撮影は片手で" body="OS 純正カメラを起動。フラッシュ・Night Mode も普段通り。" />
        <Tip icon={ShieldCheck} title="完全ローカル保存" body="写真・動画・メモは端末にのみ。リポジトリへは送信しません。" />
        <Tip icon={FileBarChart2} title="共有しやすく" body="自己完結 HTML / PDF / メールでレポート化。" />
      </div>

      <p className="text-[11px] text-muted-foreground">
        ※ チェックリストはコミュニティの一般的な観点と Wikipedia の Model Y L 仕様を参考にした
        ドラフトです。最終的には Tesla 公式情報も併せてご確認ください。
      </p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-secondary/40 p-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium tabular">{value}</dd>
    </div>
  );
}

function Tip({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

// Lint helper (unused import guard avoided)
void Badge;
