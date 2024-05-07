import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';

import { GradeSummary } from '@/components/grades';
import { Paper } from '@/components/ui/paper';
import { type Course } from '@/lib/api';
import { Trans } from '@lingui/macro';

interface VirtualCourseListProps {
  courses: Course[];
}

export function VirtualCourseList({ courses }: VirtualCourseListProps) {
  return (
    <>
      {courses.length === 0 && (
        <h3 className='pt-4'>
          <Trans>No course matches the filters.</Trans>
        </h3>
      )}
      <Virtuoso
        useWindowScroll
        data={courses}
        computeItemKey={(_, course) => course.code}
        className='w-full'
        itemContent={(_, course) => (
          <div className='pt-4' key={course.code}>
            <Paper asChild variant='link'>
              <Link href={`/course/${course.code}`}>
                <GradeSummary
                  title={course.title}
                  subtitle={
                    !course.gradeInfo?.total ? (
                      <Trans>No grade data available for this course.</Trans>
                    ) : undefined
                  }
                  gradeInfo={course.gradeInfo}
                  graphSize={'sm'}
                />
              </Link>
            </Paper>
          </div>
        )}
      />
    </>
  );
}
