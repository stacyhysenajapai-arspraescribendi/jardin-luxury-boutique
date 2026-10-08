# JARDIN Luxury Boutique: mobile app

A React Native + Expo (TypeScript) app for **JARDIN Luxury Boutique** in Bllok, Tirana. It lets customers browse the boutique's designer pieces with search, filters, sizes, a wishlist, stylist Reels and offers, then ask or reserve on WhatsApp, call, or visit.

The design decisions are explained in [BRAND_ANALYSIS.md](BRAND_ANALYSIS.md).

> **All products, images, looks and offers are placeholders** (`"placeholder": true`). Replace them with real data before release. No imagery was taken from Instagram or brand websites.

---

## 1. Setup

Requirements: Node 20+ and npm. For phones, install **Expo Go** or use a development build (see below).

```bash
npm install
```

## 2. Run

```bash
npx expo start          # QR code for a phone, then press i / a for simulators
npx expo start --web    # browser preview at http://localhost:8081
npm run typecheck       # TypeScript check
```

**A development build is recommended.** The app uses native modules (maps, video, masked view, Reanimated 4). Recent Expo Go versions include them, but a dev build matches production exactly:

```bash
npx expo run:ios        # macOS + Xcode
npx expo run:android    # Android Studio / device
# or in the cloud:
npx eas-cli@latest build --profile development
```

**Web preview notes.** The web version is for quick checks only:
- The gold logo shine uses a CSS fallback.
- The map shows a stylised card instead of a live map.
- Active tab icons use flat brass instead of the gradient.

## 3. Project structure

```
app/                 Screens (Expo Router: every file is a route)
  (tabs)/            Home · Shop · Looks · Saved · Store
  brands/            Brand grid + brand products
  product/[id].tsx   Product detail
  offers.tsx, personal-shopper.tsx, settings.tsx
components/          UI building blocks
  gold/              GoldLogo (+ .web), GoldGradient, GoldIcon, Hairline, Badge, GoldBorder
data/                products.json, brands.json, looks.json, offers.json
                     repository.ts (interface) + localRepository.ts (JSON implementation)
i18n/                en.json, sq.json, index.tsx
theme/theme.ts       ALL colours, gold stops, fonts, spacing, motion timings
utils/               WhatsApp/links, haptics, wishlist store, cart seam, images
config.ts            Store address, phone, WhatsApp, Instagram, hours, logo
assets/placeholder/  Generated neutral images + registry (index.ts)
scripts/             generate-placeholders.mjs
reference/           Drop logo.png here
```

## 4. Editing content

All content is local JSON in `data/`. After editing, the app reloads automatically.

### Images
An `image` / `images` / `poster` value can be:
- **A remote URL**, for example `"https://cdn.example.com/jardin/ysl-bag-1.jpg"` (recommended for real photos), or
- **A local key** registered in `assets/placeholder/index.ts`. To add a local photo:
  1. Put `my-photo.jpg` in `assets/placeholder/`.
  2. Add `'my-photo': require('./my-photo.jpg'),` to `index.ts`.
  3. Use `"my-photo"` in the JSON.

Product photos should be **4:5 portrait** on a white or ivory background. Reels should be **9:16**.

### Add a product (`data/products.json`)
```json
{
  "id": "p100",
  "brandId": "saint-laurent",
  "name": "Le 5 à 7 Hobo Bag",
  "category": "bags",
  "gender": "women",
  "price": null,
  "compareAtPrice": null,
  "currency": "EUR",
  "sizes": ["One size"],
  "colors": ["Black"],
  "description": "Smooth leather hobo bag.",
  "images": ["https://…/front.jpg", "https://…/side.jpg"],
  "isNew": true,
  "onSale": false,
  "placeholder": false,
  "createdAt": "2026-10-08"
}
```
- **`category`** must be one of: `ready-to-wear`, `bags`, `shoes`, `hats`, `jewelry`, `swimwear`, `accessories`.
- **`price: null`** shows **"Price on request"**. Set a number to show a price. Add `compareAtPrice` to show a struck-through original price on sale items.
- **`isNew`** puts the product in "New Arrivals", newest `createdAt` first.
- **`onSale`** adds a SALE badge and includes it in "Sale only".

### Add a brand (`data/brands.json`)
```json
{ "id": "valentino", "name": "Valentino", "confirmed": true, "monogram": "VA", "image": "https://…/valentino.jpg", "order": 7 }
```
- `confirmed: false` shows a "To confirm" label.
- `order` controls the position in the brand circles and grid.

### Add an offer (`data/offers.json`)
```json
{
  "id": "o-black-friday",
  "title": "Black Friday",
  "subtitle": "Selected pieces, in store and on request",
  "style": "black",
  "badge": "UP TO 50% OFF",
  "validFrom": "2026-11-27",
  "validTo": "2026-11-30",
  "image": "https://…/poster.jpg",
  "link": { "saleOnly": true },
  "showInHero": true,
  "placeholder": false
}
```
- **`style`** is `"black"` (black + gold poster) or `"cream"` (cream + gold poster).
- Offers appear **only between `validFrom` and `validTo`**. Future offers are listed under "Coming soon".
- **`link`** decides where a tap goes in the Shop. It accepts `saleOnly`, `brandId` and/or `category`.
- **`showInHero: true`** also puts the offer in the Home hero carousel.

