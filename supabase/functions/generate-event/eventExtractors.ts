
// Functions for extracting event details from user prompts

/**
 * Extract title from prompt using various patterns
 */
export function extractTitle(prompt: string): string {
  // Wedding pattern
  let titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+)?)(?:\s+wedding|\s+event)/i);
  if (!titleMatch) {
    // Birthday pattern
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+)?)(?:\s+birthday)/i);
  }
  if (!titleMatch) {
    // Conference/Meeting pattern
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})(?:\s+conference|\s+meeting|\s+workshop)/i);
  }
  if (!titleMatch) {
    // Generic event with name
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+){0,2})(?:\s+in\s+|(?:\s+at\s+))/i);
  }
  
  // Fallback title extraction - try to identify a proper noun or capitalized phrase
  if (!titleMatch) {
    titleMatch = prompt.match(/\b([A-Z][a-z]+(?:'s)?(?:\s+[A-Z][a-z]+){0,2})\b/);
  }

  const extractedTitle = titleMatch ? titleMatch[1].trim() : "";
  
  // Format title based on what we found (Wedding, Birthday, etc.)
  if (extractedTitle && prompt.toLowerCase().includes("wedding")) {
    return `${extractedTitle}'s Wedding`;
  } else if (extractedTitle && prompt.toLowerCase().includes("birthday")) {
    return `${extractedTitle}'s Birthday`;
  }
  
  return extractedTitle;
}

/**
 * Extract other event details from prompt
 */
export function extractEventDetails(prompt: string): Partial<EventData> {
  const descriptionMatch = prompt.match(/description:?\s*([^,.]+(?:[^.]+)?)/i);
  const locationMatch = prompt.match(/location:?\s*([^,.]+)/i) || prompt.match(/in\s+([^,.]+)/i) || prompt.match(/at\s+([^,.]+(?:,[^,.]+)?)/i);
  const categoryMatch = prompt.match(/category:?\s*([^,.]+)/i);
  const priceMatch = prompt.match(/price:?\s*([^,.]+)/i) || prompt.match(/estimatedPrice:?\s*([^,.]+)/i) || prompt.match(/cost:?\s*([^,.]+)/i);

  // Default description if one wasn't provided
  let defaultDescription = prompt;
  
  const formattedTitle = extractTitle(prompt);
  
  // Determine category based on event type mentions
  let category = categoryMatch ? categoryMatch[1].trim() : "";
  if (!category) {
    if (prompt.toLowerCase().includes("wedding")) {
      category = "Wedding";
    } else if (prompt.toLowerCase().includes("birthday")) {
      category = "Birthday Party";
    } else {
      category = "Other";
    }
  }
  
  return {
    title: formattedTitle || "",
    description: descriptionMatch ? descriptionMatch[1].trim() : defaultDescription,
    location: locationMatch ? locationMatch[1].trim() : "",
    category,
    estimatedPrice: priceMatch ? priceMatch[1].trim() : "Free",
  };
}
