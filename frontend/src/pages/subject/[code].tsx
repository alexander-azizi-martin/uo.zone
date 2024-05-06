import { useRouter } from 'next/router';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';
import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from 'nuqs';
import useSWR from 'swr';

import { GradeSummary } from '@/components/grades';
import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Paper } from '@/components/ui/paper';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getSubject,
  getSubjectCourses,
  type SubjectWithCourses,
} from '@/lib/api';
import { getDictionary } from '@/lib/dictionary';
import {
  CourseFilterMenu,
  VirtualCourseList,
} from '@/modules/subject/components';
import { useFilteredCourses } from '@/modules/subject/hooks';
import { useCallback } from 'react';

interface SubjectProps {
  subject: SubjectWithCourses;
}

export default function Subject({ subject }: SubjectProps) {
  const tCourse = useTranslations('Course');

  const { query, locale } = useRouter();
  const { data: courses, isLoading: isCoursesLoading } = useSWR(
    ['/subject/courses', query.code as string, locale],
    ([_, code, locale]) => getSubjectCourses(code, locale),
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
    { clearOnDefault: true },
  );

  const resetFilterOptions = useCallback(() => {
    setFilterOptions({ sortBy: 'code', years: [], languages: [] });
  }, [setFilterOptions]);

  const filteredCourses = useFilteredCourses(courses ?? [], filterOptions);

  return (
    <Layout>
      <SearchNav>
        <div className='flex items-center justify-between'>
          <h2 className='my-4'>{`${subject.code}: ${subject.subject}`}</h2>

          <CourseFilterMenu
            value={filterOptions}
            onChange={(key, value) => setFilterOptions({ [key]: value })}
            onReset={resetFilterOptions}
          />
        </div>

        <div className='stack min-h-[50vh] items-start pb-3'>
          <Paper size='lg'>
          <GradeSummary
              gradeInfo={subject.gradeInfo}
              title={tCourse('all-courses-for', { code: subject.code })}
              titleSize={'3xl'}
            />
          </Paper>

          {isCoursesLoading ? (
            Array.from({ length: subject.coursesCount }).map((_, i) => (
              <Skeleton
                key={i}
                className='mt-4 h-[240px] w-full rounded-md sm:h-[175px] lg:h-[112px]'
              />
            ))
          ) : (
            <VirtualCourseList courses={filteredCourses} />
          )}
        </div>
      </SearchNav>
    </Layout>
  );
}

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
    try {
      const subject = await getSubject(
        context.params?.code as string,
        context.locale,
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
  },
);
