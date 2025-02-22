
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company, CompanyResponse } from "@/types/user";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isBusinessUser, setIsBusinessUser] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // First get the auth user email
        const authEmail = user.email;

        // Then fetch the profile data
        const { data: profileData, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Combine auth email with profile data
        const completeProfile = {
          ...profileData,
          email: authEmail // Ensure email is always included from auth
        };

        setUserProfile(completeProfile);

        // Fetch company memberships separately to avoid recursion
        const { data: memberships, error: membershipError } = await supabase
          .from('company_members')
          .select('company_id, role, status')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (membershipError) throw membershipError;

        if (memberships && memberships.length > 0) {
          // Then fetch the company details for all memberships
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('id, name, logo_url, business_email, business_phone, website_url')
            .in('id', memberships.map(m => m.company_id));

          if (companyError) throw companyError;

          const userCompanies = (companyData ?? []).map(company => ({
            id: company.id,
            name: company.name,
            logo_url: company.logo_url ?? undefined,
            business_email: company.business_email ?? undefined,
            business_phone: company.business_phone ?? undefined,
            website_url: company.website_url ?? undefined
          }));

          setCompanies(userCompanies);
          setIsBusinessUser(userCompanies.length > 0);
          
          if (userCompanies.length > 0 && !selectedCompany) {
            setSelectedCompany(userCompanies[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
