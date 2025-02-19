
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company, CompanyResponse } from "@/types/user";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, avatar_url, email, contact_number, dob')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(profileData);

        const { data: companyMembers, error: companyError } = await supabase
          .from('company_members')
          .select(`
            company:companies (
              id,
              name,
              logo_url,
              business_email,
              business_phone,
              website_url
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (companyError) throw companyError;

        const userCompanies = (companyMembers as CompanyResponse[] ?? [])
          .map(member => member.company)
          .filter((company): company is Company => 
            company !== null && 
            typeof company.id === 'string' && 
            typeof company.name === 'string'
          );

        setCompanies(userCompanies);
        if (userCompanies.length > 0 && !selectedCompany) {
          setSelectedCompany(userCompanies[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []); // Remove selectedCompany from dependencies

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { userProfile, companies, selectedCompany, setSelectedCompany, refreshUserProfile: fetchUserProfile };
}
