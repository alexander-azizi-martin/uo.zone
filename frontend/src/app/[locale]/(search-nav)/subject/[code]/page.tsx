import { Trans } from '@lingui/macro';
import cntl from 'cntl';
import { Suspense } from 'react';

import { GradeSummary } from '@/components/grades/grade-summary';
import { Paper } from '@/components/ui/paper';
import { SkeletonList } from '@/components/ui/skeleton';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';
import { type Locale } from '@/lingui.config';

import { BackToTopButton } from './components/back-to-top-button';
import { CourseFilterMenu } from './components/course-filter-menu';
import { CourseFilterProvider } from './components/course-filter-provider';
import { CourseList } from './components/course-list';

interface SubjectPageProps {
  params: {
    code: string;
    locale: Locale;
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  await loadI18n(params.locale);

  const subject = (
    await client.GET('/subjects/{subject}', {
      params: {
        path: { subject: params.code },
        query: {covid: false},
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  return (
    <CourseFilterProvider>
      <div>
        <div className='flex items-center justify-between'>
          <h2 className='py-4 sm:text-4xl'>{`${subject.code}: ${subject.title}`}</h2>

          <CourseFilterMenu />
        </div>
        <div className='stack min-h-[50vh] items-start pb-3'>
          <Paper size='lg'>
            <GradeSummary
              grades={subject.grades}
              title={<Trans>All Courses For {subject.code}</Trans>}
              titleSize={'3xl'}
            />
          </Paper>

          <Suspense
            fallback={
              <SkeletonList
                length={subject.coursesCount}
                className={cntl`
                  mt-4 h-[240px] w-full rounded-md 
                  sm:h-[175px] lg:h-[112px]
                `}
              />
            }
          >
            <CourseList code={params.code} locale={params.locale} />
          </Suspense>
        </div>

        <BackToTopButton />
      </div>
    </CourseFilterProvider>
  );
}
