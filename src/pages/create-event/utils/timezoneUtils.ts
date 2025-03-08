
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
