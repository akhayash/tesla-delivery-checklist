import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Download,
  RefreshCw,
  Upload,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useProgress } from '@/store/progress';
import { exportJson, importJson, type JsonExport } from '@/lib/reportJson';
import { downloadBlob } from '@/lib/shareApi';
import { getStorageUsage, listAllMedia, deleteMany, type StoredMedia } from '@/store/media';
import { getTemplate } from '@/data/templates';
import { fileSize } from '@/lib/utils';
import { toast } from 'sonner';

/** Media grouped by itemId with totals. */
interface MediaGroup {
  itemId: string;
  title: string;
  count: number;
  totalSize: number;
  mediaIds: string[];
}

export default function SettingsPage() {
  const snapshot = useProgress((s) => s.snapshot);
  const reset = useProgress((s) => s.reset);
  const importSnapshot = useProgress((s) => s.importSnapshot);
  const [usage, setUsage] = useState<{ used: number; quota: number } | null>(null);
  const [mediaCount, setMediaCount] = useState(0);
  const [mediaGroups, setMediaGroups] = useState<MediaGroup[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);

  const template = getTemplate(snapshot.meta.modelId);

  // Build a title lookup from the template
  const itemTitleMap = new Map<string, string>(
    template.categories.flatMap((cat) => cat.items.map((item) => [item.id, item.title]))
  );

  async function refreshMedia() {
    const [usageResult, allMedia] = await Promise.all([getStorageUsage(), listAllMedia()]);
    setUsage(usageResult);
    setMediaCount(allMedia.length);

    // Group by itemId
    const groups = new Map<string, StoredMedia[]>();
    for (const m of allMedia) {
      if (!groups.has(m.itemId)) groups.set(m.itemId, []);
      groups.get(m.itemId)!.push(m);
    }
    const built: MediaGroup[] = [];
    groups.forEach((items, itemId) => {
      built.push({
        itemId,
        title: itemTitleMap.get(itemId) ?? itemId,
        count: items.length,
        totalSize: items.reduce((s, m) => s + m.size, 0),
        mediaIds: items.map((m) => m.id),
      });
    });
    built.sort((a, b) => b.totalSize - a.totalSize);
    setMediaGroups(built);
  }

  useEffect(() => {
    void refreshMedia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  async function handleExport() {
    const j = await exportJson(snapshot, { includeMedia: true });
    const blob = new Blob([JSON.stringify(j, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    downloadBlob(blob, `tesla-delivery-backup-${Date.now()}.json`);
    toast.success('バックアップを保存しました');
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text();
      const json = JSON.parse(text) as JsonExport;
      const snap = await importJson(json);
      importSnapshot(snap);
      toast.success('インポートしました');
    } catch (e) {
      console.error(e);
      toast.error('インポートに失敗しました');
    }
  }

  async function clearAllMedia() {
    const list = await listAllMedia();
    await deleteMany(list.map((m) => m.id));
    setMediaCount(0);
    setMediaGroups([]);
    toast.success(`${list.length} 件のメディアを削除しました`);
  }

  async function clearItemMedia(group: MediaGroup) {
    await deleteMany(group.mediaIds);
    toast.success(`「${group.title}」のメディア ${group.count} 件を削除しました`);
    await refreshMedia();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl">設定 / データ</h2>
        <p className="text-xs text-muted-foreground">
          バックアップ・データ削除・容量を管理します。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">バックアップ / 復元</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleExport} variant="outline" className="w-full">
            <Download className="h-4 w-4" /> JSON でバックアップ (写真含む)
          </Button>
          <label className="block">
            <Button asChild variant="outline" className="w-full">
              <span>
                <Upload className="h-4 w-4" /> JSON から復元
                <input
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImport(f);
                  }}
                />
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ストレージ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">保存メディア</span>
            <span className="tabular">{mediaCount} 件</span>
          </div>
          {usage && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">使用容量</span>
                <span className="tabular">{fileSize(usage.used)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">利用可能</span>
                <span className="tabular">{fileSize(usage.quota)}</span>
              </div>
              {usage.quota > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">使用率</span>
                  <span className={`tabular font-medium ${usage.used / usage.quota > 0.8 ? 'text-accent' : ''}`}>
                    {Math.round((usage.used / usage.quota) * 100)}%
                  </span>
                </div>
              )}
            </>
          )}
          <Separator />
          {mediaGroups.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">項目別メディア</p>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {mediaGroups.map((g) => (
                  <div key={g.itemId} className="flex items-center justify-between gap-2 text-xs">
                    <span className="min-w-0 flex-1 truncate" title={g.title}>{g.title}</span>
                    <span className="shrink-0 text-muted-foreground tabular">
                      {g.count} 件 · {fileSize(g.totalSize)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 shrink-0 px-1.5 text-muted-foreground hover:text-accent"
                      onClick={() => clearItemMedia(g)}
                      aria-label={`${g.title} のメディアを削除`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
            </div>
          )}
          <Button onClick={clearAllMedia} variant="outline" className="w-full">
            すべてのメディアを削除
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-accent">
            <AlertTriangle className="mb-0.5 mr-1 inline h-4 w-4" />
            危険ゾーン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setConfirmReset(true)}
            variant="destructive"
            className="w-full"
            data-testid="reset-btn"
          >
            <RefreshCw className="h-4 w-4" /> チェックをすべてリセット
          </Button>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground">
        本アプリは写真・動画・メモを端末のローカルストレージにのみ保存します。
        外部サーバーへの送信はありません。
      </p>

      <p className="text-center text-[10px] text-muted-foreground/70 tabular">
        tesla-delivery-checklist v{__APP_VERSION__}
      </p>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>チェックをすべてリセットしますか？</DialogTitle>
            <DialogDescription>
              この操作は取り消せません。先にバックアップ JSON を出力することをおすすめします。
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setConfirmReset(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                reset();
                setConfirmReset(false);
                toast.success('リセットしました');
              }}
              data-testid="reset-confirm"
            >
              リセット
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
