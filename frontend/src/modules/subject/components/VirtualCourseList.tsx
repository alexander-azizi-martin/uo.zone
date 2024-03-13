import { Box, Heading } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { Virtuoso } from 'react-virtuoso';

import { GradeSummary, LinkCard } from '~/components';
import { type Course } from '~/lib/api';

interface VirtualCourseListProps {
  courses: Course[];
}

export function VirtualCourseList({ courses }: VirtualCourseListProps) {
  const tGrades = useTranslations('Grades');
  const tCourse = useTranslations('Course');

  return (
    <>
      {courses.length === 0 && (
        <Heading pt={4} as={'h3'} size={'md'}>
          {tCourse('no-filter-match')}
        </Heading>
      )}
      <Virtuoso
        useWindowScroll
        data={courses}
        computeItemKey={(_, course) => course.code}
        itemContent={(_, course) => (
          <Box pt={4} key={course.code}>
            <LinkCard
              href={`/course/${course.code}`}
              display={'block'}
              height={'100%'}
            >
              <GradeSummary
                title={course.title}
                subtitle={
                  !course.gradeInfo?.total ? tGrades('no-data') : undefined
                }
                gradeInfo={course.gradeInfo}
                distributionSize={'sm'}
                ssr={false}
              />
            </LinkCard>
          </Box>
        )}
        style={{ width: '100%' }}
      />
    </>
  );
}
