
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/types/user";

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
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setIsLoading(false);
        return;
      }

      // Format the date properly before setting it in state
      const formattedProfile = {
        ...profileData,
        email: user.email,
        dob: profileData.dob || null // Ensure dob is properly handled
      };

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
        .eq('user_id', user.id);

      if (rolesError) {
        console.error('User roles fetch error:', rolesError);
        setIsLoading(false);
        return;
      }

      if (userRoles && userRoles.length > 0) {
        const userCompanies: Company[] = userRoles
          .map(role => role.companies)
          .filter(company => company !== null)
          .map(company => ({
            id: company.id,
            name: company.name,
            logo_url: company.logo_url || undefined,
            business_email: company.business_email || undefined,
            business_phone: company.business_phone || undefined,
            website_url: company.website_url || undefined
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
