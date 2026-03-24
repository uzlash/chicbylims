export type CurrencyCode = "NGN" | "USD";

/**
 * Format a number as price. With currency:
 * - NGN: en-NG locale, 2 decimals
 * - USD: en-US locale, 2 decimals, no currency symbol (caller adds $ or ₦)
 */
export function formatPrice(amount: number, currency: CurrencyCode = "NGN"): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return "0.00";

  const locale = currency === "USD" ? "en-US" : "en-NG";
  return num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format amount with symbol (e.g. ₦1,234.00 or $1.23).
 * Use with display amount already in the correct currency.
 */
export function formatPriceWithSymbol(amount: number, currency: CurrencyCode): string {
  const symbol = currency === "USD" ? "$" : "₦";
  return `${symbol}${formatPrice(amount, currency)}`;
}
