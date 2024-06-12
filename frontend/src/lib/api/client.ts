import { notFound } from 'next/navigation';
import createClient from 'openapi-fetch';
import urlJoin from 'url-join';

import { type paths } from './schema';

export const API_URL =
  typeof window === 'undefined'
    ? urlJoin(process.env.SERVER_URL, '/api')
    : '/api';

export const client = createClient<paths>({ baseUrl: API_URL, cache: 'no-cache' });

client.use({
  onResponse(res) {
    if (typeof window === 'undefined' && res.status === 404) {
      notFound();
    }

    if (!res.ok) {
      throw res;
    }

    return res;
  },
});



// function clientFetch<M extends Uppercase<HttpMethod>>(
//   method: M,
//   url: PathsWithMethod<paths, Lowercase<M>>,
// ) {
//   const a = client[method as 'GET'](url);
// }
// client.GET('/courses', { params: { header: { 'Accept-Language': 's' } } });
// clientFetch('POST', '/search');
