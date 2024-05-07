import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Trans } from '@lingui/macro';

export default function InternalError() {
  return (
    <Layout>
      <SearchNav>
        <h2 className='mt-4'>
          <Trans>Something went wrong during your request.</Trans>
        </h2>
      </SearchNav>
    </Layout>
  );
}
