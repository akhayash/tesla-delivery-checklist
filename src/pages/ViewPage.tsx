import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ClipboardCheck, FileBarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTemplate } from '@/data/templates';
import type { ChecklistSnapshot, ItemStatus, Severity } from '@/data/schema';
import { tryDecodeSnapshot } from '@/lib/viewerUrl';
import { formatDate } from '@/lib/utils';

const statusLabel: Record<ItemStatus, string> = {
  ok: 'OK',
  issue: '問題あり',
  na: '対象外',
  unchecked: '未確認',
};

const statusVariant: Record<ItemStatus, 'success' | 'destructive' | 'muted' | 'warning'> = {
  ok: 'success',
  issue: 'destructive',
  na: 'muted',
  unchecked: 'warning',
};

const severityLabel: Record<Severity, string> = {
  critical: '重大',
  major: '要対応',
  minor: '軽微',
};

export default function ViewPage() {
  const [params] = useSearchParams();
  const [snapshot, setSnapshot] = useState<ChecklistSnapshot | null>(null);
  const [decodeError, setDecodeError] = useState(false);

  useEffect(() => {
    const data = params.get('d');
    if (!data) {
      setDecodeError(true);
      return;
    }
    const decoded = tryDecodeSnapshot(data);
    if (!decoded) {
      setDecodeError(true);
      return;
    }
    setSnapshot(decoded);
  }, [params]);

  const template = useMemo(
    () => (snapshot ? getTemplate(snapshot.meta.modelId) : null),
    [snapshot]
  );

  const issues = useMemo(() => {
    if (!template || !snapshot) return [];
    const out: { title: string; category: string; severity?: Severity; note?: string }[] = [];
    for (const cat of template.categories) {
      for (const item of cat.items) {
        const s = snapshot.states[item.id];
        if (s?.status === 'issue') {
          out.push({
            title: item.title,
            category: cat.title,
            severity: item.severity,
            note: s.note,
          });
        }
      }
    }
    return out;
  }, [template, snapshot]);

  if (decodeError) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-accent" />
              共有データを読み取れませんでした
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              QR コードまたはリンクのデータが壊れているか、古い形式の可能性があります。
              送信元に再送をお願いするか、HTML レポートをそのままご覧ください。
            </p>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> ホームへ戻る
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!snapshot || !template) {
    return <p className="text-sm text-muted-foreground">読み込み中…</p>;
  }

  const meta = snapshot.meta;

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Shared Inspection — Read Only
        </p>
        <h1 className="mt-1 font-display text-2xl font-light leading-tight">
          {template.modelNameJa}
        </h1>
        <div className="mt-2 h-[3px] w-12 bg-accent" />
        <p className="mt-3 text-xs text-muted-foreground">
          このページは共有された納車チェック結果を読むだけのビューです。写真・動画は元の HTML レポートに含まれています。
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">納車情報</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Info label="VIN" value={meta.vin} />
          <Info label="納車場所" value={meta.deliveryLocation} />
          <Info label="オーナー" value={meta.ownerName} />
          <Info label="アドバイザー" value={meta.advisorName} />
          <Info label="ソフトウェア" value={meta.softwareVersion} />
          <Info label="開始日時" value={formatDate(snapshot.startedAt)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            問題があった項目
            <Badge variant="destructive" className="ml-2 align-middle">
              {issues.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">問題は記録されていません。</p>
          ) : (
            <ul className="divide-y divide-border">
              {issues.map((i, idx) => (
                <li key={idx} className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {i.severity && (
                      <Badge
                        variant={
                          i.severity === 'critical'
                            ? 'destructive'
                            : i.severity === 'major'
                              ? 'warning'
                              : 'muted'
                        }
                      >
                        {severityLabel[i.severity]}
                      </Badge>
                    )}
                    <span className="text-sm font-medium">{i.title}</span>
                    <Badge variant="muted" className="text-[10px]">
                      {i.category}
                    </Badge>
                  </div>
                  {i.note && (
                    <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                      {i.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">全項目の結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {template.categories.map((cat) => (
            <div key={cat.id}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {cat.title}
              </p>
              <Separator className="my-2" />
              <ul className="space-y-1.5 text-sm">
                {cat.items.map((item) => {
                  const s = snapshot.states[item.id];
                  const status: ItemStatus = s?.status ?? 'unchecked';
                  return (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <span className="flex-1">{item.title}</span>
                      <Badge variant={statusVariant[status]} className="shrink-0 text-[10px]">
                        {statusLabel[status]}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> アプリのホーム
          </Link>
        </Button>
        <Button asChild variant="accent">
          <Link to="/checklist">
            <ClipboardCheck className="h-4 w-4" /> 自分用にチェックする
          </Link>
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        <FileBarChart2 className="mb-0.5 mr-1 inline h-3 w-3" />
        共有された結果のみが表示されています。あなたのアプリ側のデータには影響しません。
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value || '—'}</dd>
    </div>
  );
}
