'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type ComponentProps } from 'react';

import linguiConfig, { type Locale } from '@/lingui.config';

interface LocalLink extends Omit<ComponentProps<typeof Link>, 'href'> {
  locale: Locale;
}

function LocaleLink({ locale, ...props }: LocalLink) {
  const pathname = usePathname() as string;
  const searchParams = useSearchParams();

  let pathnameWithoutLocale = pathname.replace(
    new RegExp(`^/(${linguiConfig.locales.join('|')})`),
    '',
  );

  if (!pathnameWithoutLocale.startsWith('/')) {
    pathnameWithoutLocale = `/${pathnameWithoutLocale}`;
  }

  const href =
    locale === linguiConfig.sourceLocale
      ? `${pathnameWithoutLocale}?${searchParams}`
      : `/${locale}${pathnameWithoutLocale}?${searchParams}`;

  return <Link href={href.replace(/\?$/, '')} {...props} />;
}

export { LocaleLink };
