
// Price extraction utilities

/**
 * Extract price/budget information from prompt
 */
export function extractPrice(prompt: string): string {
  const priceMatch = prompt.match(/price:?\s*([^,.]+)/i) || 
                    prompt.match(/estimatedPrice:?\s*([^,.]+)/i) || 
                    prompt.match(/cost:?\s*([^,.]+)/i);
  
  if (priceMatch) {
    return `$${priceMatch[1].trim()}`;
  }
  
  // Extract budget information
  if (prompt.toLowerCase().includes("budget")) {
    const budgetMatch = prompt.match(/budget(?:\s+of)?\s+\$?(\d+)/i);
    if (budgetMatch) {
      return `$${budgetMatch[1].trim()}`;
    }
  }
  
  return "Free";
}
