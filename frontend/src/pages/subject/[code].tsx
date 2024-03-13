import { Flex, Heading, Skeleton, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';
import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from 'nuqs';
import useSWR from 'swr';

import { GradeSummary, Layout, SearchNav, SummaryCard } from '~/components';
import {
  getSubject,
  getSubjectCourses,
  type SubjectWithCourses,
} from '~/lib/api';
import { getDictionary } from '~/lib/dictionary';
import {
  CourseFilterMenu,
  VirtualCourseList,
} from '~/modules/subject/components';
import { useFilteredCourses } from '~/modules/subject/hooks';

interface SubjectProps {
  subject: SubjectWithCourses;
}

export default function Subject({ subject }: SubjectProps) {
  const tCourse = useTranslations('Course');

  const { query, locale } = useRouter();
  const { data: courses, isLoading: isCoursesLoading } = useSWR(
    `/subject/${query.code}/courses`,
    getSubjectCourses.bind(null, query.code as string, locale)
  );

  const [filterOptions, setFilterOptions] = useQueryStates(
    {
      sortBy: parseAsStringLiteral(['code', 'average', 'mode'])
        .withDefault('code')
        .withOptions({ clearOnDefault: true }),
      years: parseAsArrayOf(parseAsStringLiteral(['1', '2', '3', '4', '5']))
        .withDefault([])
        .withOptions({ clearOnDefault: true }),
      languages: parseAsArrayOf(parseAsStringLiteral(['en', 'fr']))
        .withDefault([])
        .withOptions({ clearOnDefault: true }),
    },
    { clearOnDefault: true }
  );

  const filteredCourses = useFilteredCourses(courses ?? [], filterOptions);

  return (
    <Layout>
      <SearchNav>
        <Flex justify={'space-between'} align={'center'}>
          <Heading my={4}>{`${subject.code}: ${subject.subject}`}</Heading>

          <CourseFilterMenu
            value={filterOptions}
            onChange={(key, value) => setFilterOptions({ [key]: value })}
          />
        </Flex>

        <VStack spacing={0} align={'start'} pb={'11px'} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              gradeInfo={subject.gradeInfo}
              title={tCourse('all-courses-for', { code: subject.code })}
              titleSize={'3xl'}
            />
          </SummaryCard>

          {isCoursesLoading ? (
            Array.from({ length: subject.coursesCount }).map((_, i) => (
              <Skeleton
                key={i}
                height={{ base: 240, sm: 175, lg: 112 }}
                width={'100%'}
                mt={4}
                borderRadius={8}
              />
            ))
          ) : (
            <VirtualCourseList courses={filteredCourses} />
          )}
        </VStack>
      </SearchNav>
    </Layout>
  );
}

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
    try {
      const subject = await getSubject(
        context.params?.code as string,
        context.locale
      );

      return {
        props: {
          subject,
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
