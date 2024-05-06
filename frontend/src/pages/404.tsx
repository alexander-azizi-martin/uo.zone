import { useTranslations } from 'next-intl';

import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';

export default function NotFound() {
  const t = useTranslations('Error');

  return (
    <Layout>
      <SearchNav>
        <h2 className='mt-4'>{t('404')}</h2>
      </SearchNav>
    </Layout>
  );
}

export { getStaticProps } from '@/lib/dictionary';
