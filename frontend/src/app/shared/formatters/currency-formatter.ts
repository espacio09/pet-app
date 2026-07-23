// shared/formatters/currency-formatter.ts

export const currencyFormatter = (
  amount: number | null | undefined,
  currency = 'EUR',
): string => {
  if (amount === null || amount === undefined) {
    return '';
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount);
};