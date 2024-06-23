import { Trans } from '@lingui/macro';
import { headers } from 'next/headers';

import { SearchNav } from '@/components/search/search-nav';
import { loadI18n } from '@/lib/i18n';

export default async function NotFoundPage() {
  const locale = headers().get('X-Language-Preference')!;
  await loadI18n(locale);

  return (
    <SearchNav>
      <h2 className='pt-4 sm:text-4xl'>
        <Trans>This page does not exist.</Trans>
      </h2>
    </SearchNav>
  );
}
