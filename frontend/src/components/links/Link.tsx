'use client';

import NextLink from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  useEffect,
  useMemo,
  useTransition,
} from 'react';

import linguiConfig from '@/lingui.config';

export const Link = forwardRef<
  ElementRef<typeof NextLink>,
  Omit<ComponentPropsWithoutRef<typeof NextLink>, 'href'> & {
    href: string;
  }
>(({ href, replace, ...props }, ref) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { locale } = useParams<{ locale: string }>()!;

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
    });

    if (isPending) {
      NProgress.start();

      return () => {
        NProgress.done();
      };
    }
  }, [isPending]);

  const localeHref = useMemo(() => {
    let hrefWithoutLocale = href.replace(
      new RegExp(`^/(${linguiConfig.locales.join('|')})`),
      '',
    );

    if (!hrefWithoutLocale.startsWith('/')) {
      hrefWithoutLocale = `/${hrefWithoutLocale}`;
    }

    const localeHref =
      locale === linguiConfig.sourceLocale
        ? `${hrefWithoutLocale}`
        : `/${locale}${hrefWithoutLocale}`;

    return localeHref;
  }, [locale, href]);

  return (
    <NextLink
      ref={ref}
      href={localeHref}
      onClick={(event) => {
        if (localeHref == pathname || event.defaultPrevented) {
          return;
        }

        event.preventDefault();

        startTransition(() => {
          if (replace) router.replace(localeHref);
          else router.push(localeHref);
        });
      }}
      {...props}
    />
  );
});
Link.displayName = NextLink.displayName;
