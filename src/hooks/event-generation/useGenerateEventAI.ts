
import { useState } from "react";
import { MissingInfo, ChatMessage } from "./types";
import { useEventGenerator } from "./hooks/useEventGenerator";
import { useBudgetHandler } from "./hooks/useBudgetHandler";

export const useGenerateEventAI = () => {
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [additionalInfo, setAdditionalInfo] = useState<Record<string, string>>({});
  
  // Use the budget handler hook
  const {
    waitingForBudget,
    setWaitingForBudget,
    requestBudgetInChat
  } = useBudgetHandler(chatMessages, setChatMessages, additionalInfo, setAdditionalInfo);

  // Use the event generator hook
  const eventGenerator = useEventGenerator();

  return {
    ...eventGenerator,
    chatMessages,
    setChatMessages,
    waitingForBudget,
    setWaitingForBudget
  };
};
