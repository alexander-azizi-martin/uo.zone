import { type NextRequest } from 'next/server';
import { apiMiddleware } from './middleware/api-middleware';
import { filterParamMiddleware } from './middleware/filter-param-middleware';

const middlewares = [apiMiddleware, filterParamMiddleware];

export function middleware(request: NextRequest) {
  for (const m of middlewares) {
    const response = m(request);
    if (response) return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|static|image).*)',
};
