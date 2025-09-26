// Google Analytics type definitions
declare function gtag(
  command: 'config' | 'event' | 'js' | 'set',
  targetId: string,
  config?: any
): void;

declare function gtag(command: 'consent', action: 'default' | 'update', config: any): void;