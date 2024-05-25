import { type Messages, setupI18n } from '@lingui/core';
import { setI18n } from '@lingui/react/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import linguiConfig from '@/lingui.config';

const loadMessages = cache(async (locale: string) => {
  return (await import(`@/locales/${locale}.js`)).messages as Messages;
});

export const getI18n = cache(() => setupI18n());

export async function loadI18n(locale: string) {
  if (!linguiConfig.locales.includes(locale)) {
    notFound();
  }

  const i18n = getI18n();
  setI18n(i18n);
  if (i18n.locale !== locale) {
    const messages = await loadMessages(locale);
    i18n.loadAndActivate({ locale, messages });
  }

  return i18n;
}
