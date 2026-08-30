export function formatDZD(amount: number, locale: string = 'ar'): string {
  const formatted = new Intl.NumberFormat('en-US').format(Math.round(amount));
  return locale === 'ar' ? `${formatted} د.ج` : `${formatted} DZD`;
}

export function formatCompactDZD(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return `${amount}`;
}
