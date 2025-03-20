
/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string | null, currency = 'USD'): string => {
  if (value === null || value === undefined) return '';
  
  // Convert string to number if needed
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : value;
  
  // Check if it's a valid number after conversion
  if (isNaN(numericValue)) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numericValue);
};

/**
 * Extract numeric value from a currency string
 * @param value Currency string (e.g. "$100", "100 USD")
 * @returns Numeric value as number or null if invalid
 */
export const extractNumericValue = (value: string | null): number | null => {
  if (!value) return null;
  
  // Extract digits and decimal point
  const matches = value.match(/([\d,.]+)/);
  if (!matches || !matches[0]) return null;
  
  // Convert to number, removing commas
  const numericString = matches[0].replace(/,/g, '');
  const numericValue = parseFloat(numericString);
  
  return isNaN(numericValue) ? null : numericValue;
};
