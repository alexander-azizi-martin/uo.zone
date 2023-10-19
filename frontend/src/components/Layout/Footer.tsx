import { useTranslations } from 'next-intl';
import { Box, Button, Divider, Text, VStack } from '@chakra-ui/react';
import Link from '~/components/Link';

export default function Footer() {
  const t = useTranslations();

  return (
    <Box pt={10} pb={10}>
      <Divider borderColor={'rgba(91,0,19,0.42)'} mb={4} />
      <VStack spacing={4}>
        <Button
          size={'xs'}
          fontWeight={300}
          variant={'outline'}
          as={'a'}
          target={'_blank'}
          href={'https://github.com/alexander-azizi-martin/uo.zone'}
        >
          {t('Footer.github')}
        </Button>
        <Text
          textAlign={'center'}
          fontSize={'sm'}
          fontWeight={300}
          color={'gray.600'}
        >
          {t('Footer.dataSource.text')}{' '}
          <Link href={t('Footer.dataSource.office.link')} isExternal>
            {t('Footer.dataSource.office.text')}
          </Link>{' '}
          {t('common.and')}{' '}
          <Link href={t('Footer.dataSource.uozone.link')} isExternal>
            {t('Footer.dataSource.uozone.text')}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
