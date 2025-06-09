
// Timezone options with added short codes
export const TIMEZONES = [
  { value: "UTC", label: "Universal Time Coordinated (UTC)", short: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)", short: "ET" },
  { value: "America/Chicago", label: "Central Time (CT)", short: "CT" },
  { value: "America/Denver", label: "Mountain Time (MT)", short: "MT" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", short: "PT" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)", short: "GMT" },
  { value: "Europe/Paris", label: "Central European Time (CET)", short: "CET" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", short: "JST" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)", short: "CST" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)", short: "AET" }
];

/**
 * Find the timezone short code from its value
 */
export const getTimezoneShort = (value: string) => {
  const zone = TIMEZONES.find(tz => tz.value === value);
  return zone?.short || value;
};

/**
 * Auto-detect timezone based on location
 */
export const getTimezoneFromLocation = (location: string): string => {
  if (!location) return "America/New_York"; // Default fallback
  
  const locationLower = location.toLowerCase();
  
  // US States and Cities
  if (locationLower.includes('california') || locationLower.includes('los angeles') || 
      locationLower.includes('san francisco') || locationLower.includes('sf') || 
      locationLower.includes('sacramento') || locationLower.includes('san diego') ||
      locationLower.includes('oakland') || locationLower.includes('fresno')) {
    return "America/Los_Angeles";
  }
  
  if (locationLower.includes('new york') || locationLower.includes('nyc') || 
      locationLower.includes('manhattan') || locationLower.includes('brooklyn') ||
      locationLower.includes('florida') || locationLower.includes('miami') ||
      locationLower.includes('georgia') || locationLower.includes('atlanta') ||
      locationLower.includes('virginia') || locationLower.includes('washington dc') ||
      locationLower.includes('massachusetts') || locationLower.includes('boston') ||
      locationLower.includes('pennsylvania') || locationLower.includes('philadelphia')) {
    return "America/New_York";
  }
  
  if (locationLower.includes('texas') || locationLower.includes('dallas') || 
      locationLower.includes('houston') || locationLower.includes('austin') ||
      locationLower.includes('chicago') || locationLower.includes('illinois') ||
      locationLower.includes('minnesota') || locationLower.includes('wisconsin') ||
      locationLower.includes('iowa') || locationLower.includes('missouri')) {
    return "America/Chicago";
  }
  
  if (locationLower.includes('colorado') || locationLower.includes('denver') ||
      locationLower.includes('utah') || locationLower.includes('arizona') ||
      locationLower.includes('new mexico') || locationLower.includes('montana') ||
      locationLower.includes('wyoming')) {
    return "America/Denver";
  }
  
  // International locations
  if (locationLower.includes('london') || locationLower.includes('uk') || 
      locationLower.includes('united kingdom') || locationLower.includes('england') ||
      locationLower.includes('scotland') || locationLower.includes('wales')) {
    return "Europe/London";
  }
  
  if (locationLower.includes('paris') || locationLower.includes('france') ||
      locationLower.includes('germany') || locationLower.includes('berlin') ||
      locationLower.includes('italy') || locationLower.includes('spain') ||
      locationLower.includes('netherlands') || locationLower.includes('belgium')) {
    return "Europe/Paris";
  }
  
  if (locationLower.includes('tokyo') || locationLower.includes('japan') ||
      locationLower.includes('osaka') || locationLower.includes('kyoto')) {
    return "Asia/Tokyo";
  }
  
  if (locationLower.includes('china') || locationLower.includes('beijing') ||
      locationLower.includes('shanghai') || locationLower.includes('guangzhou')) {
    return "Asia/Shanghai";
  }
  
  if (locationLower.includes('sydney') || locationLower.includes('australia') ||
      locationLower.includes('melbourne') || locationLower.includes('brisbane')) {
    return "Australia/Sydney";
  }
  
  // Default to Eastern Time for US locations or UTC for unknown
  return "America/New_York";
};
