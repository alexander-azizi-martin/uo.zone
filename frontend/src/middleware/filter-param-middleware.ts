import { NextResponse, type NextRequest } from 'next/server';

const NEW_FILTER_PARAM_NAME: { [k: string]: string } = {
  sort: 'sortBy',
  langs: 'languages',
};

export function filterParamMiddleware(request: NextRequest) {
  const parsedUrl = new URL(request.url);
  for (const [param, value] of parsedUrl.searchParams.entries()) {
    if (param in NEW_FILTER_PARAM_NAME) {
      parsedUrl.searchParams.set(NEW_FILTER_PARAM_NAME[param], value ?? '');
      parsedUrl.searchParams.delete(param);
    }
  }

  const newUrl = parsedUrl.toString();
  if (newUrl !== request.url) {
    return NextResponse.redirect(newUrl);
  }
}
