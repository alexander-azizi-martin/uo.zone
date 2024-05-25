import { type PropsWithChildren } from 'react';
import { loadI18n } from '@/lib/i18n';

import { I18nProvider } from './components/I18nProvider';
import { Main } from './components/Main';

interface LanguageLayoutProps extends PropsWithChildren {
  params: {
    locale: string;
  };
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const i18n = await loadI18n(params.locale);

  return (
    <I18nProvider locale={i18n.locale} messages={i18n.messages}>
      <Main>{children}</Main>
    </I18nProvider>
  );
}
