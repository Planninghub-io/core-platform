
// Description processing utilities

/**
 * Generate an improved description based on event details
 */
export function improveDescription(description: string | undefined, title: string, location: string, category: string): string {
  // Clean up description by removing redundant "Additional details" text
  if (description) {
    description = description.replace(/Additional details: (?:date|location|budget): [^.]+(?:, )?/g, '').trim();
  }
  
  // Generate a better description if it's too short or missing
  if (!description || description.length < 30) {
    if (title && title.toLowerCase().includes('tailgate')) {
      return `Join us for an exciting ${title} at ${location || 'our venue'}. Enjoy food, drinks, and team spirit before the big game. Bring your friends and family for this fun pre-game tradition!`;
    } else if (category === 'Wedding') {
      return `Join us in celebrating a special day at ${location || 'our venue'} for this beautiful wedding event. Share in the joy and festivities as we witness a couple begin their journey together.`;
    } else if (category === 'Birthday Party') {
      return `Come celebrate at ${location || 'our venue'} for a birthday celebration. There will be food, fun, and festivities for everyone to enjoy!`;
    } else if (category === 'Fundraiser') {
      return `Support a great cause at our fundraising event in ${location || 'our venue'}. Your contribution makes a difference in our community.`;
    } else if (category === 'Corporate') {
      return `Join industry professionals at ${location || 'our venue'} for networking and collaboration opportunities. Expand your professional connections and gain valuable insights.`;
    } else {
      return `Join us for ${title || 'our event'} at ${location || 'our venue'}. We look forward to seeing you there!`;
    }
  }
  
  return description;
}

/**
 * Generate an image prompt based on event details
 */
export function generateImagePrompt(title: string, location: string): string {
  return `A high-quality professional photograph of "${title || "social gathering"}" at ${location || "a venue"}, showing the venue decorated for the event with people enjoying themselves`;
}
