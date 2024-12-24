import { type NextRequest, NextResponse } from 'next/server';
import urlJoin from 'url-join';

export function apiMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const serverUrl = urlJoin(process.env.SERVER_URL, request.nextUrl.pathname);
    console.log(serverUrl)
    return NextResponse.rewrite(serverUrl, {
      headers: { 'X-Forwarded-For': request.ip ?? '127.0.0.1' },
    });
  }
}
