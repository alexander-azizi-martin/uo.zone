import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Trans } from '@lingui/macro';

export default function NotFound() {
  return (
    <Layout>
      <SearchNav>
        <h2 className='mt-4'>
          <Trans>This page does not exist.</Trans>
        </h2>
      </SearchNav>
    </Layout>
  );
}
