import { useEffect, useMemo, useState } from 'react';
import {
  Smartphone,
  Share,
  PlusSquare,
  MoreVertical,
  CheckCircle2,
  WifiOff,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !('MSStream' in window)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Windows|Macintosh|Linux|CrOS/.test(ua)) return 'desktop';
  return 'unknown';
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  const navAny = window.navigator as Navigator & { standalone?: boolean };
  return navAny.standalone === true;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface Props {
  /** Render a compact button (icon + short label) suitable for grid placement. */
  variant?: 'compact' | 'default';
}

/**
 * Mobile-first PWA install guide.
 *
 * Behaviour:
 * - Hidden entirely if the app is already running standalone (homescreen launch).
 * - On Android / Chromium desktop: triggers the native `beforeinstallprompt`
 *   when available; falls back to per-platform written instructions.
 * - On iOS Safari: shows the share → "ホーム画面に追加" walkthrough (iOS
 *   doesn't expose a programmatic install API).
 */
export function InstallGuide({ variant = 'compact' }: Props) {
  const platform = useMemo(detectPlatform, []);
  const [open, setOpen] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  async function triggerNativePrompt() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="install-open">
          <Smartphone className="h-4 w-4" />
          {variant === 'compact' ? 'インストール' : 'ホーム画面に追加'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ホーム画面に追加して使う</DialogTitle>
          <DialogDescription>
            このアプリは PWA として端末にインストールできます。
            ホーム画面から起動すれば、ブラウザのアドレスバーが消えて全画面で使え、
            オフラインでもチェック作業を続けられます。
          </DialogDescription>
        </DialogHeader>

        <ul className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
          <li className="rounded-md border border-border bg-secondary/40 p-2">
            <Download className="mx-auto mb-1 h-4 w-4 text-accent" />
            全画面で起動
          </li>
          <li className="rounded-md border border-border bg-secondary/40 p-2">
            <WifiOff className="mx-auto mb-1 h-4 w-4 text-accent" />
            オフライン動作
          </li>
          <li className="rounded-md border border-border bg-secondary/40 p-2">
            <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-accent" />
            データ保持
          </li>
        </ul>

        {deferred && (
          <Button
            onClick={triggerNativePrompt}
            variant="accent"
            className="w-full"
            data-testid="install-native"
          >
            <Download className="h-4 w-4" /> 今すぐインストール
          </Button>
        )}

        {platform === 'ios' && <IosSteps />}
        {platform === 'android' && <AndroidSteps hasNative={!!deferred} />}
        {(platform === 'desktop' || platform === 'unknown') && (
          <DesktopSteps hasNative={!!deferred} />
        )}

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          ※ インストールしても写真・動画・メモはこの端末内にのみ保存されます。
          別の端末との同期は行いません。アンインストール時はデータも削除されます。
        </p>
      </DialogContent>
    </Dialog>
  );
}

function IosSteps() {
  return (
    <ol className="space-y-3 text-sm">
      <Step n={1} title="Safari で開く">
        Chrome / Edge など他のブラウザでは追加できません。Safari で
        このページを開いている状態にしてください。
      </Step>
      <Step n={2} title="共有メニューを開く" icon={<Share className="h-4 w-4" />}>
        画面下中央の共有アイコン（□ から ↑ が出るマーク）をタップします。
      </Step>
      <Step n={3} title="「ホーム画面に追加」を選ぶ" icon={<PlusSquare className="h-4 w-4" />}>
        メニューを下にスクロールして「ホーム画面に追加」をタップ。
      </Step>
      <Step n={4} title="名前を確認して追加">
        「Tesla 納車チェック」のまま右上の「追加」をタップ。ホーム画面に
        アイコンが追加されます。
      </Step>
    </ol>
  );
}

function AndroidSteps({ hasNative }: { hasNative: boolean }) {
  return (
    <ol className="space-y-3 text-sm">
      {!hasNative && (
        <Step n={1} title="Chrome のメニューを開く" icon={<MoreVertical className="h-4 w-4" />}>
          右上の縦三点メニュー（︙）をタップします。
        </Step>
      )}
      <Step n={hasNative ? 1 : 2} title="「ホーム画面に追加」/「アプリをインストール」を選ぶ">
        メニュー内の「ホーム画面に追加」または「アプリをインストール」を
        タップします。表記は Chrome のバージョンで多少異なります。
      </Step>
      <Step n={hasNative ? 2 : 3} title="名前を確認して追加">
        「インストール」または「追加」をタップすると、ホーム画面と
        アプリ一覧の両方にアイコンが追加されます。
      </Step>
      <Step n={hasNative ? 3 : 4} title="ホーム画面のアイコンから起動">
        次回からはホーム画面のアイコンを起動するだけで、全画面・
        オフラインで使えます。
      </Step>
    </ol>
  );
}

function DesktopSteps({ hasNative }: { hasNative: boolean }) {
  return (
    <ol className="space-y-3 text-sm">
      <Step n={1} title="Chrome / Edge のアドレスバー右側">
        アドレスバー右側に表示される「インストール」アイコン
        （モニター+下向き矢印）をクリックします。
        {!hasNative && (
          <span className="mt-1 block text-[11px] text-muted-foreground">
            アイコンが見えない場合はアドレスバー右の「…」メニューから
            「アプリをインストール」を選択。
          </span>
        )}
      </Step>
      <Step n={2} title="ダイアログで「インストール」をクリック">
        確認ダイアログで「インストール」を選ぶと、独立したウィンドウとして
        起動できるようになります。
      </Step>
      <Step n={3} title="必要ならスマホでも追加">
        現場で使うときはスマホでもインストールしておくと、データを
        この PC と分けて保持できて便利です。ホームの QR コードから
        スマホで開けます。
      </Step>
    </ol>
  );
}

function Step({
  n,
  title,
  icon,
  children,
}: {
  n: number;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-medium text-accent">
        {n}
      </span>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          {icon}
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {children}
        </p>
      </div>
    </li>
  );
}
