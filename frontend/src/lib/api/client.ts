import { notFound } from 'next/navigation';
import createClient from 'openapi-fetch';
import urlJoin from 'url-join';

import { type paths } from './schema';

export const API_URL =
  typeof window === 'undefined'
    ? urlJoin(process.env.SERVER_URL, '/api')
    : '/api';

export const client = createClient<paths>({
  baseUrl: API_URL,
  cache: 'no-cache',
});

client.use({
  onResponse({ response }) {
    if (typeof window === 'undefined' && response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw response;
    }

    return response;
  },
});
