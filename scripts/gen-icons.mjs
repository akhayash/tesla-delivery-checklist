/**
 * Generate PWA PNG icons from the in-repo SVG mark using sharp at build time.
 * Run: node scripts/gen-icons.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public');

const svg = await readFile(path.join(pub, 'favicon.svg'));

await mkdir(pub, { recursive: true });

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512, padding: 64 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const t of targets) {
  const img = sharp(svg).resize(t.size, t.size, { fit: 'contain', background: '#0B0D0F' });
  if (t.padding) {
    img.extend({ top: t.padding, bottom: t.padding, left: t.padding, right: t.padding, background: '#0B0D0F' }).resize(t.size, t.size);
  }
  const buf = await img.png().toBuffer();
  await writeFile(path.join(pub, t.name), buf);
  console.log('wrote', t.name);
}
