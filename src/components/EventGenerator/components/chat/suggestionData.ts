
// Suggestion data for autocomplete
export const EVENT_TYPE_SUGGESTIONS = [
  "birthday party", "wedding", "corporate event", "conference", 
  "team building", "retreat", "dinner party", "fundraiser",
  "concert", "workshop", "seminar", "meeting", "exhibition"
];

export const LOCATION_SUGGESTIONS = [
  "New York", "Los Angeles", "Chicago", "San Francisco", "Miami",
  "Seattle", "Austin", "Boston", "Denver", "Atlanta", "Dallas",
  "San Diego", "Portland", "Nashville", "Las Vegas", "Houston"
];

export const generateDateSuggestions = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Add some common date formats
  return [
    today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    "next weekend",
    "next month",
    "this Friday",
    "this Saturday"
  ];
};

// Generate suggestions based on input
export const generateSuggestions = (prompt: string): string[] => {
  if (prompt.trim() === '') {
    return [];
  }

  const words = prompt.toLowerCase().split(' ');
  const lastWord = words[words.length - 1];
  
  if (lastWord.length < 2) {
    return [];
  }

  // Check for potential event type
  const eventTypeSuggestions = EVENT_TYPE_SUGGESTIONS.filter(type => 
    type.toLowerCase().includes(lastWord)
  );

  // Check for potential location
  const locationSuggestions = LOCATION_SUGGESTIONS.filter(location => 
    location.toLowerCase().includes(lastWord)
  );

  // Combine suggestions
  const combinedSuggestions = [...eventTypeSuggestions, ...locationSuggestions];
  
  // Add date suggestions if text might be related to dates
  if (lastWord.includes('on') || lastWord.includes('at') || 
      prompt.toLowerCase().includes('date') || prompt.toLowerCase().includes('when')) {
    combinedSuggestions.push(...generateDateSuggestions());
  }

  // Limit suggestions to top 5 for better UX
  const filteredSuggestions = [...new Set(combinedSuggestions)].slice(0, 5);
  
  return filteredSuggestions;
};
