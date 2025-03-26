
import { checkAuthentication } from "../utils/authUtils";

/**
 * Verify user is authenticated for generating events
 */
export const verifyAuthentication = async (
  promptCount: number,
  isResubmitting: boolean,
  setShowSignUpDialog: (show: boolean) => void
): Promise<boolean> => {
  return await checkAuthentication(promptCount, isResubmitting, setShowSignUpDialog);
};
