
export const parseEventPrice = (priceString: string | undefined): number => {
  if (!priceString) return 0;
  
  try {
    const cleanPriceString = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleanPriceString) || 0;
  } catch (error) {
    console.error('Error parsing price:', error);
    return 0;
  }
};
