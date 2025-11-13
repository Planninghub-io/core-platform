import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  modelProvider?: 'openai' | 'anthropic';
  context?: {
    hasDate?: boolean;
    hasLocation?: boolean;
    hasEventType?: boolean;
    collectedInfo?: Record<string, any>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { messages, modelProvider = 'openai', context = {} }: ChatRequest = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const systemPrompt = `You are a friendly and helpful AI event planning assistant. Your role is to:
1. Engage in natural, conversational dialogue with users about their event planning needs
2. Ask thoughtful follow-up questions to gather event details (date, location, event type, budget, number of attendees, theme, etc.)
3. Provide helpful suggestions and ideas based on what the user shares
4. Be enthusiastic and encouraging about their event plans
5. Guide users through the event planning process step by step
6. When you have enough information, summarize what you've learned and ask if they're ready to create the event

Context about what information has been collected:
- Date: ${context.hasDate ? 'Yes' : 'No'}
- Location: ${context.hasLocation ? 'Yes' : 'No'}
- Event Type: ${context.hasEventType ? 'Yes' : 'No'}
${context.collectedInfo ? `- Other details: ${JSON.stringify(context.collectedInfo)}` : ''}

Keep your responses concise (2-3 sentences), friendly, and focused on gathering information or providing helpful suggestions. Always end with a question or suggestion to keep the conversation flowing.`;

    let response;
    
    if (modelProvider === 'anthropic') {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          system: systemPrompt,
          messages: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          })),
        }),
      });
    } else {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content,
            })),
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to get AI response',
        details: errorText 
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.json();
    
    let aiResponse: string;
    if (modelProvider === 'anthropic') {
      aiResponse = data.content?.[0]?.text || 'I apologize, but I had trouble processing that. Could you try rephrasing?';
    } else {
      aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I had trouble processing that. Could you try rephrasing?';
    }

    // Extract suggested questions or prompts from the response
    const suggestions = extractSuggestions(aiResponse, context);

    return new Response(JSON.stringify({
      message: aiResponse,
      suggestions,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in chat-assistant:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

function extractSuggestions(response: string, context: any): string[] {
  const suggestions: string[] = [];
  
  // Generate contextual suggestions based on what's missing
  if (!context.hasDate) {
    suggestions.push('When would you like to hold the event?');
  }
  if (!context.hasLocation) {
    suggestions.push('Where would you like to host the event?');
  }
  if (!context.hasEventType) {
    suggestions.push('What type of event is this?');
  }
  
  // Extract questions from the AI response
  const questionMatches = response.match(/[^.!?]*\?/g);
  if (questionMatches && questionMatches.length > 0) {
    // Take the last question as a potential suggestion
    const lastQuestion = questionMatches[questionMatches.length - 1].trim();
    if (lastQuestion.length < 100) {
      suggestions.push(lastQuestion);
    }
  }
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
}

