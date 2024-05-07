import { useRouter } from 'next/router';

import { ExternalLink } from '@/components/ExternalLink';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { trackEvent } from '@/lib/helpers';
import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export function Footer() {
  const { _ } = useLingui();

  const router = useRouter();
  const { pathname, asPath, query } = router;

  const switchLanguages = (locale: string) => () => {
    router.push({ pathname, query }, asPath, { locale });
  };

  const aipoUrl = _(msg`https://www.uottawa.ca/about-us/aipo`);
  const uozoneUrl = _(msg`https://uozone2.uottawa.ca/en/apps/s-reports`);

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
          <Trans>
            Data from Fall 2017 to Winter 2023 provided by{' '}
            <ExternalLink href={aipoUrl}>
              The Access to Information and Privacy Office
            </ExternalLink>{' '}
            and <ExternalLink href={uozoneUrl}>uoZone</ExternalLink>
          </Trans>
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
          <Trans>maintained by</Trans>{' '}
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
