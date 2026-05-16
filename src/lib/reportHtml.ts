import type { BuiltReport } from './report';
import type { ItemStatus, Severity } from '@/data/schema';
import { formatDate } from './utils';
import { buildQrSvg } from '@/components/QrCode';
import { buildViewerUrl, viewerUrlByteLength } from './viewerUrl';

const statusLabel: Record<ItemStatus, string> = {
  ok: 'OK',
  issue: '問題あり',
  na: '対象外',
  unchecked: '未チェック',
};

const severityLabel: Record<Severity, string> = {
  critical: '必須',
  major: '標準',
  minor: '任意',
};

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function severityOrder(s?: Severity): number {
  return s === 'critical' ? 0 : s === 'major' ? 1 : s === 'minor' ? 2 : 3;
}

export async function generateHtmlReport(report: BuiltReport, options: { appUrl?: string } = {}): Promise<string> {
  const { template, snapshot, generatedAt, totals, entries, issueEntries } = report;
  const meta = snapshot.meta;
  const appUrl = options.appUrl ?? 'https://akhayash.github.io/tesla-delivery-checklist/';

  // Try to embed the snapshot (without media) in the QR so scanning opens a
  // read-only viewer with the actual results. QR alphanumeric/binary capacity
  // tops out around ~2,300 bytes for level M; if our payload exceeds that we
  // fall back to a plain app-link QR with a note.
  const viewerUrl = buildViewerUrl(appUrl, snapshot);
  const viewerLen = viewerUrlByteLength(appUrl, snapshot);
  const QR_MAX = 2200;
  const useViewer = viewerLen <= QR_MAX;
  const qrTarget = useViewer ? viewerUrl : appUrl;
  // Use lower ECC for the viewer URL (more capacity); the app-only URL stays
  // at M for sharper scanning.
  const qrSvg = await buildQrSvg(qrTarget, {
    size: 140,
    fg: '#0B0D0F',
    bg: '#FFFFFF',
  });

  const sortedIssues = [...issueEntries].sort(
    (a, b) => severityOrder(a.severity) - severityOrder(b.severity)
  );

  const issuesHtml = sortedIssues
    .map(
      (e) => `
    <section class="issue">
      <header>
        <span class="badge badge-${e.severity ?? 'minor'}">${severityLabel[e.severity ?? 'minor']}</span>
        <h3>${escape(e.title)}</h3>
        <span class="cat">${escape(e.category)}</span>
      </header>
      ${e.note ? `<p class="note">${escape(e.note).replace(/\n/g, '<br/>')}</p>` : ''}
      ${
        e.media.length > 0
          ? `<div class="gallery">${e.media
              .map((m) =>
                m.kind === 'image'
                  ? `<img src="${m.dataUrl}" alt="photo" />`
                  : `<video src="${m.dataUrl}" controls preload="metadata"></video>`
              )
              .join('')}</div>`
          : ''
      }
    </section>`
    )
    .join('\n');

  const allRows = entries
    .map(
      (e) => `
    <tr class="row row-${e.status}">
      <td>${escape(e.category)}</td>
      <td>${escape(e.title)}</td>
      <td>${severityLabel[e.severity ?? 'minor']}</td>
      <td><strong>${statusLabel[e.status]}</strong></td>
      <td>${e.note ? escape(e.note) : ''}</td>
    </tr>`
    )
    .join('');

  const totalsHtml = `
    <div class="totals">
      <span class="t-pill t-ok">OK <b>${totals.ok}</b></span>
      <span class="t-pill t-issue">問題 <b>${totals.issue}</b></span>
      <span class="t-pill t-na">対象外 <b>${totals.na}</b></span>
      <span class="t-pill t-un">未チェック <b>${totals.unchecked}</b></span>
      <span class="t-pill t-all">合計 <b>${totals.total}</b></span>
    </div>`;

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<title>Tesla 納車チェックレポート — ${escape(template.modelNameJa)}</title>
<meta name="generator" content="tesla-delivery-checklist" />
<style>
:root {
  --bg: #0B0D0F;
  --fg: #F5F5F7;
  --card: #171A20;
  --muted: #9CA0A6;
  --border: #27292D;
  --accent: #E31937;
  --ok: #12B981;
  --warn: #F59E0B;
}
* { box-sizing: border-box; }
html, body { background: var(--bg); color: var(--fg); margin: 0; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic UI', sans-serif; }
.container { max-width: 920px; margin: 0 auto; padding: 32px 24px 80px; }
header.hero { padding: 32px 0; border-bottom: 1px solid var(--border); }
.kicker { color: var(--muted); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
h1 { font-weight: 500; font-size: 28px; margin: 8px 0 4px; letter-spacing: -0.01em; }
.accent-line { width: 64px; height: 3px; background: var(--accent); margin: 16px 0; }
.meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 24px; margin-top: 16px; font-size: 14px; }
.meta-grid dt { color: var(--muted); font-size: 12px; }
.meta-grid dd { margin: 0 0 8px; }
.totals { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0; }
.t-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 13px; background: var(--card); border: 1px solid var(--border); }
.t-pill b { font-weight: 600; }
.t-ok b { color: var(--ok); }
.t-issue b { color: var(--accent); }
.t-na b { color: var(--muted); }
.t-un b { color: var(--warn); }
section.issues h2 { font-size: 18px; font-weight: 500; margin-top: 32px; }
section.issue { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; margin: 12px 0; }
section.issue header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
section.issue h3 { margin: 0; font-size: 16px; font-weight: 500; }
section.issue .cat { color: var(--muted); font-size: 12px; }
section.issue .note { white-space: pre-wrap; line-height: 1.6; margin: 12px 0 0; font-size: 14px; color: #DDD; }
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-top: 12px; }
.gallery img, .gallery video { width: 100%; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); background: #000; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.badge-critical { background: var(--accent); color: #fff; }
.badge-major { background: var(--warn); color: #1A1A1A; }
.badge-minor { background: var(--border); color: var(--fg); }
table.all { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
table.all th, table.all td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
table.all th { color: var(--muted); font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.row-ok td:nth-child(4) { color: var(--ok); }
.row-issue td:nth-child(4) { color: var(--accent); }
.row-na td:nth-child(4) { color: var(--muted); }
.row-unchecked td:nth-child(4) { color: var(--warn); }
.foot { color: var(--muted); font-size: 12px; margin-top: 36px; border-top: 1px solid var(--border); padding-top: 12px; }
.qr-wrap { margin-top: 24px; }
.qr-card { display: flex; gap: 16px; align-items: center; background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
.qr-svg { flex: 0 0 auto; background: #FFFFFF; padding: 8px; border-radius: 8px; width: 156px; height: 156px; display: flex; align-items: center; justify-content: center; }
.qr-svg svg { width: 140px; height: 140px; }
.qr-meta { flex: 1 1 auto; min-width: 0; }
.qr-title { margin: 0; font-size: 13px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
.qr-desc { margin: 6px 0 8px; font-size: 12px; line-height: 1.5; color: #DDD; }
.qr-url { margin: 0; font-size: 11px; word-break: break-all; color: var(--muted); font-family: ui-monospace, SFMono-Regular, monospace; }
.sign-row { display: none; }
details summary { cursor: pointer; color: var(--muted); margin: 16px 0 8px; }
@media print {
  html, body { background: #fff !important; color: #0B0D0F !important; }
  .container { max-width: 100%; padding: 12mm; }
  section.issue, .t-pill { background: #fff !important; border-color: #ccc !important; color: #0B0D0F !important; }
  .gallery img, .gallery video { border-color: #ccc !important; height: 120px; }
  .badge-minor { background: #eee !important; color: #0B0D0F !important; }
  details[open] > summary, details summary { color: #555 !important; }
  details { open: true; }
  .qr-card { background: #fff !important; border-color: #ccc !important; }
  .qr-title, .qr-desc, .qr-url { color: #0B0D0F !important; }
}
</style>
</head>
<body>
<div class="container">
  <header class="hero">
    <div class="kicker">Tesla Delivery Inspection Report</div>
    <h1>${escape(template.modelNameJa)}</h1>
    <div class="accent-line"></div>
    <dl class="meta-grid">
      <div><dt>レポート生成日時</dt><dd>${escape(formatDate(generatedAt))}</dd></div>
      <div><dt>チェック開始日時</dt><dd>${escape(formatDate(snapshot.startedAt))}</dd></div>
      <div><dt>VIN</dt><dd>${escape(meta.vin || '—')}</dd></div>
      <div><dt>納車場所</dt><dd>${escape(meta.deliveryLocation || '—')}</dd></div>
      <div><dt>オーナー</dt><dd>${escape(meta.ownerName || '—')}</dd></div>
      <div><dt>担当アドバイザー</dt><dd>${escape(meta.advisorName || '—')}</dd></div>
      <div><dt>ソフトウェアバージョン</dt><dd>${escape(meta.softwareVersion || '—')}</dd></div>
      <div><dt>テンプレートバージョン</dt><dd>${escape(template.version)}</dd></div>
    </dl>
  </header>

  ${totalsHtml}

  <section class="issues">
    <h2>問題があった項目 (${sortedIssues.length} 件)</h2>
    ${sortedIssues.length === 0 ? '<p style="color:var(--muted)">問題として記録された項目はありません。</p>' : issuesHtml}
  </section>

  <section>
    <h2>全項目の確認結果</h2>
    <table class="all">
      <thead>
        <tr><th>カテゴリ</th><th>項目</th><th>重要度</th><th>結果</th><th>メモ</th></tr>
      </thead>
      <tbody>${allRows}</tbody>
    </table>
  </section>

  <p class="foot">
    本レポートは <code>tesla-delivery-checklist</code> によって生成されました。<br/>
    写真・動画はすべて閲覧者の端末にのみ保存されています。第三者と共有する際は内容にご注意ください。
  </p>

  <section class="qr-wrap" aria-label="QR コード">
    <div class="qr-card">
      <div class="qr-svg">${qrSvg}</div>
      <div class="qr-meta">
        <p class="qr-title">${useViewer ? 'スマホでこの結果を見る' : 'アプリを開く'}</p>
        <p class="qr-desc">
          ${useViewer
            ? 'QR をスキャンするとブラウザでチェック結果（項目・ステータス・メモ）を閲覧できます。写真・動画はこの HTML レポートに含まれています。'
            : '結果データが QR の容量上限を超えたため、アプリ URL のみを格納しています。アプリ側で JSON インポート機能をご利用ください。'}
        </p>
        <p class="qr-url"><a href="${escape(qrTarget)}" target="_blank" rel="noopener" data-qr-url="${escape(qrTarget)}">${escape(qrTarget.length > 120 ? qrTarget.slice(0, 117) + '…' : qrTarget)}</a></p>
      </div>
    </div>
  </section>
</div>
</body>
</html>`;
}
