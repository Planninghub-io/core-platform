
// Description and category extraction utilities
import type { EventData } from '../types.ts';

/**
 * Generate a description based on event details
 */
export function generateDescription(title: string, location: string, prompt: string): string {
  if (title && location) {
    if (prompt.toLowerCase().includes("tailgate")) {
      return `Join us for the ${title} at ${location}. Enjoy food, drinks, and fun before the big game!`;
    } else if (prompt.toLowerCase().includes("wedding")) {
      return `Celebrate a special day at the beautiful ${title} in ${location}. Join us for this memorable wedding event.`;
    } else if (prompt.toLowerCase().includes("birthday")) {
      return `Join us for a celebration at ${location} for this special birthday event.`;
    } else if (prompt.toLowerCase().includes("fundraiser")) {
      return `Support a great cause at the ${title} in ${location}. All proceeds will go to charity.`;
    } else if (prompt.toLowerCase().includes("conference")) {
      return `Join industry leaders and experts at the ${title} in ${location} for networking and knowledge sharing.`;
    } else {
      return `Join us for ${title} at ${location}. Don't miss this exciting event!`;
    }
  }
  
  return "";
}

/**
 * Extract description directly from prompt
 */
export function extractDescriptionFromPrompt(prompt: string): string | null {
  const descriptionMatch = prompt.match(/description:?\s*([^,.]+(?:[^.]+)?)/i);
  
  if (descriptionMatch) {
    let description = descriptionMatch[1].trim();
    
    // Clean up description by removing "Additional details: " section
    if (description.includes("Additional details:")) {
      description = description.split("Additional details:")[0].trim();
    }
    
    return description;
  }
  
  return null;
}

/**
 * Determine event category based on prompt
 */
export function determineCategory(prompt: string): string {
  const categoryMatch = prompt.match(/category:?\s*([^,.]+)/i);
  if (categoryMatch) {
    return categoryMatch[1].trim();
  }
  
  if (prompt.toLowerCase().includes("wedding")) {
    return "Wedding";
  } else if (prompt.toLowerCase().includes("birthday")) {
    return "Birthday Party";
  } else if (prompt.toLowerCase().includes("fundraiser")) {
    return "Fundraiser";
  } else if (prompt.toLowerCase().includes("corporate") || prompt.toLowerCase().includes("business")) {
    return "Corporate";
  } else if (prompt.toLowerCase().includes("tailgate")) {
    return "Sports & Recreation";
  } else {
    return "Other";
  }
}
