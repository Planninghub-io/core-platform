
// Type definitions for hCaptcha
interface HCaptcha {
  render(container: string | HTMLElement, params: HCaptchaParams): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
  execute(widgetId?: string, options?: { async: boolean }): Promise<string>;
}

interface HCaptchaParams {
  sitekey: string;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
  tabindex?: number;
  callback?: (response: string) => void;
  'expired-callback'?: () => void;
  'chalexpired-callback'?: () => void;
  'error-callback'?: (error: any) => void;
  'open-callback'?: () => void;
  'close-callback'?: () => void;
}

declare global {
  interface Window {
    hcaptcha?: HCaptcha;
  }
}

export {};
