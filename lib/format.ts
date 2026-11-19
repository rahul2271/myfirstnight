export function formatPrice(amount: string | number | undefined, currency = 'INR') {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `${currency} ${(n || 0).toLocaleString('en-IN')}`;
  }
}
