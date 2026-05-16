/**
 * Returns the canonical public URL for the app. Falls back to the current
 * page origin (handy when running locally or via `npm run preview`).
 */
export function getAppUrl(): string {
  const fromEnv = import.meta.env.VITE_APP_URL as string | undefined;
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}`;
  }
  return 'https://akhayash.github.io/tesla-delivery-checklist/';
}
