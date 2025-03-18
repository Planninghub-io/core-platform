
import { useState, useEffect } from "react";
import { ChatMessage } from "../types";
import { createBudgetRequestMessage } from "../utils/chatMessageUtils";
import { extractBudgetFromMessage } from "../utils/budgetUtils";

export const useBudgetHandler = (
  chatMessages: ChatMessage[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  additionalInfo: Record<string, string>,
  setAdditionalInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  const [waitingForBudget, setWaitingForBudget] = useState(false);

  useEffect(() => {
    // Process budget from user messages only when we're waiting for budget input
    if (waitingForBudget && chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      
      // Only process user messages, not AI responses
      if (lastMessage.type === 'user') {
        const extractedBudget = extractBudgetFromMessage(lastMessage.content);
        
        if (extractedBudget) {
          setAdditionalInfo(prev => ({ ...prev, budget: extractedBudget }));
          setWaitingForBudget(false);
        }
      }
    }
  }, [chatMessages, waitingForBudget, setAdditionalInfo]);

  const requestBudgetInChat = () => {
    setWaitingForBudget(true);
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: createBudgetRequestMessage()
    }]);
  };

  return {
    waitingForBudget,
    setWaitingForBudget,
    requestBudgetInChat
  };
};
