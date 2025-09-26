// Global type definitions

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: any
    ) => void;
    eaAnalytics?: any;
  }
}

// Make sure this file is treated as a module
export {};