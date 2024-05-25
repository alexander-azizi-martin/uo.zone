'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type ComponentProps, useMemo } from 'react';

import linguiConfig from '@/lingui.config';

interface LocalLink extends Omit<ComponentProps<typeof Link>, 'href'> {
  locale: Locale;
}

export function LocaleLink({ locale, ...props }: LocalLink) {
  const pathname = usePathname() as string;
  const searchParams = useSearchParams();

  const href = useMemo(() => {
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

    return href.replace(/\?$/, '');
  }, [locale, pathname, searchParams]);

  return <Link href={href} {...props} />;
}
