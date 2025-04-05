
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/types/user";
import { ensureUUID } from "@/utils/supabaseHelpers";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        setUserProfile(null);
        setCompanies([]);
        setIsBusinessUser(false);
        setSelectedCompany(null);
        setIsLoading(false);
        return;
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', ensureUUID(user.id))
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setIsLoading(false);
        return;
      }

      if (!profileData) {
        console.error('No profile data found');
        setIsLoading(false);
        return;
      }

      // Format the date properly before setting it in state
      const formattedProfile = {
        id: user.id,
        email: user.email || '',
        ...profileData,
        dob: profileData.dob || null // Ensure dob is properly handled
      } as UserProfile;

      console.log('Fetched profile:', formattedProfile); // Debug log
      setUserProfile(formattedProfile);

      // Fetch user's companies through user_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          company_id,
          companies (
            id,
            name,
            logo_url,
            business_email,
            business_phone,
            website_url
          )
        `)
        .eq('user_id', ensureUUID(user.id));

      if (rolesError) {
        console.error('User roles fetch error:', rolesError);
        setIsLoading(false);
        return;
      }

      if (userRoles && userRoles.length > 0) {
        const userCompanies: Company[] = userRoles
          .filter(role => role.companies)
          .map(role => ({
            id: role.companies?.id || '',
            name: role.companies?.name || '',
            logo_url: role.companies?.logo_url,
            business_email: role.companies?.business_email,
            business_phone: role.companies?.business_phone,
            website_url: role.companies?.website_url
          }));

        setCompanies(userCompanies);
        setIsBusinessUser(userCompanies.length > 0);

        if (!selectedCompany && userCompanies.length > 0) {
          setSelectedCompany(userCompanies[0]);
        }
      } else {
        setCompanies([]);
        setIsBusinessUser(false);
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
      setCompanies([]);
      setIsBusinessUser(false);
      setSelectedCompany(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    fetchUserProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    userProfile,
    companies,
    selectedCompany,
    setSelectedCompany,
    refreshUserProfile: fetchUserProfile,
    isBusinessUser,
    isLoading
  };
}
