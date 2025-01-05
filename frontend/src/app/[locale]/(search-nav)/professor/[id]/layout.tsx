import { Trans } from '@lingui/macro';
import { type PropsWithChildren } from 'react';

import { ExternalLink } from '@/components/links/external-link';
import { TabLink, TabLinkList } from '@/components/links/tab-link';
import { Badge } from '@/components/ui/badge';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';
import { type Locale } from '@/lingui.config';

import { RmpRating } from './_components/rmp-rating';

interface CourseLayoutProps extends PropsWithChildren {
  params: {
    id: number;
    locale: Locale;
  };
}

export default async function CoursePage({
  children,
  params,
}: CourseLayoutProps) {
  await loadI18n(params.locale);

  const professor = (
    await client.GET('/professors/{professor}', {
      params: {
        path: { professor: params.id },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  return (
    <div>
      <h2 className='pt-4 sm:text-4xl'>{professor.name}</h2>

      {professor.rmpReview && professor.rmpReview.numRatings > 0 && (
        <>
          <div className='mt-1 flex flex-wrap gap-2'>
            <RmpRating review={professor.rmpReview} />
            {professor.rmpReview.department && (
              <Badge className='bg-blue-500' size='sm'>
                {professor.rmpReview.department}
              </Badge>
            )}
          </div>

          <p className='my-4 text-sm'>
            <ExternalLink
              href={professor.rmpReview.link}
              className='text-sm text-foreground/75'
            >
              <Trans>View on RateMyProfessor</Trans>
            </ExternalLink>
          </p>
        </>
      )}

      <TabLinkList>
        <TabLink href={`/professor/${professor.publicId}`}>
          <Trans>Grades</Trans>
        </TabLink>

        <TabLink href={`/professor/${professor.publicId}/evaluations`}>
          <Trans>Evaluations</Trans>
        </TabLink>
      </TabLinkList>

      {children}
    </div>
  );
}
