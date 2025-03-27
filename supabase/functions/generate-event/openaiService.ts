
// Functions for interacting with OpenAI and Anthropic APIs

import type { EventData } from './types.ts';

/**
 * Generate image for event using OpenAI
 */
export async function generateEventImage(imagePrompt: string): Promise<string | null> {
  try {
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024"
      })
    });

    if (!imageResponse.ok) {
      console.error('Image generation error:', await imageResponse.text());
      return null;
    }

    const imageData = await imageResponse.json();
    return imageData.data?.[0]?.url || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

/**
 * Generate event details using OpenAI
 */
export async function generateEventWithAI(prompt: string, provider: string = 'openai'): Promise<Partial<EventData>> {
  try {
    if (provider === 'anthropic') {
      return await generateEventWithAnthropic(prompt);
    } else {
      return await generateEventWithOpenAI(prompt);
    }
  } catch (error) {
    console.error(`Error generating event with ${provider}:`, error);
    return {
      missingFields: ['date', 'location']
    };
  }
}

/**
 * Generate event details using OpenAI
 */
async function generateEventWithOpenAI(prompt: string): Promise<Partial<EventData>> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an event planning assistant. Generate compelling event details from user prompts. 
            Always create an engaging title that captures the event's essence. 
            For image prompts, create detailed descriptions focusing on the event's atmosphere and setting.`
          },
          {
            role: "user",
            content: `Create an event based on this description: ${prompt}. 
            Include a catchy title, detailed description, location, category, and estimated price range.
            Also create a detailed image prompt that captures the event's atmosphere.`
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      console.error('AI generation error:', await response.text());
      return { missingFields: ['date', 'location'] };
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return parseEventContent(content);
  } catch (error) {
    console.error('Error generating event with OpenAI:', error);
    return { missingFields: ['date', 'location'] };
  }
}

/**
 * Generate event details using Anthropic Claude
 */
async function generateEventWithAnthropic(prompt: string): Promise<Partial<EventData>> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: `You are an event planning assistant. Generate compelling event details from user prompts. 
          Always create an engaging title that captures the event's essence. 
          For image prompts, create detailed descriptions focusing on the event's atmosphere and setting.`,
        messages: [
          {
            role: 'user',
            content: `Create an event based on this description: ${prompt}. 
              Include a catchy title, detailed description, location, category, and estimated price range.
              Also create a detailed image prompt that captures the event's atmosphere.`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI generation error:', await response.text());
      return { missingFields: ['date', 'location'] };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    return parseEventContent(content);
  } catch (error) {
    console.error('Error generating event with Anthropic:', error);
    return { missingFields: ['date', 'location'] };
  }
}

/**
 * Parse the response content and extract event details
 */
function parseEventContent(content: string): Partial<EventData> {
  // Parse the response and extract event details
  const lines = content.split('\n');
  let event: Partial<EventData> = {
    missingFields: []
  };
  
  // Initialize default values for required fields
  event.date = '';
  event.location = '';
  event.estimatedPrice = '';
  event.category = '';
  event.title = '';
  event.description = '';
  
  lines.forEach(line => {
    if (line.toLowerCase().startsWith('title:')) event.title = line.split(':')[1].trim();
    if (line.toLowerCase().startsWith('description:')) event.description = line.split(':')[1].trim();
    if (line.toLowerCase().startsWith('location:')) event.location = line.split(':')[1].trim();
    if (line.toLowerCase().startsWith('category:')) event.category = line.split(':')[1].trim();
    if (line.toLowerCase().startsWith('estimated price:')) event.estimatedPrice = line.split(':')[1].trim();
    if (line.toLowerCase().startsWith('image prompt:')) event.imagePrompt = line.split(':')[1].trim();
  });
  
  // Check missing fields
  const missingFields = [];
  if (!event.date) missingFields.push('date');
  if (!event.location) missingFields.push('location');
  if (!event.estimatedPrice) missingFields.push('budget');
  
  // Add missingFields to the event object
  event.missingFields = missingFields;

  return event;
}
