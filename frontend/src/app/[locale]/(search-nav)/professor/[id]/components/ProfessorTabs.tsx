'use client';

import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { SectionsSummary } from '@/components/common/SectionsSummary';
import { SurveyQuestionHistogram } from '@/components/common/SurveyQuestionHistogram';
import { GradeSummary } from '@/components/grades/GradeSummary';
import { Paper } from '@/components/ui/paper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type ProfessorWithCourses } from '@/lib/api';
import { professorQuestions } from '@/lib/config';

interface ProfessorTabsProps {
  professor: ProfessorWithCourses;
}

export function ProfessorTabs({ professor }: ProfessorTabsProps) {
  const { _ } = useLingui();

  const [tab, setTab] = useQueryState(
    't',
    parseAsStringLiteral(['grades', 'reviews', 'evaluations', 'graph'])
      .withDefault('grades')
      .withOptions({ clearOnDefault: true }),
  );

  return (
    <Tabs value={tab} onValueChange={setTab as any}>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='grades'>
          <Trans>Grades</Trans>
        </TabsTrigger>
        <TabsTrigger value='evaluations'>
          <Trans>Course Evaluations</Trans>
        </TabsTrigger>
      </TabsList>

      <TabsContent value='grades'>
        {professor.courses.length > 0 ? (
          <div className='stack items-start gap-4'>
            {professor.gradeInfo && (
              <Paper size='lg'>
                <GradeSummary
                  gradeInfo={professor.gradeInfo}
                  title={<Trans>All Courses</Trans>}
                  titleSize={'3xl'}
                  info={
                    <p className='mt-2 text-sm text-gray-600'>
                      <Trans>
                        This total also includes classes that they may not teach
                        anymore.
                      </Trans>
                    </p>
                  }
                />
              </Paper>
            )}

            {professor.courses.map((course) => (
              <SectionsSummary
                key={course.code}
                title={course.title}
                href={`/course/${course.code}`}
                summarize={course}
              />
            ))}
          </div>
        ) : (
          <div>
            <Trans>No grade data.</Trans>
          </div>
        )}
      </TabsContent>

      <TabsContent value='evaluations'>
        {professor.survey.length > 0 ? (
          <div className='flex w-full flex-wrap justify-center gap-4 lg:gap-8'>
            {Object.entries(professorQuestions).map(([question, titleMsg]) => {
              const surveyQuestion = professor.survey.find(
                (survey) => survey.question === question,
              );

              if (surveyQuestion === undefined) return null;

              const title = _(titleMsg);
              return (
                <SurveyQuestionHistogram
                  key={title}
                  title={title}
                  tooltip={question}
                  surveyQuestion={surveyQuestion}
                />
              );
            })}
          </div>
        ) : (
          <div>
            <Trans>No survey data.</Trans>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
