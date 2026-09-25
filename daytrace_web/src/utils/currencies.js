export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States', flag: '🇺🇸', rate: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India', flag: '🇮🇳', rate: 83.5 },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom', flag: '🇬🇧', rate: 0.79 },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', country: 'Ethiopia', flag: '🇪🇹', rate: 124.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union', flag: '🇪🇺', rate: 0.92 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan', flag: '🇯🇵', rate: 155.0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', country: 'Canada', flag: '🇨🇦', rate: 1.36 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', country: 'Australia', flag: '🇦🇺', rate: 1.52 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', country: 'United Arab Emirates', flag: '🇦🇪', rate: 3.67 },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', country: 'Singapore', flag: '🇸🇬', rate: 1.35 },
];

export function formatCurrency(amount, currencyCode = 'USD') {
  const curr = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const num = Math.abs(amount);
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${curr.symbol}${formatted}`;
}
