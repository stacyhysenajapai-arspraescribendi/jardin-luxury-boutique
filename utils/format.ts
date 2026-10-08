import config from '../config';

export function formatDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00`);
  try {
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatPrice(amount: number, currency: string = config.currency, locale = 'en-GB'): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
