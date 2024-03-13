import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import {
  GradeSummary,
  SectionsSummary,
  SummaryCard,
  SurveySummary,
  Tooltip,
} from '~/components';
import { type CourseWithProfessors } from '~/lib/api';
import { courseQuestions } from '~/lib/config';

interface CourseTabsProps {
  course: CourseWithProfessors;
}

export function CourseTabs({ course }: CourseTabsProps) {
  const tCourse = useTranslations('Course');
  const tGeneral = useTranslations('General');

  const [tab, setTab] = useQueryState(
    't',
    parseAsStringLiteral(['grades', 'reviews', 'evaluations', 'graph'])
      .withDefault('grades')
      .withOptions({ clearOnDefault: true })
  );

  return (
    <Tabs
      variant="enclosed"
      color="black"
      colorScheme="black"
      borderColor={'rgba(91,0,19,0.42)'}
      outline={'none'}
      defaultIndex={['grades', 'evaluations'].indexOf(tab)}
      tabIndex={['grades', 'evaluations'].indexOf(tab)}
      onChange={(index) => {
        setTab(['grades', 'evaluations'][index] as any);
      }}
    >
      <TabList>
        <Tab>{tGeneral('grades')}</Tab>
        {/* <Tab>Reviews</Tab> */}
        <Tab>{tGeneral('course-evaluations')}</Tab>
        {/* <Tab>Graph</Tab> */}
      </TabList>

      <TabPanels>
        <TabPanel p={0} mt={6}>
          {course.professors.length > 0 ? (
            <VStack spacing={4} align={'start'}>
              {course.gradeInfo && (
                <SummaryCard>
                  <GradeSummary
                    gradeInfo={course.gradeInfo}
                    title={tCourse('all-professors')}
                    titleSize={'3xl'}
                  />
                </SummaryCard>
              )}

              {course.professors.map((professor) => (
                <SectionsSummary
                  key={professor.id}
                  title={
                    professor.id !== 0 ? (
                      professor.name
                    ) : (
                      <HStack alignItems={'center'}>
                        <Box>
                          {tCourse('unknown-professor', {
                            count: professor.sections.length,
                          })}
                        </Box>

                        <Tooltip
                          label={tCourse('unknown-professor-info', {
                            count: professor.sections.length,
                          })}
                          fontSize={'sm'}
                          textAlign={'center'}
                          hasArrow
                        >
                          <InfoOutlineIcon fontSize={'sm'} />
                        </Tooltip>
                      </HStack>
                    )
                  }
                  href={
                    professor.id !== 0
                      ? `/professor/${professor.id}`
                      : undefined
                  }
                  summarize={professor}
                />
              ))}
            </VStack>
          ) : (
            <Box>{tCourse('no-grade-data')}</Box>
          )}
        </TabPanel>

        {/* <TabPanel p={0} mt={6}>
          reviews
        </TabPanel> */}

        <TabPanel p={0} mt={6}>
          {course.survey.length > 0 ? (
            <SurveySummary survey={course.survey} questions={courseQuestions} />
          ) : (
            <Box>{tCourse('no-survey-data')}</Box>
          )}
        </TabPanel>

        {/* <TabPanel p={0} mt={6}>
          graph
        </TabPanel> */}
      </TabPanels>
    </Tabs>
  );
}
