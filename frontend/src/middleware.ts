import { NextRequest, NextResponse } from 'next/server';
import urlJoin from 'url-join';

import { getRandomServerUrl } from '~/lib/helpers';

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const serverUrl = urlJoin(getRandomServerUrl(), request.nextUrl.pathname);

    return NextResponse.rewrite(serverUrl, {
      headers: { 'X-Forwarded-For': request.ip ?? '127.0.0.1' },
    });
  }
}
