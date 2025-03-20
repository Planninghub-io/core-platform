
// Title extraction utilities
import type { EventData } from '../types.ts';

/**
 * Extract title from prompt using various patterns
 */
export function extractTitle(prompt: string): string {
  // Check for specific event names first (e.g. "Longhorn Tailgate")
  let explicitTitleMatch = prompt.match(/(?:the|a|an)\s+([A-Za-z]+(?:\s+[A-Za-z]+){1,3})\s+(?:event|party|gathering|meeting|tailgate)/i);
  if (explicitTitleMatch) {
    return explicitTitleMatch[1].trim();
  }
  
  // Tailgate pattern
  const tailgateMatch = prompt.match(/([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+tailgate/i);
  if (tailgateMatch) {
    return `${tailgateMatch[1]} Tailgate`;
  }
  
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
  
  return extractedTitle;
}

/**
 * Format title based on event type
 */
export function formatTitle(extractedTitle: string, prompt: string, location?: string): string {
  if (!extractedTitle) return "";

  // Format title based on what we found
  if (prompt.toLowerCase().includes("wedding")) {
    return `${extractedTitle}'s Wedding`;
  } else if (prompt.toLowerCase().includes("birthday")) {
    return `${extractedTitle}'s Birthday`;
  } else if (prompt.toLowerCase().includes("fundraiser")) {
    // Check if we have a location to include in the title
    if (location) {
      return `${location} ${extractedTitle} Fundraiser`;
    } else {
      return `${extractedTitle} Fundraiser`;
    }
  } else if (prompt.toLowerCase().includes("non-profit") || prompt.toLowerCase().includes("nonprofit")) {
    // Format non-profit event titles 
    if (location) {
      return `${location} Non-Profit Fundraiser`;
    } else {
      return `Non-Profit Fundraiser`;
    }
  }
  
  return extractedTitle;
}

/**
 * Handle special case for month name titles
 */
export function handleMonthNameTitle(title: string, prompt: string, location?: string): string {
  // If title is just a month name, make it more descriptive
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  
  if (monthNames.includes(title.toLowerCase())) {
    // Check if we can extract event type from prompt
    if (prompt.toLowerCase().includes("fundraiser")) {
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
  
  return title;
}
