
// Title processing utilities

/**
 * Improve the event title based on prompt and extracted information
 */
export function improveEventTitle(title: string, prompt: string, location: string): string {
  // If title contains a city name but not a descriptive event name, improve it
  const commonCities = ['Austin', 'Dallas', 'Houston', 'Chicago', 'New York', 'Boston'];
  
  // Check if the title is just a city name
  if (commonCities.some(city => title.includes(city))) {
    if (prompt.toLowerCase().includes('tailgate')) {
      return `${title} Tailgate`;
    } else if (prompt.toLowerCase().includes('party')) {
      return `${title} Party`;
    } else if (prompt.toLowerCase().includes('festival')) {
      return `${title} Festival`;
    }
  }
  
  // Check for specific event types in prompt
  if (prompt.toLowerCase().includes('longhorn')) {
    return 'Longhorn Tailgate Event';
  }
  
  // If title is empty or too generic, but we have a location
  if ((!title || title === "Upcoming Event") && location) {
    if (prompt.toLowerCase().includes('tailgate')) {
      return `${location} Tailgate Event`;
    } else if (prompt.toLowerCase().includes('concert')) {
      return `${location} Concert`;
    } else if (prompt.toLowerCase().includes('networking')) {
      return `${location} Networking Event`;
    } else {
      return `${location} Event`;
    }
  }
  
  return title;
}

/**
 * Generate a more descriptive title for month-only titles
 */
export function improveTitleForMonthNames(title: string, prompt: string, location: string): string {
  if (!title) return '';
  
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 
                     'august', 'september', 'october', 'november', 'december'];
  
  if (monthNames.includes(title.toLowerCase())) {
    if (prompt.toLowerCase().includes('fundraiser')) {
      return `${location || ''} Fundraiser`.trim();
    } else if (prompt.toLowerCase().includes('meeting')) {
      return `${location || ''} Meeting`.trim();
    } else if (prompt.toLowerCase().includes('conference')) {
      return `${location || ''} Conference`.trim();
    } else if (prompt.toLowerCase().includes('party')) {
      return `${location || ''} Party`.trim();
    } else if (prompt.toLowerCase().includes('tailgate')) {
      return `${location || ''} Tailgate Event`.trim();
    } else {
      return `${location || ''} Event`.trim();
    }
  }
  
  // Special case for Longhorn Tailgate
  if (prompt.toLowerCase().includes('longhorn') && prompt.toLowerCase().includes('tailgate')) {
    return 'Longhorn Tailgate Event';
  }
  
  return title;
}
