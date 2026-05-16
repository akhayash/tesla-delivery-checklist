import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/store/progress';
import { getTemplate } from '@/data/templates';
import { buildReport, type BuiltReport } from '@/lib/report';
import { generateHtmlReport } from '@/lib/reportHtml';
import { buildMailto } from '@/lib/reportMailto';
import { downloadBlob } from '@/lib/shareApi';
import { getAppUrl } from '@/lib/appUrl';
import { toast } from 'sonner';

function ts() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export default function ReportPreviewPage() {
  const snapshot = useProgress((s) => s.snapshot);
  const template = getTemplate(snapshot.meta.modelId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [report, setReport] = useState<BuiltReport | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let active = true;
    setBusy(true);
    buildReport(template, snapshot, { includeMedia: true })
      .then(async (r) => {
        if (!active) return;
        setReport(r);
        const h = await generateHtmlReport(r, { appUrl: getAppUrl() });
        if (active) {
          setHtml(h);
          setBusy(false);
        }
      })
      .catch(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [template, snapshot]);

  function handleDownload() {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, `tesla-delivery-report-${ts()}.html`);
    toast.success('HTML レポートをダウンロードしました');
  }

  function handlePrint() {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else {
      toast.error('プレビューの読み込みが完了していません。');
    }
  }

  function handleMailto() {
    if (!report) return;
    const url = buildMailto(report);
    window.location.href = url;
  }

  return (
    <div className="-mx-4 -my-5 flex flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/summary">
            <ArrowLeft className="h-4 w-4" /> レポートに戻る
          </Link>
        </Button>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button
            onClick={handleDownload}
            disabled={busy}
            variant="accent"
            size="sm"
            data-testid="preview-download-html"
          >
            <Download className="h-4 w-4" /> HTML としてダウンロード
          </Button>
          <Button
            onClick={handlePrint}
            disabled={busy}
            variant="outline"
            size="sm"
            data-testid="preview-print"
          >
            <Printer className="h-4 w-4" /> PDF としてダウンロード
          </Button>
          <Button
            onClick={handleMailto}
            disabled={busy || !report}
            variant="outline"
            size="sm"
            data-testid="preview-mail"
          >
            <Mail className="h-4 w-4" /> メールで送信
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-hidden">
        {busy && (
          <p className="p-4 text-sm text-muted-foreground">レポートを生成中...</p>
        )}
        {html && (
          <iframe
            ref={iframeRef}
            srcDoc={html}
            sandbox="allow-same-origin"
            className="h-full w-full border-0"
            title="HTML レポートプレビュー"
            data-testid="preview-iframe"
          />
        )}
      </div>
    </div>
  );
}
