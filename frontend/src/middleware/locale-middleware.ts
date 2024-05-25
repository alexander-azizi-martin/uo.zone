import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import linguiConfig from '@/lingui.config';

export function localeMiddleware(request: NextRequest) {
  const pathnameHasLocale = linguiConfig.locales.some((locale) =>
    request.nextUrl.pathname.startsWith(`/${locale}`),
  );

  if (!pathnameHasLocale) {
    const preferredLanguages = request.headers.get('accept-language') || '';
    const negotiator = new Negotiator({
      headers: { 'accept-language': preferredLanguages },
    });

    const locale =
      negotiator.language(linguiConfig.locales) || linguiConfig.sourceLocale;

    const localeUrl = new URL(
      `/${locale}${request.nextUrl.pathname}`,
      request.nextUrl.origin,
    );

    return NextResponse.rewrite(localeUrl);
  }
}
