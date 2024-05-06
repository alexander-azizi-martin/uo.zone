import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { ExternalLink } from '@/components/ExternalLink';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { trackEvent } from '@/lib/helpers';

export function Footer() {
  const tFooter = useTranslations('Footer');
  const tGeneral = useTranslations('General');

  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguages = (locale: string) => () => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <footer className='pb-10'>
      <Separator className='mb-4' />

      <div className='flex flex-col gap-4'>
        <div className='flex h-6 justify-center gap-2'>
          <Button
            className='text-xs'
            variant='ghost'
            size='sm'
            onClick={switchLanguages('en')}
          >
            English
          </Button>
          <Separator orientation={'vertical'} />
          <Button
            className='text-xs'
            variant='ghost'
            size='sm'
            onClick={switchLanguages('fr')}
          >
            Français
          </Button>
        </div>

        <p className='text-center text-sm font-light text-gray-600'>
          {tFooter('dataSource.text')}{' '}
          <ExternalLink href={tFooter('dataSource.office.link')}>
            {tFooter('dataSource.office.text')}
          </ExternalLink>{' '}
          {tGeneral('and')}{' '}
          <ExternalLink href={tFooter('dataSource.uozone.link')}>
            {tFooter('dataSource.uozone.text')}
          </ExternalLink>
        </p>

        <p className='text-center text-sm font-light text-gray-600'>
          <ExternalLink
            href={'https://github.com/alexander-azizi-martin/uo.zone'}
            onClick={() => {
              trackEvent('button.github.click');
            }}
          >
            Github
          </ExternalLink>{' '}
          {tFooter('maintainer')}{' '}
          <ExternalLink
            href={'mailto:alexander.azizi-martin@uo.zone'}
            onClick={() => {
              trackEvent('button.alexander_azizi-martin.email.click');
            }}
          >
            Alexander Azizi-Martin
          </ExternalLink>
        </p>
      </div>
    </footer>
  );
}
