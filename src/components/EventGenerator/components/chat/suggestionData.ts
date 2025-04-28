// Suggestion data for autocomplete
export const EVENT_TYPE_SUGGESTIONS = [
  "birthday party", "wedding", "corporate event", "conference", 
  "team building", "retreat", "dinner party", "fundraiser",
  "concert", "workshop", "seminar", "meeting", "exhibition"
];

// Expanded city suggestions with international options
export const LOCATION_SUGGESTIONS = [
  // Major US cities
  "New York", "Los Angeles", "Chicago", "San Francisco", "Miami",
  "Seattle", "Austin", "Boston", "Denver", "Atlanta", "Dallas",
  "San Diego", "Portland", "Nashville", "Las Vegas", "Houston",
  // International cities
  "London", "Paris", "Tokyo", "Sydney", "Berlin", "Barcelona",
  "Toronto", "Vancouver", "Rome", "Amsterdam", "Dubai",
  // US states/locations
  "California", "Texas", "Florida", "Arizona", "Colorado",
  // Other specific locations
  "leander tx", "las vegas", "los angeles", "lonoke arkansas", "la"
];

export const BUDGET_SUGGESTIONS = [
  "low budget", "under $1000", "budget friendly", "luxury", "high end",
  "$500 budget", "$1000 budget", "$5000 budget", "$10000 budget"
];

export const ATTENDEE_SUGGESTIONS = [
  "10 people", "20 guests", "50 attendees", "100 guests", "small group",
  "large group", "family only", "corporate team"
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

// Generate suggestions based on input with Google-like matching
export const generateSuggestions = (prompt: string): string[] => {
  if (prompt.trim() === '') {
    return [];
  }

  const words = prompt.toLowerCase().trim().split(/\s+/);
  const lastWord = words[words.length - 1];
  
  // Only show suggestions for words with 2+ characters
  if (lastWord.length < 1) {
    return [];
  }

  let allSuggestions: string[] = [];
  
  // Extract potential categories based on prompt context
  const isEventTypeQuery = prompt.toLowerCase().includes('plan') || 
                          prompt.toLowerCase().includes('organize') ||
                          prompt.toLowerCase().includes('arrange') ||
                          prompt.toLowerCase().includes('host');
  
  const isLocationQuery = prompt.toLowerCase().includes('in ') || 
                         prompt.toLowerCase().includes('at ') ||
                         prompt.toLowerCase().includes('near') ||
                         prompt.toLowerCase().includes('location');
  
  const isBudgetQuery = prompt.toLowerCase().includes('budget') || 
                       prompt.toLowerCase().includes('cost') ||
                       prompt.toLowerCase().includes('price') ||
                       prompt.toLowerCase().includes('afford');

  // Filter for location suggestions
  if (isLocationQuery || lastWord.length >= 1) {
    // For location queries, complete the location after "in" or "at"
    // For example, "plan event in l" -> suggest locations starting with "l"
    const locationSuggestions = LOCATION_SUGGESTIONS.filter(location => 
      location.toLowerCase().startsWith(lastWord)
    );
    
    allSuggestions.push(...locationSuggestions);
  }
  
  // Only add event type suggestions if specifically relevant
  if (isEventTypeQuery || words.length <= 3) {
    const eventTypeSuggestions = EVENT_TYPE_SUGGESTIONS.filter(type => 
      type.toLowerCase().includes(lastWord)
    );
    
    allSuggestions.push(...eventTypeSuggestions);
  }
  
  // Add budget suggestions if query has budget context
  if (isBudgetQuery || lastWord === "low" || lastWord === "high" || lastWord === "budget") {
    const budgetSuggestions = BUDGET_SUGGESTIONS.filter(budget =>
      budget.toLowerCase().startsWith(lastWord)
    );
    
    allSuggestions.push(...budgetSuggestions);
  }
  
  // Add date suggestions if text might be related to dates
  if (lastWord.includes('on') || lastWord.includes('at') || 
      prompt.toLowerCase().includes('date') || prompt.toLowerCase().includes('when')) {
    allSuggestions.push(...generateDateSuggestions());
  }
  
  // Ensure all suggestions are relevant to the last word
  const relevantSuggestions = allSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(lastWord)
  );

  // Limit to most relevant suggestions
  const result = [...new Set(relevantSuggestions)]
    .sort((a, b) => {
      // Prioritize suggestions that start with the last word
      const aStartsWithLastWord = a.toLowerCase().startsWith(lastWord);
      const bStartsWithLastWord = b.toLowerCase().startsWith(lastWord);
      
      if (aStartsWithLastWord && !bStartsWithLastWord) return -1;
      if (!aStartsWithLastWord && bStartsWithLastWord) return 1;
      
      // If both start with last word or neither do, sort by length
      return a.length - b.length;
    })
    .slice(0, 7); // Show up to 7 suggestions
  
  return result;
};
