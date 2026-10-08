/**
 * Generates neutral, brand-free placeholder images into assets/placeholder/
 * and writes the image registry (assets/placeholder/index.ts).
 *
 *   npm run placeholders
 *
 * Every image is original line-art on champagne/ivory/stone. Nothing is copied
 * from Instagram or brand websites. Replace them with real photography (see README).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const outDir = path.join(root, 'assets', 'placeholder');
fs.mkdirSync(outDir, { recursive: true });

const GOLD = ['#7A5C16', '#B8903A', '#E8D08A', '#FFF3C4', '#C9A44C', '#8A6A1F'];
const goldDefs = (id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    ${GOLD.map((c, i) => `<stop offset="${[0, 0.22, 0.45, 0.55, 0.78, 1][i]}" stop-color="${c}"/>`).join('')}
  </linearGradient>`;

const backgrounds = [
  ['#F4EEE3', '#E6DAC6'], // champagne
  ['#FBF9F4', '#EDE6DA'], // ivory
  ['#ECE6DC', '#D8CDBB'], // stone
];

/** Simple, elegant line-art silhouettes drawn in a 200×200 box. */
const shapes = {
  'ready-to-wear': `
    <path d="M80 30 Q100 45 120 30 L135 40 L128 70 Q122 80 124 95 L150 180 L50 180 L76 95 Q78 80 72 70 L65 40 Z"/>
    <path d="M85 30 L100 60 L115 30"/>`,
  bags: `
    <path d="M70 80 Q70 40 100 40 Q130 40 130 80"/>
    <rect x="45" y="80" width="110" height="90" rx="6"/>
    <path d="M45 105 L155 105"/><circle cx="100" cy="112" r="6"/>`,
  shoes: `
    <path d="M40 150 L40 120 Q60 118 80 128 Q110 145 150 140 Q168 138 168 150 Z"/>
    <path d="M150 150 L150 172"/><path d="M40 150 L168 150"/>`,
  hats: `
    <ellipse cx="100" cy="135" rx="80" ry="18"/>
    <path d="M60 132 Q60 70 100 68 Q140 70 140 132"/><path d="M62 118 Q100 126 138 118"/>`,
  jewelry: `
    <path d="M55 40 Q100 140 145 40"/>
    <circle cx="100" cy="125" r="14"/><circle cx="100" cy="125" r="6"/>
    <circle cx="70" cy="80" r="3"/><circle cx="130" cy="80" r="3"/>`,
  swimwear: `
    <path d="M60 50 Q75 80 100 82 Q125 80 140 50"/>
    <path d="M60 50 L62 110 Q80 150 100 160 Q120 150 138 110 L140 50"/>
    <path d="M70 110 Q100 125 130 110"/>`,
  accessories: `
    <rect x="40" y="85" width="120" height="30" rx="4"/>
    <rect x="88" y="78" width="24" height="44" rx="3"/><path d="M100 85 L100 115"/>`,
};

function productSvg(cat, variant, w = 800, h = 1000) {
  const [a, b] = backgrounds[variant % backgrounds.length];
  const label = cat.replace(/-/g, ' ').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    ${goldDefs('g')}
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <ellipse cx="${w / 2}" cy="${h * 0.8}" rx="${w * 0.28}" ry="${h * 0.018}" fill="#000" opacity="0.06"/>
  <g transform="translate(${w / 2 - 220} ${h * 0.4 - 220 + variant * 8}) scale(2.2)" fill="none" stroke="url(#g)" stroke-width="${1.6 + variant * 0.2}" stroke-linecap="round" stroke-linejoin="round">
    ${shapes[cat]}
  </g>
  <text x="50%" y="${h - 70}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="8" fill="#8A7E6C">${label}</text>
  <text x="50%" y="${h - 38}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" letter-spacing="5" fill="#A89C88">PLACEHOLDER · REPLACE WITH PHOTO</text>
</svg>`;
}

function heroSvg(i, w = 1080, h = 1440) {
  const variants = [
    { bg: ['#EFE6D6', '#D9C9AE'], ink: '#6B5A3E' },
    { bg: ['#1A1814', '#0E0E0E'], ink: '#C9A44C' },
    { bg: ['#F6F1E8', '#E4D7C0'], ink: '#7A6A50' },
  ][i % 3];
  // Abstract interior: arched moulding panels + chandelier dots, no real imagery.
  const panels = [0, 1, 2]
    .map((k) => {
      const x = 120 + k * 300;
      return `<path d="M${x} ${h - 200} L${x} 520 Q${x + 120} 380 ${x + 240} 520 L${x + 240} ${h - 200}" />
              <path d="M${x + 24} ${h - 224} L${x + 24} 540 Q${x + 120} 430 ${x + 216} 540 L${x + 216} ${h - 224}" opacity="0.5"/>`;
    })
    .join('');
  const crystals = Array.from({ length: 13 }, (_, k) => {
    const cx = w / 2 + (k - 6) * 28;
    const cy = 180 + Math.abs(k - 6) * -6 + 40;
    return `<line x1="${cx}" y1="120" x2="${cx}" y2="${cy}" stroke-width="1"/><circle cx="${cx}" cy="${cy + 8}" r="6"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${variants.bg[0]}"/><stop offset="1" stop-color="${variants.bg[1]}"/></linearGradient>
    ${goldDefs('g')}
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g fill="none" stroke="url(#g)" stroke-width="2" opacity="0.75">${panels}</g>
  <g fill="none" stroke="url(#g)" opacity="0.8">${crystals}</g>
  <line x1="80" y1="${h - 200}" x2="${w - 80}" y2="${h - 200}" stroke="url(#g)" stroke-width="2"/>
  <text x="50%" y="${h - 120}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="6" fill="${variants.ink}" opacity="0.8">CAMPAIGN PLACEHOLDER</text>
</svg>`;
}

function lookSvg(i, w = 720, h = 1280) {
  const bgs = [['#E9DFCD', '#CDBB9C'], ['#2A2621', '#121110'], ['#F1EADD', '#D6C8B0'], ['#DCCFBA', '#B9A585']];
  const [a, b] = bgs[i % bgs.length];
  const dark = i % 4 === 1;
  // A stylised mannequin silhouette
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    ${goldDefs('g')}
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round" opacity="0.9" transform="translate(${w / 2 - 160} 230) scale(1.6)">
    <circle cx="100" cy="40" r="26"/>
    <path d="M100 66 L100 90"/>
    <path d="M60 100 Q100 88 140 100 L150 210 Q128 232 136 260 L170 470 L30 470 L64 260 Q72 232 50 210 Z"/>
    <path d="M75 470 L75 560"/><path d="M125 470 L125 560"/>
  </g>
  <text x="50%" y="${h - 90}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="6" fill="${dark ? '#C9A44C' : '#6B5A3E'}" opacity="0.85">LOOK ${i + 1} · VIDEO PLACEHOLDER</text>
</svg>`;
}

