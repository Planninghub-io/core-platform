
import { ChatMessage } from "../types";
import { findLastUserPrompt } from "../utils/chatUtils";

/**
 * Hook to handle regenerating events with updated information
 */
export const useEventRegeneration = (
  chatMessages: ChatMessage[],
  generateEvent: (prompt: string, providedInfo?: Record<string, string>) => Promise<any>
) => {
  /**
   * Regenerate an event with updated information
   */
  const regenerateEventWithUpdatedInfo = async (additionalInfo: Record<string, string>) => {
    const lastUserPrompt = findLastUserPrompt(chatMessages);
    if (lastUserPrompt) {
      console.log("Regenerating event with additional info:", additionalInfo);
      return generateEvent(lastUserPrompt, additionalInfo);
    }
    return { error: new Error("No valid prompt found for regeneration") };
  };

  return {
    regenerateEventWithUpdatedInfo
  };
};
