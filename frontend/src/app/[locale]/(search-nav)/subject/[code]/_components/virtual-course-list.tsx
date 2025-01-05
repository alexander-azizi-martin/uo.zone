'use client';

import { Trans } from '@lingui/macro';
import { Virtuoso } from 'react-virtuoso';

import { GradeSummary } from '@/components/grades/grade-summary';
import { Link } from '@/components/links/link';
import { Paper } from '@/components/ui/paper';
import { type components } from '@/lib/api/schema';

import { useFilteredCourses } from '../_hooks/useFilteredCourses';

interface VirtualCourseListProps {
  courses: components['schemas']['CourseResource'][];
}

function VirtualCourseList({ courses }: VirtualCourseListProps) {
  const filteredCourses = useFilteredCourses(courses);

  return (
    <>
      {filteredCourses.length === 0 && (
        <h3 className='pt-4'>
          <Trans>No course matches the filters.</Trans>
        </h3>
      )}
      <Virtuoso
        useWindowScroll
        data={filteredCourses}
        computeItemKey={(_, course) => course.code}
        className='w-full'
        itemContent={(_, course) => (
          <div className='pt-4' key={course.code}>
            <Paper variant='link' className='relative'>
              <GradeSummary
                title={course.title}
                subtitle={
                  !course.grades?.total ? (
                    <Trans>No grade data available for this course.</Trans>
                  ) : undefined
                }
                grades={course.grades}
                graphSize={'sm'}
              />
              <Link href={`/course/${course.code}`} className='stretched-link'></Link>
            </Paper>
          </div>
        )}
      />
    </>
  );
}

export { VirtualCourseList };

export type { VirtualCourseListProps };
