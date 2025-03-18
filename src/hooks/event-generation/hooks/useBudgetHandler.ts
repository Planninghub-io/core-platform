
import { useState, useEffect } from "react";
import { ChatMessage } from "../types";
import { createBudgetRequestMessage } from "../utils/chatMessageUtils";

export const useBudgetHandler = (
  chatMessages: ChatMessage[],
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  additionalInfo: Record<string, string>,
  setAdditionalInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  const [waitingForBudget, setWaitingForBudget] = useState(false);

  useEffect(() => {
    // If we're waiting for budget and the last message was from the user, 
    // check if it contains budget information
    if (waitingForBudget && chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === 'user') {
      const lastMessage = chatMessages[chatMessages.length - 1].content;
      
      // Try to extract budget from user's message
      const budgetRegex = /(?:budget(?:\s+of)?\s+)?\$?(\d+)(?:\s+(?:dollars|USD))?/i;
      const budgetMatch = lastMessage.match(budgetRegex);
      
      if (budgetMatch) {
        // If budget is found, update additionalInfo
        const extractedBudget = `$${budgetMatch[1]}`;
        setAdditionalInfo(prev => ({ ...prev, budget: extractedBudget }));
        setWaitingForBudget(false);
      } else if (lastMessage.toLowerCase().includes('free') || lastMessage.toLowerCase().includes('no budget')) {
        // Handle "free" event case
        setAdditionalInfo(prev => ({ ...prev, budget: 'Free' }));
        setWaitingForBudget(false);
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
