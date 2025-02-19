
import { UserProfile } from "@/types/user";

export const getInitials = (profile: UserProfile) => {
  const first = profile.first_name?.[0] || '';
  const last = profile.last_name?.[0] || '';
  return (first + last).toUpperCase() || profile.email?.[0].toUpperCase() || 'U';
};

export const getDisplayName = (profile: UserProfile) => {
  if (profile.first_name || profile.last_name) {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  }
  return profile.email?.split('@')[0] || 'User';
};
