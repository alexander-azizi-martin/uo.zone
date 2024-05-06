import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Virtuoso } from 'react-virtuoso';

import { GradeSummary } from '@/components/grades';
import { Paper } from '@/components/ui/paper';
import { type Course } from '@/lib/api';

interface VirtualCourseListProps {
  courses: Course[];
}

export function VirtualCourseList({ courses }: VirtualCourseListProps) {
  const tGrades = useTranslations('Grades');
  const tCourse = useTranslations('Course');

  return (
    <>
      {courses.length === 0 && (
        <h3 className='pt-4'>{tCourse('no-filter-match')}</h3>
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
                    !course.gradeInfo?.total ? tGrades('no-data') : undefined
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
