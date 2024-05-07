import { withAxiomGetServerSideProps } from 'next-axiom';

import { ExternalLink } from '@/components/ExternalLink';
import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Badge } from '@/components/ui/badge';
import { getProfessor, type ProfessorWithCourses } from '@/lib/api';
import { RmpRating } from '@/modules/professor/components';
import { ProfessorTabs } from '@/modules/professor/components/ProfessorTabs';
import { Trans } from '@lingui/macro';

interface ProfessorProps {
  professor: ProfessorWithCourses;
}

export default function Professor({ professor }: ProfessorProps) {
  return (
    <Layout>
      <SearchNav>
        <h2 className='my-4'>{professor.name}</h2>
        {professor.rmpReview && professor.rmpReview.numRatings > 0 && (
          <>
            <div className='mt-1 flex flex-wrap gap-2'>
              <RmpRating review={professor.rmpReview} />
              {professor.rmpReview.department && (
                <Badge className='bg-blue'>
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
      </SearchNav>
    </Layout>
  );
}

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
    try {
      const professor = await getProfessor(
        context.params?.id as string,
        context.locale,
      );

      return {
        props: {
          professor,
        },
      };
    } catch (error: any) {
      if (error.status == 404) {
        return {
          notFound: true,
        };
      }

      context.log.error('Internal Server Error', error);

      throw new Error('Internal Server Error');
    }
  },
);
