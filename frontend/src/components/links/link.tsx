'use client';

import NextLink from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  useEffect,
  useTransition,
} from 'react';

import linguiConfig from '@/lingui.config';

// Needs to override href type since NextLink href is of type Url
interface LinkProps
  extends Omit<ComponentPropsWithoutRef<typeof NextLink>, 'href'> {
  href: string;
}

const Link = forwardRef<ElementRef<typeof NextLink>, LinkProps>(
  ({ href, replace, ...props }, ref) => {
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
  },
);
Link.displayName = NextLink.displayName;

export { Link };

export type { LinkProps };
