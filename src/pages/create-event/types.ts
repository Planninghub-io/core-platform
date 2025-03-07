
export interface EventFormData {
  title: string;
  description: string;
  date: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string;
  preferredLocations: string;
  budget: string;
  budgetCurrency: string;
  attendees: string;
  eventType: string;
  venueType: string;
  imageUrl: string;
  isFlexibleDate: boolean;
  isFlexibleLocation: boolean;
}
