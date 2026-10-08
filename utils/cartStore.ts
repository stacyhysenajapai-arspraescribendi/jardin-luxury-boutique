/**
 * Cart & checkout seam: NOT used in v1 (no payments).
 *
 * When online payments are added:
 *  1. Turn this into a React context like `wishlistStore.tsx` (persist with AsyncStorage).
 *  2. Add `app/cart.tsx` and `app/checkout.tsx` routes.
 *  3. Implement `CheckoutProvider` against your PSP (e.g. Stripe, or a local Albanian
 *     gateway) on a server you control. Never put secret keys in the app.
 *  4. Replace "Reserve in store" on the product screen with "Add to bag" where `price != null`.
 */
import type { Product } from '../data/types';

export interface CartLine {
  productId: string;
  size: string | null;
  quantity: number;
  /** Snapshot of price at the time it was added (null = on request, not purchasable). */
  unitPrice: number | null;
}

export interface Cart {
  lines: CartLine[];
  currency: string;
}

export const emptyCart = (currency = 'EUR'): Cart => ({ lines: [], currency });

export function addLine(cart: Cart, product: Product, size: string | null, quantity = 1): Cart {
  const idx = cart.lines.findIndex((l) => l.productId === product.id && l.size === size);
  if (idx >= 0) {
    const lines = cart.lines.slice();
    lines[idx] = { ...lines[idx], quantity: lines[idx].quantity + quantity };
    return { ...cart, lines };
  }
  return { ...cart, lines: [...cart.lines, { productId: product.id, size, quantity, unitPrice: product.price }] };
}

export function removeLine(cart: Cart, productId: string, size: string | null): Cart {
  return { ...cart, lines: cart.lines.filter((l) => !(l.productId === productId && l.size === size)) };
}

/** Returns null if any line is "price on request". */
export function cartTotal(cart: Cart): number | null {
  let total = 0;
  for (const l of cart.lines) {
    if (l.unitPrice == null) return null;
    total += l.unitPrice * l.quantity;
  }
  return total;
}

export interface CheckoutProvider {
  createPaymentSession(cart: Cart, customer: { name: string; phone: string; email?: string }): Promise<{ url: string }>;
}
