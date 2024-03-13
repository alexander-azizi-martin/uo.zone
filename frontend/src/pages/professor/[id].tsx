import { Divider, Heading, Stack, Tag, Text, VStack } from '@chakra-ui/react';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';

import {
  ExternalLink,
  GradeSummary,
  Layout,
  SearchNav,
  SectionsSummary,
  SummaryCard,
  SurveySummary,
} from '~/components';
import { getProfessor, type ProfessorWithCourses } from '~/lib/api';
import { professorQuestions } from '~/lib/config';
import { getDictionary } from '~/lib/dictionary';
import { RmpRating } from '~/modules/professor/components';
import { ProfessorTabs } from '~/modules/professor/components/ProfessorTabs';

interface ProfessorProps {
  professor: ProfessorWithCourses;
}

export default function Professor({ professor }: ProfessorProps) {
  const tCourse = useTranslations('Course');

  return (
    <Layout>
      <SearchNav>
        <Heading my={4}>{professor.name}</Heading>
        {professor.rmpReview && professor.rmpReview.numRatings > 0 && (
          <>
            <Stack direction={'row'} mt={1} spacing={2} wrap={'wrap'}>
              <RmpRating review={professor.rmpReview} />
              {professor.rmpReview.department && (
                <Tag colorScheme={'blue'} variant={'solid'} size={'sm'}>
                  {professor.rmpReview.department}
                </Tag>
              )}
            </Stack>

            <Text my={4} fontSize={'sm'}>
              <ExternalLink
                href={professor.rmpReview.link}
                color={'gray.600'}
                fontSize={'sm'}
              >
                {tCourse('rmp')}
              </ExternalLink>
            </Text>
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
        context.locale
      );

      return {
        props: {
          professor,
          messages: await getDictionary(context.locale),
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
  }
);
