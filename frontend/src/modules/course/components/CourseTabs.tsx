import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  chakra,
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
import { SurveyQuestionGraph } from '~/components/SurveyQuestionGraph';
import { type CourseWithProfessors } from '~/lib/api';
import { courseQuestions } from '~/lib/config';

interface CourseTabsProps {
  course: CourseWithProfessors;
}

export function CourseTabs({ course }: CourseTabsProps) {
  const tCourse = useTranslations('Course');

  const [tab, setTab] = useQueryState(
    't',
    parseAsStringLiteral(['grades', 'reviews', 'evaluations', 'graph'])
      .withDefault('grades')
      .withOptions({ clearOnDefault: true })
  );
  console.log(['grades', 'reviews', 'evaluations', 'graph'].indexOf(tab));
  return (
    <Tabs
      variant="enclosed"
      color="black"
      colorScheme="black"
      borderColor={'rgba(91,0,19,0.42)'}
      outline={'none'}
      defaultIndex={['grades', 'reviews', 'evaluations', 'graph'].indexOf(tab)}
      tabIndex={['grades', 'reviews', 'evaluations', 'graph'].indexOf(tab)}
      onChange={(index) => {
        setTab(['grades', 'reviews', 'evaluations', 'graph'][index] as any);
      }}
    >
      <TabList>
        <Tab>Grades</Tab>
        <Tab>Reviews</Tab>
        <Tab>Course Evaluations</Tab>
        <Tab>Graph</Tab>
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
                        <chakra.span>
                          {tCourse('unknown-professor', {
                            count: professor.sections.length,
                          })}
                        </chakra.span>

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
            <div>no grade data</div>
          )}
        </TabPanel>

        <TabPanel p={0} mt={6}>
          reviews
        </TabPanel>

        <TabPanel p={0} mt={6}>
          {course.survey.length > 0 ? (
            <>
              <SurveySummary
                survey={course.survey}
                questions={courseQuestions}
              />
              <SurveyQuestionGraph surveyQuestion={course.survey[0]} />
            </>
          ) : (
            <div>no survey data</div>
          )}
        </TabPanel>

        <TabPanel p={0} mt={6}>
          graph
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
