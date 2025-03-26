
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if user is authenticated and handle signup dialog if needed
 */
export const checkAuthentication = async (
  promptCount: number, 
  isResubmitting: boolean,
  setShowSignUpDialog: (show: boolean) => void
): Promise<boolean> => {
  // Only check authentication for non-first prompts
  if (promptCount >= 1 && !isResubmitting) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setShowSignUpDialog(true);
      return false;
    }
  }
  
  return true;
};

// Helper function for showing sign up dialog
export const setShowSignUpDialog = (show: boolean) => {
  // Implementation would go here in a real component
  console.log("Would show sign up dialog:", show);
};
