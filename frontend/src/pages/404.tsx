import { Heading } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';

export default function NotFound() {
  const t = useTranslations('Error');

  return (
    <Layout>
      <SearchNav>
        <Heading mt={4}>{t('404')}</Heading>
      </SearchNav>
    </Layout>
  );
}

export { getStaticProps } from '~/lib/dictionary';
