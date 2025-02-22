
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/types/user";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isBusinessUser, setIsBusinessUser] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Set user profile with auth email
      setUserProfile({
        ...profileData,
        email: user.email
      });

      // Fetch active company memberships for the user
      const { data: memberships, error: membershipError } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (membershipError) throw membershipError;

      if (memberships && memberships.length > 0) {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .in('id', memberships.map(m => m.company_id));

        if (companyError) throw companyError;

        if (companyData) {
          const userCompanies: Company[] = companyData.map(company => ({
            id: company.id,
            name: company.name,
            logo_url: company.logo_url || undefined,
            business_email: company.business_email || undefined,
            business_phone: company.business_phone || undefined,
            website_url: company.website_url || undefined
          }));

          setCompanies(userCompanies);
          setIsBusinessUser(true);

          // Set first company as selected if none is selected
          if (!selectedCompany && userCompanies.length > 0) {
            setSelectedCompany(userCompanies[0]);
          }
        }
      } else {
        setCompanies([]);
        setIsBusinessUser(false);
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Reset states on error
      setUserProfile(null);
      setCompanies([]);
      setIsBusinessUser(false);
      setSelectedCompany(null);
    }
  }, [selectedCompany]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    userProfile,
    companies,
    selectedCompany,
    setSelectedCompany,
    refreshUserProfile: fetchUserProfile,
    isBusinessUser
  };
}
