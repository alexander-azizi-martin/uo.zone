import { useTranslations } from 'next-intl';

import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';

export default function InternalError() {
  const tError = useTranslations('Error');

  return (
    <Layout>
      <SearchNav>
        <h2 className='mt-4'>{tError('500')}</h2>
      </SearchNav>
    </Layout>
  );
}

export { getStaticProps } from '@/lib/dictionary';
