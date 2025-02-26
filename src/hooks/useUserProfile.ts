
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/types/user";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isBusinessUser, setIsBusinessUser] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return;
      }

      if (profileData) {
        setUserProfile({
          ...profileData,
          email: user.email
        });
      }

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
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    userProfile,
    companies,
    selectedCompany,
    setSelectedCompany,
    refreshUserProfile: fetchUserProfile,
    isBusinessUser
  };
}
