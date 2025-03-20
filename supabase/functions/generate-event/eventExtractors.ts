
// Functions for extracting event details from user prompts

import type { EventData } from './types.ts';

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
    // Fundraiser pattern
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})(?:\s+fundraiser)/i);
  }
  if (!titleMatch) {
    // Generic event with name
    titleMatch = prompt.match(/(?:plan|create|organize|arrange)\s+(?:an?|the)?\s*([A-Za-z]+(?:'s)?(?:\s+[A-Za-z]+){0,2})(?:\s+in\s+|(?:\s+at\s+))/i);
  }
  
  // Fallback title extraction - try to identify a proper noun or capitalized phrase
  if (!titleMatch) {
    titleMatch = prompt.match(/\b([A-Z][a-z]+(?:'s)?(?:\s+[A-Z][a-z]+){0,2})\b/);
  }

  let extractedTitle = titleMatch ? titleMatch[1].trim() : "";
  
  // Format title based on what we found
  if (extractedTitle && prompt.toLowerCase().includes("wedding")) {
    return `${extractedTitle}'s Wedding`;
  } else if (extractedTitle && prompt.toLowerCase().includes("birthday")) {
    return `${extractedTitle}'s Birthday`;
  } else if (extractedTitle && prompt.toLowerCase().includes("fundraiser")) {
    // Check if we have a location to include in the title
    const locationMatch = prompt.match(/(?:in|at)\s+([^,.]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : "";
    
    if (location) {
      return `${location} ${extractedTitle} Fundraiser`;
    } else {
      return `${extractedTitle} Fundraiser`;
    }
  } else if (extractedTitle && (prompt.toLowerCase().includes("non-profit") || prompt.toLowerCase().includes("nonprofit"))) {
    // Format non-profit event titles 
    const locationMatch = prompt.match(/(?:in|at)\s+([^,.]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : "";
    
    if (location) {
      return `${location} Non-Profit Fundraiser`;
    } else {
      return `Non-Profit Fundraiser`;
    }
  }
  
  // If title is just a month name, make it more descriptive
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  if (monthNames.includes(extractedTitle.toLowerCase())) {
    // Check if we can extract event type from prompt
    if (prompt.toLowerCase().includes("fundraiser")) {
      const locationMatch = prompt.match(/(?:in|at)\s+([^,.]+)/i);
      const location = locationMatch ? locationMatch[1].trim() : "";
      return location ? `${location} Fundraiser` : "Fundraiser Event";
    } else if (prompt.toLowerCase().includes("meeting")) {
      return "Business Meeting";
    } else if (prompt.toLowerCase().includes("conference")) {
      return "Conference Event";
    } else if (prompt.toLowerCase().includes("party")) {
      return "Social Gathering";
    } else {
      return "Upcoming Event";
    }
  }
  
  return extractedTitle;
}

/**
 * Extract date and time from prompt, better handling of time zones
 */
export function extractDateTime(prompt: string): string | null {
  // Match patterns with time zones (CT, ET, etc.)
  const timeZoneRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}?)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\s*(?:CT|ET|PT|MT)?)?/i;
  const timeZoneMatch = prompt.match(timeZoneRegex);
  
  if (timeZoneMatch) {
    return timeZoneMatch[1].trim();
  }
  
  // Standard date/time pattern
  const dateTimeRegex = /(?:on|at)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)/i;
  const dateTimeMatch = prompt.match(dateTimeRegex);
  
  // Month and day pattern (e.g., "March 30th")
  if (!dateTimeMatch) {
    const monthDayRegex = /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?)/i;
    const monthDayMatch = prompt.match(monthDayRegex);
    
    if (monthDayMatch) {
      return monthDayMatch[1].trim();
    }
  }
  
  return dateTimeMatch ? dateTimeMatch[1].trim() : null;
}

/**
 * Extract location from prompt, filtering out time information
 */
export function extractLocation(prompt: string): string | null {
  // First check for location with time
  const locationTimeRegex = /(?:in|at)\s+([^,.]+)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i;
  const locationTimeMatch = prompt.match(locationTimeRegex);
  
  if (locationTimeMatch) {
    return locationTimeMatch[1].trim();
  }
  
  // Standard location pattern
  const locationRegex = /(?:in|at)\s+([^,.]+(?:,[^,.]+)?)/i;
  const locationMatch = prompt.match(locationRegex);
  
  // If we found a location, clean it by removing any time information
  if (locationMatch) {
    const location = locationMatch[1].trim();
    return location.replace(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)(?:\s+(?:CT|ET|PT|MT))?\b/g, '').trim();
  }
  
  return locationMatch ? locationMatch[1].trim() : null;
}

/**
 * Extract other event details from prompt
 */
export function extractEventDetails(prompt: string): Partial<EventData> {
  const title = extractTitle(prompt);
  const dateTime = extractDateTime(prompt);
  const location = extractLocation(prompt);
  
  const descriptionMatch = prompt.match(/description:?\s*([^,.]+(?:[^.]+)?)/i);
  const categoryMatch = prompt.match(/category:?\s*([^,.]+)/i);
  const priceMatch = prompt.match(/price:?\s*([^,.]+)/i) || prompt.match(/estimatedPrice:?\s*([^,.]+)/i) || prompt.match(/cost:?\s*([^,.]+)/i) || prompt.match(/budget:?\s*\$?(\d+)/i);

  // Default description
  let description = prompt;
  
  // Clean up description by removing "Additional details: " section
  if (description.includes("Additional details:")) {
    description = description.split("Additional details:")[0].trim();
  }
  
  // Use provided description if available
  if (descriptionMatch) {
    description = descriptionMatch[1].trim();
  }
  
  // Determine category based on event type mentions
  let category = categoryMatch ? categoryMatch[1].trim() : "";
  if (!category) {
    if (prompt.toLowerCase().includes("wedding")) {
      category = "Wedding";
    } else if (prompt.toLowerCase().includes("birthday")) {
      category = "Birthday Party";
    } else if (prompt.toLowerCase().includes("fundraiser")) {
      category = "Fundraiser";
    } else if (prompt.toLowerCase().includes("corporate") || prompt.toLowerCase().includes("business")) {
      category = "Corporate";
    } else {
      category = "Other";
    }
  }
  
  // Extract budget/price information
  let price = "Free";
  if (priceMatch) {
    price = `$${priceMatch[1].trim()}`;
  } else if (prompt.toLowerCase().includes("budget")) {
    const budgetMatch = prompt.match(/budget(?:\s+of)?\s+\$?(\d+)/i);
    if (budgetMatch) {
      price = `$${budgetMatch[1].trim()}`;
    }
  }
  
  return {
    title: title || "",
    description: description,
    date: dateTime || "",
    location: location || "",
    category,
    estimatedPrice: price,
  };
}

/**
 * Check which fields are missing in the event data
 */
export function checkMissingFields(eventData: Partial<EventData>): string[] {
  const missingFields = [];
  
  if (!eventData.date) {
    missingFields.push('date');
  }
  
  if (!eventData.location) {
    missingFields.push('location');
  }
  
  return missingFields;
}
