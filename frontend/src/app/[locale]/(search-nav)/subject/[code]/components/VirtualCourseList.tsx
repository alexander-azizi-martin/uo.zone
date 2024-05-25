'use client';

import { Trans } from '@lingui/macro';
import { Virtuoso } from 'react-virtuoso';

import { GradeSummary } from '@/components/grades/GradeSummary';
import { Link } from '@/components/links/Link';
import { Paper } from '@/components/ui/paper';
import { type Course } from '@/lib/api';

import { useFilteredCourses } from '../hooks/useFilteredCourses';

interface VirtualCourseListProps {
  courses: Course[];
}

export function VirtualCourseList({ courses }: VirtualCourseListProps) {
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
