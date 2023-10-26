import { useTranslations } from 'next-intl';
import { Box, Button, Divider, Text, VStack } from '@chakra-ui/react';
import { trackEvent } from '~/lib/helpers';
import ExternalLink from '~/components/ExternalLink';

export default function Footer() {
  const tFooter = useTranslations('Footer');
  const tGeneral = useTranslations('General');

  return (
    <Box pb={10}>
      <Divider borderColor={'rgba(91,0,19,0.42)'} mb={4} />
      <VStack spacing={4}>
        <Button
          size={'xs'}
          fontWeight={300}
          variant={'outline'}
          as={'a'}
          target={'_blank'}
          href={'https://github.com/alexander-azizi-martin/uo.zone'}
          onClick={() => trackEvent('button.github.click')}
        >
          {tFooter('github')}
        </Button>
        <Text
          textAlign={'center'}
          fontSize={'sm'}
          fontWeight={300}
          color={'gray.600'}
        >
          {tFooter('dataSource.text')}{' '}
          <ExternalLink href={tFooter('dataSource.office.link')}>
            {tFooter('dataSource.office.text')}
          </ExternalLink>{' '}
          {tGeneral('and')}{' '}
          <ExternalLink href={tFooter('dataSource.uozone.link')}>
            {tFooter('dataSource.uozone.text')}
          </ExternalLink>
        </Text>
        <Text
          textAlign={'center'}
          fontSize={'sm'}
          fontWeight={300}
          color={'gray.600'}
          onClick={() => trackEvent('button.alexander_azizi-martin.email.click')}
        >
          {tFooter('maintainer')}{' '}
          <ExternalLink href={'mailto:alexander.azizi-martin@uo.zone'}>
            Alexander Azizi-Martin
          </ExternalLink>
        </Text>
      </VStack>
    </Box>
  );
}
