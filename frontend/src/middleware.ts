import { type NextRequest } from 'next/server';

import { apiMiddleware } from './middleware/api-middleware';
import { filterParamMiddleware } from './middleware/filter-param-middleware';
import { localeMiddleware } from './middleware/locale-middleware';

const middlewares = [apiMiddleware, filterParamMiddleware, localeMiddleware];

export function middleware(request: NextRequest) {
  for (const m of middlewares) {
    const response = m(request);
    if (response) return response;
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|static|stats).*)',
};
