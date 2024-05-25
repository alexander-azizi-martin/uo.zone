import { Trans } from '@lingui/macro';

import { ExternalLink } from '@/components/links/ExternalLink';
import { Badge } from '@/components/ui/badge';
import { getProfessor } from '@/lib/api';
import { loadI18n } from '@/lib/i18n';

import { ProfessorTabs } from './components/ProfessorTabs';
import { RmpRating } from './components/RmpRating';

interface ProfessorPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default async function ProfessorPage({ params }: ProfessorPageProps) {
  await loadI18n(params.locale);
  const professor = await getProfessor(params.id, params.locale);

  return (
    <div>
      <h2 className='my-4 mt-4 sm:text-4xl'>{professor.name}</h2>
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
              className='text-sm text-gray-600'
            >
              <Trans>View on RateMyProfessor</Trans>
            </ExternalLink>
          </p>
        </>
      )}

      <ProfessorTabs professor={professor} />
    </div>
  );
}
