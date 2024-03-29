import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
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
import { type ProfessorWithCourses } from '~/lib/api';
import { professorQuestions } from '~/lib/config';

interface ProfessorTabsProps {
  professor: ProfessorWithCourses;
}

export function ProfessorTabs({ professor }: ProfessorTabsProps) {
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
      defaultIndex={['grades', 'evaluations', 'graph'].indexOf(tab)}
      tabIndex={['grades', 'evaluations', 'graph'].indexOf(tab)}
      onChange={(index) => {
        setTab(['grades', 'evaluations', 'graph'][index] as any);
      }}
    >
      <TabList>
        <Tab>{tGeneral('grades')}</Tab>
        <Tab>{tGeneral('course-evaluations')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel p={0} mt={6}>
          {professor.courses.length > 0 ? (
            <VStack spacing={4} align={'start'}>
              {professor.gradeInfo && (
                <SummaryCard>
                  <GradeSummary
                    gradeInfo={professor.gradeInfo}
                    title={tCourse('all-courses')}
                    titleSize={'3xl'}
                    info={
                      <Text fontSize={'sm'} color={'gray.600'} mt={2}>
                        {tCourse('total-info')}
                      </Text>
                    }
                  />
                </SummaryCard>
              )}

              {professor.courses.map((course) => (
                <SectionsSummary
                  key={course.code}
                  title={course.title}
                  href={`/course/${course.code}`}
                  summarize={course}
                />
              ))}
            </VStack>
          ) : (
            <Box>{tCourse('no-grade-data')}</Box>
          )}
        </TabPanel>

        <TabPanel p={0} mt={6}>
          {professor.survey.length > 0 ? (
            <SurveySummary
              survey={professor.survey}
              questions={professorQuestions}
            />
          ) : (
            <Box>{tCourse('no-survey-data')}</Box>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
