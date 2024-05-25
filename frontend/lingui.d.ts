declare module '*.po' {
  import { type Messages } from '@lingui/core';

  export const messages: Messages;
}

type Locale = 'en' | 'fr';
