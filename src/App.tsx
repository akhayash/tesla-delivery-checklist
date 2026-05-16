import { useEffect } from 'react';
import { AppRouter } from './router';
import { Toaster } from '@/components/ui/toaster';
import { useProgress } from '@/store/progress';
import { toast } from 'sonner';

/** Warn once per session if battery is low. */
function useBatteryWarning() {
  useEffect(() => {
    let warned = false;
    type BatteryManager = EventTarget & {
      level: number;
      charging: boolean;
      addEventListener(type: string, listener: () => void): void;
    };
    type NavigatorWithBattery = Navigator & { getBattery?: () => Promise<BatteryManager> };

    async function check() {
      try {
        const nav = navigator as NavigatorWithBattery;
        if (typeof nav.getBattery !== 'function') return;
        const battery = await nav.getBattery();
        function onUpdate() {
          if (!warned && battery.level < 0.2 && !battery.charging) {
            warned = true;
            toast.warning(
              `バッテリー残量が ${Math.round(battery.level * 100)}% です。充電しながら確認することをおすすめします。`,
              { duration: 8000, id: 'battery-warn' }
            );
          }
        }
        onUpdate();
        battery.addEventListener('levelchange', onUpdate);
        battery.addEventListener('chargingchange', onUpdate);
      } catch {
        // Battery API not supported or permission denied – silently ignore
      }
    }
    void check();
  }, []);
}

/** Re-hydrate Zustand store from localStorage when tab becomes visible again. */
function useVisibilityRehydrate() {
  const importSnapshot = useProgress((s) => s.importSnapshot);
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== 'visible') return;
      try {
        const raw = localStorage.getItem('tesla-delivery-progress');
        if (!raw) return;
        const parsed = JSON.parse(raw) as { state?: { snapshot?: unknown } };
        const snap = parsed?.state?.snapshot;
        if (snap && typeof snap === 'object') {
          importSnapshot(snap as Parameters<typeof importSnapshot>[0]);
        }
      } catch {
        // Ignore parse errors
      }
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [importSnapshot]);
}

export default function App() {
  useBatteryWarning();
  useVisibilityRehydrate();

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}
