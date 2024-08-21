import { msg, Trans } from '@lingui/macro';

import { ExternalLink } from '@/components/links/external-link';
import { LocaleLink } from '@/components/links/locale-link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getI18n } from '@/lib/i18n';

async function Footer() {
  const i18n = getI18n();

  const aipoUrl = i18n._(msg`https://www.uottawa.ca/about-us/aipo`);
  const uozoneUrl = i18n._(msg`https://uozone2.uottawa.ca/en/apps/s-reports`);

  return (
    <footer className='pb-10'>
      <Separator className='mb-4' />

      <div className='flex flex-col gap-4'>
        <div className='flex h-6 justify-center gap-2'>
          <Button className='text-xs' variant='ghost' size='sm' asChild>
            <LocaleLink locale='en'>English</LocaleLink>
          </Button>

          <Separator orientation={'vertical'} />

          <Button className='text-xs' variant='ghost' size='sm' asChild>
            <LocaleLink locale='fr'>Français</LocaleLink>
          </Button>
        </div>

        <p className='text-center text-sm font-light text-foreground/60'>
          <Trans>
            Data from Fall 2017 to Winter 2023 provided by{' '}
            <ExternalLink href={aipoUrl}>
              The Access to Information and Privacy Office
            </ExternalLink>{' '}
            and <ExternalLink href={uozoneUrl}>uoZone</ExternalLink>
          </Trans>
        </p>

        <p className='text-center text-sm font-light text-foreground/60'>
          <ExternalLink
            href='https://github.com/alexander-azizi-martin/uo.zone'
            data-umami-event='github'
          >
            Github
          </ExternalLink>{' '}
          <Trans>maintained by</Trans>{' '}
          <ExternalLink
            href='mailto:alexander.azizi-martin@uo.zone'
            data-umami-event='alexander.azizi-martin@uo.zone'
          >
            Alexander Azizi-Martin
          </ExternalLink>
        </p>
      </div>
    </footer>
  );
}

export { Footer };
