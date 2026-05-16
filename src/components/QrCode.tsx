import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  size?: number;
  className?: string;
  /** Foreground color for the modules. Defaults to Tesla snow. */
  fg?: string;
  /** Background color. Use 'transparent' to blend with surrounding card. */
  bg?: string;
  /** Optional aria-label */
  label?: string;
}

/**
 * Renders a QR code as inline SVG so it scales crisply on any DPR and can
 * be embedded directly into exported HTML reports.
 */
export function QrCode({
  value,
  size = 180,
  className,
  fg = '#F5F5F7',
  bg = '#0B0D0F',
  label,
}: Props) {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    let alive = true;
    QRCode.toString(value, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: { dark: fg, light: bg === 'transparent' ? '#00000000' : bg },
      width: size,
    })
      .then((s) => {
        if (alive) setSvg(s);
      })
      .catch(() => {
        if (alive) setSvg('');
      });
    return () => {
      alive = false;
    };
  }, [value, size, fg, bg]);

  return (
    <div
      role="img"
      aria-label={label ?? `QR コード: ${value}`}
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-md',
        className
      )}
      style={{ width: size, height: size, background: bg }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/**
 * Generate the QR as a standalone SVG string (for embedding in HTML
 * reports outside React's tree).
 */
export async function buildQrSvg(
  value: string,
  options: { size?: number; fg?: string; bg?: string } = {}
): Promise<string> {
  const { size = 160, fg = '#0B0D0F', bg = '#FFFFFF' } = options;
  return QRCode.toString(value, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: fg, light: bg },
    width: size,
  });
}
