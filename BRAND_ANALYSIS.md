# JARDIN Luxury Boutique — Brand Analysis

> Source: the boutique's public Instagram (@jardin_luxury_boutique, ~48.7K followers) as described in the project brief.
> No imagery was copied from Instagram or brand websites. Everything visual in the app is a neutral placeholder.

## 1. Who they are

| | |
|---|---|
| **Store** | JARDIN Luxury Boutique, a multi-brand designer store for women and men |
| **Where** | Rruga Brigada e VIII, Bllok, Tiranë, Albania. Bllok is Tirana's most fashionable district. |
| **Contact** | Phone / WhatsApp +355 69 863 7620 · Instagram DM |
| **Brands (Highlights)** | Givenchy · Vivetta · Zimmermann · Dolce & Gabbana · Yves Salomon · Saint Laurent |
| **Seen on shelves** | Valentino (*to confirm*) |
| **Product mix** | Ready-to-wear, bags, shoes & heels, hats, jewelry, swimwear, accessories |
| **Unknown** | Opening hours, email, website, prices. These are placeholders in `config.ts`. |

## 2. The physical space (and why it drives the app's look)

- **Champagne / beige tufted velvet wall panels** form the base surface. In the app this becomes `champagne #EFE6D6` for cards and sections.
- **Polished brass-and-glass shelving** is the accent. It becomes the **metallic gold gradient**, used sparingly on lines, borders, badges and the primary CTA.
- **White marble floors and white classical moulding** set the canvas. It becomes `ivory #FAF7F0` for the app background, with lots of negative space.
- **Crystal chandeliers** add sparkle. It becomes the soft **shine sweep** on the logo and one tiny optional sparkle, and never glitter everywhere.
- The overall impression is **warm, light, classical and glamorous**. It is *not* dark, techy or minimal-cold, so the app uses a **light theme**. Black is reserved for the splash screen, sale moments and some hero blocks, echoing the black-and-gold sale posters.

## 3. Content pillars on Instagram

| Pillar | What it looks like | App equivalent |
|---|---|---|
| **Try-on Reels with a stylist** | Vertical video in the store, a stylist styling a full look | **Looks** tab: a vertical video feed with tagged, tappable products |
| **Brand campaign imagery** | Givenchy / YSL / D&G campaigns | **Home hero carousel**: big, edge-to-edge images with slow parallax |
| **Clean product shots on white** | Single product, centred, white background | **Product cards & gallery**: ivory/white tiles, generous padding |
| **Sale posters** | Black + gold or cream + gold, serif type, "70% OFF", "Winter Sale" | **Offers screen & Sale banner** in the same two colourways |
| **Highlights per brand** | Round covers per brand | **Brand circles** on Home with a thin gold ring |

## 4. Voice and language

- Promos are mostly in **English** ("Winter Sale", "Up to 70% off", "New Arrivals"). The address is in **Albanian**.
- The app therefore defaults to **English** and offers an **Albanian (Shqip)** switch. The address always shows its Albanian original.
- The tone is short, confident and elegant, with no exclamation-heavy hype. Copy in the app follows this. Examples: "Price on request", "Reserve in store", "Shop the look".

## 5. How customers buy today

1. They see a product or Reel on Instagram.
2. They send a DM, call or WhatsApp to ask about price and size.
3. They visit the store in Bllok to try it on and buy.

**The implication** is that v1 should not force e-commerce. The app's job is to make steps 1–2 effortless and lead to step 3. Every product therefore has:
- **Ask on WhatsApp**, with a prefilled message that names the product, brand and size
- **Reserve in store**, as a prefilled reservation request

Payments are left out of v1, but the code keeps a cart and checkout seam ready for later.

## 6. Gaps Instagram can't fill (the app's reason to exist)

| Instagram limitation | App feature |
|---|---|
| No search | Full-text search across product, brand and category |
| No filters | Category · brand · size · sale-only |
| No sizes | Size chips per product, passed into the WhatsApp message |
| No wishlist | Wishlist saved on the device |
| Offers vanish in the feed | Offers screen with validity dates |
| Store info is scattered | Store page with map, directions, call, WhatsApp, Instagram and hours |
| Personal styling happens ad hoc in DMs | Personal shopper request form sent via WhatsApp |

## 7. Design rules derived from the above

### Palette (`theme/theme.ts`)
- `ivory #FAF7F0` is the background. `champagne #EFE6D6` is for surfaces. `ink #0E0E0E` is for text and solid buttons.
- **Gold is a material, not a colour.** It always appears as the multi-stop metallic gradient
  `#7A5C16 → #B8903A → #E8D08A → #FFF3C4 → #C9A44C → #8A6A1F`
  and never as a flat yellow.
- Gold is **decorative only**. It is never used for small body text, because it fails contrast. Readable text is always ink on ivory/champagne or ivory on ink.

### Typography
- **Headings** use Cormorant Garamond. Its high contrast and classical feel match the moulding and the serif sale posters.
- **Body** uses Jost, a refined geometric sans that nods to the fashion house logos.
- **Labels** are UPPERCASE with wide tracking (≈ 2–4 px), at small sizes.

### Layout
- Big photography, generous white space, one idea per section.
- Hairline dividers are 0.5–1 px gold gradient lines, matching the brass shelf edges.
- No clutter, no more than one CTA colour per screen, and no busy iconography.

### Motion
- Motion should feel **slow, calm and expensive**. Durations run 400–1400 ms with ease-in-out and no bounces.
- Hero images have parallax. Content fades in softly.
- The logo shine sweeps about every 4 s with a long pause. It is subtle enough that you notice it only on the second look.
- Haptics are light and fire only on meaningful taps: save, size select, primary CTAs.

### Photography direction (for when real photos arrive)
- Product shots: on white or ivory, centred, soft shadow, 4:5 portrait.
- Campaign and hero shots: full-bleed and warm-toned. The interior's velvet and brass make an ideal backdrop.
- Reels: 9:16, shot in-store, under 30 s, with the stylist naming each piece so it can be tagged.

## 8. What stays a placeholder until the store confirms it
- Every product, its photos and its description (all marked `placeholder: true`)
- Prices (`price: null` shows "Price on request")
- Opening hours, email and website
- The logo artwork (text-based gold logo until `reference/logo.png` is supplied)
- The brand list beyond the six Highlights. Valentino is shown as "to confirm".
- The exact map coordinates of the store
