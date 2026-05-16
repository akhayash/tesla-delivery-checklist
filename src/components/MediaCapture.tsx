import { useEffect, useState } from 'react';
import { Camera, Film, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resizeImage } from '@/lib/imageResize';
import { saveMedia, getMedia, deleteMedia, type StoredMedia } from '@/store/media';
import { useProgress } from '@/store/progress';
import { fileSize } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  itemId: string;
  mediaIds: string[];
}

export function MediaCapture({ itemId, mediaIds }: Props) {
  const addMedia = useProgress((s) => s.addMedia);
  const removeMedia = useProgress((s) => s.removeMedia);
  const [busy, setBusy] = useState(false);
  const [media, setMedia] = useState<StoredMedia[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await Promise.all(mediaIds.map(getMedia));
      if (alive) setMedia(list.filter(Boolean) as StoredMedia[]);
    })();
    return () => {
      alive = false;
    };
  }, [mediaIds]);

  async function handleFiles(files: FileList | null, kind: 'image' | 'video') {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        let blob: Blob = file;
        let size = file.size;
        if (kind === 'image') {
          try {
            blob = await resizeImage(file, 1600, 0.85);
            size = blob.size;
          } catch (err) {
            console.warn('Resize failed, using original', err);
          }
        } else if (size > 200 * 1024 * 1024) {
          toast.error('動画が大きすぎます (200MB 超)。短く撮影してください。');
          continue;
        } else if (size > 50 * 1024 * 1024) {
          toast.warning('大きめの動画 (50MB 超) です。共有時に注意してください。');
        }
        const saved = await saveMedia({
          itemId,
          kind,
          mimeType: blob.type || (kind === 'image' ? 'image/jpeg' : 'video/mp4'),
          size,
          blob,
        });
        addMedia(itemId, saved.id);
        setMedia((prev) => [...prev, saved]);
      }
    } catch (e) {
      console.error(e);
      toast.error('メディアの保存に失敗しました');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id: string) {
    await deleteMedia(id);
    removeMedia(itemId, id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <label className="contents">
          <Button asChild variant="accent" size="sm" disabled={busy}>
            <span>
              <Camera className="h-4 w-4" /> 写真を撮る
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files, 'image')}
                data-testid="capture-photo"
              />
            </span>
          </Button>
        </label>
        <label className="contents">
          <Button asChild variant="outline" size="sm" disabled={busy}>
            <span>
              <Film className="h-4 w-4" /> 動画を撮る
              <input
                type="file"
                accept="video/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files, 'video')}
              />
            </span>
          </Button>
        </label>
        <label className="contents">
          <Button asChild variant="ghost" size="sm" disabled={busy}>
            <span>
              <ImageIcon className="h-4 w-4" /> ライブラリ
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  handleFiles(e.target.files, f.type.startsWith('video') ? 'video' : 'image');
                }}
              />
            </span>
          </Button>
        </label>
        {busy && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
      </div>

      <p className="text-xs text-muted-foreground">
        💡 暗い箇所はカメラ画面のフラッシュ (⚡) をオンにして撮影してください。
        写真は自動で長辺 1600px に圧縮され、端末にのみ保存されます。
      </p>

      {media.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" data-testid="media-grid">
          {media.map((m) => (
            <MediaThumbnail key={m.id} media={m} onDelete={() => handleRemove(m.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaThumbnail({ media, onDelete }: { media: StoredMedia; onDelete: () => void }) {
  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    const u = URL.createObjectURL(media.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [media]);

  return (
    <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-secondary/40">
      {media.kind === 'image' ? (
        <img src={url} alt="撮影" className="h-full w-full object-cover" />
      ) : (
        <video src={url} className="h-full w-full object-cover" muted playsInline />
      )}
      <button
        type="button"
        onClick={onDelete}
        aria-label="削除"
        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[10px] text-white">
        {media.kind === 'image' ? '📷' : '🎥'} {fileSize(media.size)}
      </div>
    </div>
  );
}
