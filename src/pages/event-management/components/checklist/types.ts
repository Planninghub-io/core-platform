
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  timeline: string;
  completed: boolean;
}

export interface TimelineSection {
  timeline: string;
  items: {
    title: string;
    description: string;
    category: string;
  }[];
}

export interface CategoryData {
  value: string;
  label: string;
}
