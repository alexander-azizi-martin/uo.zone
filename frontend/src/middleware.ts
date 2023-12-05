import { NextRequest, NextResponse } from 'next/server';
import urlJoin from 'url-join';

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const serverUrl = urlJoin(
      process.env.SERVER_URL as string,
      request.nextUrl.pathname
    );
    
    return NextResponse.rewrite(serverUrl, {
      headers: { 'X-Forwarded-For': request.ip ?? '127.0.0.1' },
    });
  }
}
