declare module '*.po' {
  import { type Messages } from '@lingui/core';

  export const messages: Messages;
}

declare module '@/lingui.config' {
  import { LinguiConfig } from '@lingui/conf';

  export default {} as LinguiConfig;
  export type Locale = 'en' | 'fr';
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_URL: string;
      MAINTENANCE_MODE: 'on' | 'off';
    }
  }
}

export {};
