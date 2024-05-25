import { Trans } from '@lingui/macro';
import { Suspense } from 'react';

import { GradeSummary } from '@/components/grades/GradeSummary';
import { Paper } from '@/components/ui/paper';
import { SkeletonList } from '@/components/ui/skeleton';
import { getSubject } from '@/lib/api';
import { loadI18n } from '@/lib/i18n';

import { CourseFilterMenu } from './components/CourseFilterMenu';
import { CourseFilterProvider } from './components/CourseFilterProvider';
import { CourseList } from './components/CourseList';

interface SubjectPageProps {
  params: {
    code: string;
    locale: string;
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  await loadI18n(params.locale);
  const subject = await getSubject(params.code, params.locale);

  return (
    <CourseFilterProvider>
      <div>
        <div className='flex items-center justify-between'>
          <h2 className='my-4 mt-4 sm:text-4xl'>{`${subject.code}: ${subject.subject}`}</h2>

          <CourseFilterMenu />
        </div>
        <div className='stack min-h-[50vh] items-start pb-3'>
          <Paper size='lg'>
            <GradeSummary
              gradeInfo={subject.gradeInfo}
              title={<Trans>All Courses For {subject.code}</Trans>}
              titleSize={'3xl'}
            />
          </Paper>

          <Suspense
            fallback={
              <SkeletonList
                length={subject.coursesCount}
                className={`
                    mt-4 h-[240px] w-full rounded-md 
                    sm:h-[175px] lg:h-[112px]
                `}
              />
            }
          >
            <CourseList code={params.code} locale={params.locale} />
          </Suspense>
        </div>
      </div>
    </CourseFilterProvider>
  );
}
