import { NextRequest, NextResponse } from 'next/server';
import urlJoin from 'url-join';

import { getRandomServerUrl } from '~/lib/helpers';

const NEW_PARAM_NAME: { [k: string]: string } = {
  sort: 'sortBy',
  langs: 'languages',
};

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const serverUrl = urlJoin(getRandomServerUrl(), request.nextUrl.pathname);

    return NextResponse.rewrite(serverUrl, {
      headers: { 'X-Forwarded-For': request.ip ?? '127.0.0.1' },
    });
  }

  const parsedUrl = new URL(request.url);
  for (const [param, value] of parsedUrl.searchParams.entries()) {
    if (param in NEW_PARAM_NAME) {
      parsedUrl.searchParams.set(NEW_PARAM_NAME[param], value ?? '');
      parsedUrl.searchParams.delete(param);
    }
  }

  const newUrl = parsedUrl.toString();
  if (newUrl !== request.url) {
    return NextResponse.redirect(newUrl);
  }
}
