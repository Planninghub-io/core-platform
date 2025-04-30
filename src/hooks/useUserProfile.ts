
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/types/user";
import { ensureUUID, safeCast } from "@/utils/supabaseHelpers";

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

      // Format the profile data with the correct type structure
      const formattedProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        first_name: profileData.first_name || null,
        last_name: profileData.last_name || null,
        contact_number: profileData.contact_number || null,
        middle_name: profileData.middle_name || null,
        name_suffix: profileData.name_suffix || null,
        address: profileData.address || null,
        avatar_url: profileData.avatar_url || null,
        stripe_account_id: profileData.stripe_account_id || null,
        dob: profileData.dob || null,
        user_type: profileData.user_type || 'individual',
        created_at: profileData.created_at || new Date().toISOString()
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
        .eq('user_id', ensureUUID(user.id));

      if (rolesError) {
        console.error('User roles fetch error:', rolesError);
        setIsLoading(false);
        return;
      }

      if (userRoles && userRoles.length > 0) {
        // Use type assertion to help TypeScript handle the nested data structure
        const userCompanies = userRoles
          .filter(role => role && typeof role === 'object' && 'companies' in role && role.companies)
          .map(role => {
            const company = role.companies;
            if (!company) return null;
            
            // Create a Company object with all properties correctly typed
            return {
              id: company.id || '',
              name: company.name || '',
              logo_url: company.logo_url || null,
              business_email: company.business_email || null,
              business_phone: company.business_phone || null,
              website_url: company.website_url || null
            } as Company;
          })
          .filter((company): company is Company => company !== null);

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
