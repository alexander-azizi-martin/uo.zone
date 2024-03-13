import { Heading } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import { Layout, SearchNav } from '~/components';

export default function InternalError() {
  const tError = useTranslations('Error');

  return (
    <Layout>
      <SearchNav>
        <Heading mt={4}>{tError('500')}</Heading>
      </SearchNav>
    </Layout>
  );
}

export { getStaticProps } from '~/lib/dictionary';