### Add a Reel / look (`data/looks.json`)
```json
{
  "id": "l005",
  "title": "Gala Night",
  "stylist": "Name of stylist",
  "videoUrl": "https://cdn.example.com/jardin/reels/gala-night.mp4",
  "poster": "https://cdn.example.com/jardin/reels/gala-night.jpg",
  "products": [{ "productId": "p009" }, { "productId": "p006" }],
  "placeholder": false
}
```
- **`videoUrl`**: use an **MP4 (H.264)** or **HLS (.m3u8)** URL, vertical 9:16, ideally under 30 s and under 10 MB. Set it to `null` to show the poster with "Video coming soon".
- **Behaviour**: only the visible Reel plays. Videos loop and start muted; customers can tap to unmute.
- **Tagged products**: every `productId` in `products` becomes a tappable chip that opens that product.
- **Reposting from Instagram**: download the boutique's own Reels from Instagram (they own them), upload them to a CDN or storage bucket, and paste the URL here.

### Store details (`config.ts`)
`config.ts` holds the address, coordinates, phone, WhatsApp, Instagram, email, website and **opening hours**. Hours are `null` ("To be confirmed") until you fill them in. For example:
```ts
{ day: 'mon', open: '10:00', close: '21:00' }
```
The map pin (`coordinates`) is an approximation on Rruga Brigada e VIII and should be confirmed.

### Texts and languages
Every UI string lives in `i18n/en.json` and `i18n/sq.json`, and the two files have the same keys. English is the default (`config.defaultLanguage`). Users switch language with the globe icon (Home and Store) under Settings, and the choice is saved on the device.

## 5. The gold logo and palette

### Change the gold
Edit `theme/theme.ts → gold.stops` (dark → light → dark) and `gold.locations`. Every gold surface reads from there: logo, primary buttons, active tab icons, badges, hairlines and borders. `gold.shine` sets the colour of the moving highlight.

### Shine timing
`theme.motion.shineSweep` is the sweep duration and `shinePause` is the pause between sweeps. Together they default to about 4.1 s.

### How the shine works
1. `<GoldLogo variant="splash|header" />` (`components/gold/GoldLogo.tsx`) renders the letters as a **mask** (`@react-native-masked-view/masked-view`).
2. Inside the mask, a static multi-stop `LinearGradient` is the gold.
3. A narrow, rotated white-gold `LinearGradient` band slides across, driven by **Reanimated** (`withRepeat(withSequence(sweep, pause))`). Because it sits inside the mask, the light only touches the letter shapes.
4. An optional `sparkle` blooms at the end of each sweep.

Variants and props:
- **Splash variant**: shines once, then calls `onShineEnd`, which triggers the transition to Home.
- **Header variant**: loops.
- **`shine="off"`** disables the shine.
- **Reduced motion**: the shine is skipped when the OS "Reduce motion" setting is on.

### Use the real logo artwork
1. Save the logo as `reference/logo.png`: **black or white shapes on a transparent background**, cropped tight.
2. In `config.ts`, set `logoImage: require('./reference/logo.png')` and `logoAspectRatio` to the image's width ÷ height.

The same gold gradient and shine are then masked by your artwork instead of the text. Also replace the app icon and splash files in `assets/` (`icon.png`, `splash-icon.png`, `android-icon-*.png`). The current files are a gold "J" monogram generated by `npm run placeholders`.

## 6. Moving to a backend (Supabase / Firebase)
Screens only call `repo` from `data/repository.ts`, using the `CatalogRepository` interface. To move off the JSON files:
1. Create `data/supabaseRepository.ts` (or Firebase) implementing the same methods. The types are in `data/types.ts`.
2. Change the last line of `repository.ts` to `export const repo = new SupabaseRepository();`.

Nothing else changes. `filterProducts()` is pure, so you can keep it client-side or move it to SQL.

## 7. Adding payments later
v1 has no payments. Customers ask or reserve via WhatsApp. `utils/cartStore.ts` already defines the cart model (`addLine`, `removeLine`, `cartTotal`) and a `CheckoutProvider` interface. Its header comment lists the steps:
1. Add a cart context.
2. Add `app/cart.tsx` and `app/checkout.tsx`.
3. Add a server-side payment session.
4. Show "Add to bag" where `price != null`.

## 8. Android map key
iOS uses Apple Maps (no key needed). For Android production builds, add a Google Maps API key in `app.json`:
```json
"android": { "config": { "googleMaps": { "apiKey": "YOUR_KEY" } } }
```

## 9. Regenerating placeholders
```bash
npm run placeholders
```
This rewrites `assets/placeholder/*` and the app icons. It doesn't touch your JSON.
