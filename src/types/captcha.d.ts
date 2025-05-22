
// Type definitions for Cloudflare Turnstile
interface Turnstile {
  render: (container: string | HTMLElement, params: TurnstileParams) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  execute: (widgetId?: string) => Promise<string>;
}

interface TurnstileParams {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  tabindex?: number;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (error: any) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export {};
