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
import { NativeReportPreview } from '@/components/NativeReportPreview';
import { toast } from 'sonner';

function ts() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export default function ReportPreviewPage() {
  const snapshot = useProgress((s) => s.snapshot);
  const template = getTemplate(snapshot.meta.modelId);
  const previewRef = useRef<HTMLDivElement>(null);

  const [report, setReport] = useState<BuiltReport | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let active = true;
    setBusy(true);
    buildReport(template, snapshot, { includeMedia: true })
      .then((r) => {
        if (!active) return;
        setReport(r);
        setBusy(false);
      })
      .catch(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [template, snapshot]);

  async function handleDownload() {
    if (!report) return;
    const html = await generateHtmlReport(report, { appUrl: getAppUrl() });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, `tesla-delivery-report-${ts()}.html`);
    toast.success('HTML レポートをダウンロードしました');
  }

  async function handlePrint() {
    if (!report) {
      toast.error('レポートを生成中です。少し待ってからお試しください。');
      return;
    }
    // For PDF download we open the self-contained HTML report in a new tab
    // and trigger print. Browser's "Save as PDF" gives a high-fidelity output
    // with the full layout (including QR + media).
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
    }, 500);
  }

  function handleMailto() {
    if (!report) return;
    const url = buildMailto(report);
    window.location.href = url;
  }

  return (
    <div
      className="-mx-4 -my-5 flex flex-col"
      style={{ minHeight: 'calc(100vh - 57px)' }}
      data-testid="preview-root"
    >
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-background/90 px-4 py-2 backdrop-blur">
        <Button asChild variant="ghost" size="sm">
          <Link to="/summary">
            <ArrowLeft className="h-4 w-4" /> 戻る
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
            <Download className="h-4 w-4" /> HTML
          </Button>
          <Button
            onClick={handlePrint}
            disabled={busy}
            variant="outline"
            size="sm"
            data-testid="preview-print"
          >
            <Printer className="h-4 w-4" /> PDF
          </Button>
          <Button
            onClick={handleMailto}
            disabled={busy || !report}
            variant="outline"
            size="sm"
            data-testid="preview-mail"
          >
            <Mail className="h-4 w-4" /> メール
          </Button>
        </div>
      </div>

      {/* Native React preview */}
      <div ref={previewRef} className="flex-1" data-testid="preview-native">
        {busy && (
          <p className="p-4 text-sm text-muted-foreground">レポートを生成中...</p>
        )}
        {report && <NativeReportPreview report={report} />}
      </div>
    </div>
  );
}
