import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import linguiConfig from '@/lingui.config';

export function localeMiddleware(request: NextRequest) {
  const pathnameLocale = linguiConfig.locales.find((locale) =>
    request.nextUrl.pathname.startsWith(`/${locale}`),
  );

  if (pathnameLocale === undefined) {
    const preferredLanguages = request.headers.get('accept-language') || '';
    const negotiator = new Negotiator({
      headers: { 'accept-language': preferredLanguages },
    });

    const locale =
      negotiator.language(linguiConfig.locales) || linguiConfig.sourceLocale!;

    const localeUrl = new URL(
      `/${locale}${request.nextUrl.pathname}`,
      request.nextUrl.origin,
    );

    const response = NextResponse.rewrite(localeUrl);
    response.headers.append('X-Language-Preference', locale);

    return response;
  } else {
    const response = NextResponse.next();
    response.headers.append('X-Language-Preference', pathnameLocale);

    return response;
  }
}
