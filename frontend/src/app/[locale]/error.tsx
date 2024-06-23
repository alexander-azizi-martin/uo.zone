'use client';

import { Trans } from '@lingui/macro';
import { usePathname } from 'next/navigation';
import { useLogger } from 'next-axiom';

import { SearchNav } from '@/components/search/search-nav';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const pathname = usePathname();
  const log = useLogger({ source: 'error.tsx' });
  const status = error.message == 'Invalid URL' ? 404 : 500;

  log.logHttpRequest(
    3,
    error.message,
    {
      host: window.location.href,
      path: pathname,
      statusCode: status,
    },
    {
      error: error.name,
      cause: error.cause,
      stack: error.stack,
      digest: error.digest,
    },
  );

  return (
    <SearchNav>
      <h2 className='pt-4 sm:text-4xl'>
        <Trans>Something went wrong during your request.</Trans>
      </h2>
    </SearchNav>
  );
}
