import { type NextRequest, NextResponse } from 'next/server';

import linguiConfig from '@/lingui.config';

export function maintenanceMiddleware(request: NextRequest) {
  const hasValidLocale = linguiConfig.locales.some((locale) =>
    request.nextUrl.pathname.startsWith(`/${locale}`),
  );
  const isMaintenancePage =
    (hasValidLocale && request.nextUrl.pathname.endsWith('/maintenance')) ||
    request.nextUrl.pathname === '/maintenance';

    if (process.env.MAINTENANCE_MODE === 'on' && !isMaintenancePage) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  if (process.env.MAINTENANCE_MODE === 'off' && isMaintenancePage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
