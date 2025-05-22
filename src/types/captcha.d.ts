
// Type definitions for Cloudflare Turnstile
interface Turnstile {
  render: (container: string | HTMLElement, params: TurnstileParams) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
  execute: (widgetId?: string) => Promise<string>;
  getResponse: (widgetId?: string) => string | undefined;
  isExpired: (widgetId?: string) => boolean;
}

interface TurnstileParams {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  tabindex?: number;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (error: any) => void;
  action?: string;
  cData?: string;
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export {};
