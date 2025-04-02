
import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponseProcessorProps {
  message: Message;
  isLoading?: boolean;
}

export const AIResponseProcessor = ({ message, isLoading = false }: AIResponseProcessorProps) => {
  // Process and enhance the AI message content
  const processContent = (content: string): React.ReactNode => {
    if (!content) return null;
    
    // Format links as clickable elements
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const hasLinks = linkRegex.test(content);
    
    if (hasLinks) {
      const parts = content.split(linkRegex);
      const matches = content.match(linkRegex) || [];
      
      return (
        <>
          {parts.map((part, i) => {
            // If this is an even index, it's text content
            if (i % 2 === 0) {
              return <span key={i}>{formatText(part)}</span>;
            } 
            // If this is an odd index, it's a link
            const link = matches[Math.floor(i / 2)];
            return (
              <a 
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {link}
              </a>
            );
          })}
        </>
      );
    }
    
    // If no links, just format the text
    return formatText(content);
  };
  
  // Format text with bold, italics, etc.
  const formatText = (text: string): React.ReactNode => {
    // Process markdown-style formatting
    const parts = [];
    
    // Replace **bold** with <strong>
    const boldRegex = /\*\*(.*?)\*\*/g;
    let formattedText = text;
    let match;
    let lastIndex = 0;
    let index = 0;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${index}`}>{text.substring(lastIndex, match.index)}</span>);
        index++;
      }
      
      // Add the bold text
      parts.push(<strong key={`bold-${index}`}>{match[1]}</strong>);
      index++;
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${index}`}>{text.substring(lastIndex)}</span>);
    }
    
    return parts.length > 0 ? parts : formattedText;
  };
  
  // If message is loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-start">
        <div className="px-4 py-2 rounded-lg max-w-[80%] bg-muted text-foreground">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        }`}
      >
        {processContent(message.content)}
      </div>
    </div>
  );
};