function brandSvg(mono, dark, w = 600, h = 600) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${goldDefs('g')}
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? '#1A1814' : '#F4EEE3'}"/><stop offset="1" stop-color="${dark ? '#0E0E0E' : '#E4D7C0'}"/></linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="url(#g)" stroke-width="2" opacity="0.7"/>
  <text x="50%" y="56%" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${mono.length > 2 ? 120 : 170}" letter-spacing="6" fill="url(#g)">${mono.replace('&', '&amp;')}</text>
</svg>`;
}

function monogramIconSvg(size, { bg = '#0E0E0E', pad = 0 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <defs>${goldDefs('g')}</defs>
  ${bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : ''}
  <g transform="translate(${pad} ${pad}) scale(${(1024 - pad * 2) / 1024})">
    <rect x="232" y="232" width="560" height="560" fill="none" stroke="url(#g)" stroke-width="6"/>
    <text x="512" y="640" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="400" fill="url(#g)">J</text>
  </g>
</svg>`;
}

async function writeJpg(name, svg) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, `${name}.jpg`));
  return name;
}

const registry = [];

for (const [cat, count] of Object.entries({
  'ready-to-wear': 3,
  bags: 3,
  shoes: 3,
  hats: 2,
  jewelry: 2,
  swimwear: 2,
  accessories: 2,
})) {
  for (let v = 0; v < count; v++) registry.push(await writeJpg(`${cat}-${v + 1}`, productSvg(cat, v)));
}
for (let i = 0; i < 3; i++) registry.push(await writeJpg(`hero-${i + 1}`, heroSvg(i)));
for (let i = 0; i < 4; i++) registry.push(await writeJpg(`look-${i + 1}`, lookSvg(i)));

const brands = JSON.parse(fs.readFileSync(path.join(root, 'data', 'brands.json'), 'utf8'));
for (const [i, b] of brands.entries()) registry.push(await writeJpg(`brand-${b.id}`, brandSvg(b.monogram, i % 2 === 0)));

// App icon + splash + adaptive icon (gold "J" monogram on black). Replace once the real logo is supplied.
const assets = path.join(root, 'assets');
await sharp(Buffer.from(monogramIconSvg(1024))).png().toFile(path.join(assets, 'icon.png'));
await sharp(Buffer.from(monogramIconSvg(1024, { bg: null }))).png().toFile(path.join(assets, 'splash-icon.png'));
await sharp(Buffer.from(monogramIconSvg(1024, { bg: null, pad: 180 }))).png().toFile(path.join(assets, 'android-icon-foreground.png'));
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#0E0E0E' } }).png().toFile(path.join(assets, 'android-icon-background.png'));
await sharp(Buffer.from(monogramIconSvg(1024, { bg: null, pad: 180 }).replace(/url\(#g\)/g, '#FFFFFF'))).png().toFile(path.join(assets, 'android-icon-monochrome.png'));
await sharp(Buffer.from(monogramIconSvg(64))).png().toFile(path.join(assets, 'favicon.png'));

const ts = `/* AUTO-GENERATED by scripts/generate-placeholders.mjs. Add your own keys freely. */
/* eslint-disable */
export const placeholderImages: Record<string, number> = {
${registry.map((k) => `  '${k}': require('./${k}.jpg'),`).join('\n')}
};
`;
fs.writeFileSync(path.join(outDir, 'index.ts'), ts);
console.log(`Generated ${registry.length} placeholder images + app icons.`);
