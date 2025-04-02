
import React, { useState, useEffect } from 'react';
import { CircleDashed } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponseProcessorProps {
  message: Message;
  isLoading?: boolean;
}

export const AIResponseProcessor = ({ message, isLoading = false }: AIResponseProcessorProps) => {
  const [processedContent, setProcessedContent] = useState<React.ReactNode>('');

  // Process message content
  useEffect(() => {
    if (isLoading && message.role === 'assistant') {
      setProcessedContent(
        <div className="flex items-center space-x-2 animate-pulse">
          <CircleDashed className="h-4 w-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      );
      return;
    }

    // Process links
    const content = message.content || '';
    if (!content) {
      setProcessedContent('');
      return;
    }

    // Replace URLs with anchor tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const withLinks = content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        );
      }
      
      // Process text formatting
      const paragraphs = part.split('\n\n').map((paragraph, pIndex) => {
        // Process bold text
        const boldRegex = /\*\*(.*?)\*\*/g;
        const withBold = paragraph.split(boldRegex).map((text, bIndex) => {
          return bIndex % 2 === 1 ? <strong key={`bold-${bIndex}`}>{text}</strong> : text;
        });
        
        return (
          <p key={`p-${pIndex}`} className="mb-2">
            {withBold}
          </p>
        );
      });
      
      return <React.Fragment key={index}>{paragraphs}</React.Fragment>;
    });

    setProcessedContent(<>{withLinks}</>);
  }, [message.content, isLoading, message.role]);

  const bgColor = message.role === 'user' ? 'bg-gray-100' : 'bg-white';
  const border = message.role === 'user' ? '' : 'border-l-4 border-primary/20';
  const padding = message.role === 'user' ? 'py-2 px-3' : 'py-2 px-4';

  return (
    <div className={`rounded-md ${bgColor} ${border} ${padding}`}>
      {processedContent}
    </div>
  );
};
