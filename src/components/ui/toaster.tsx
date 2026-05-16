import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      richColors
      position="top-center"
      toastOptions={{
        style: {
          background: 'hsl(220 7% 9%)',
          color: 'hsl(0 0% 96%)',
          border: '1px solid hsl(220 5% 16%)',
          fontFamily: 'Montserrat, system-ui, sans-serif',
        },
      }}
    />
  );
}
