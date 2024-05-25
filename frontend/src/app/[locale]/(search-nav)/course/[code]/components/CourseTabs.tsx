'use client';

import { Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { SurveyQuestionHistogram } from '@/components/common/SurveyQuestionHistogram';
import { GradeSummary } from '@/components/grades/GradeSummary';
import { Paper } from '@/components/ui/paper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type CourseWithProfessors } from '@/lib/api';
import { courseQuestions } from '@/lib/config';
import { Tooltip } from '@/components/common/Tooltip';
import { SectionsSummary } from '@/components/common/SectionsSummary';
import { InfoIcon } from 'lucide-react';

interface CourseTabsProps {
  course: CourseWithProfessors;
}

export function CourseTabs({ course }: CourseTabsProps) {
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
        {course.professors.length > 0 ? (
          <div className='flex flex-col items-start gap-4'>
            {course.gradeInfo && (
              <Paper size='lg'>
                <GradeSummary
                  gradeInfo={course.gradeInfo}
                  title={<Trans>All Professors</Trans>}
                  titleSize={'3xl'}
                />
              </Paper>
            )}

            {course.professors.map((professor) => (
              <SectionsSummary
                key={professor.id}
                title={
                  professor.id !== 0 ? (
                    professor.name
                  ) : (
                    <div className='flex items-start gap-2'>
                      <div>
                        <Trans>
                          Unknown{' '}
                          <Plural
                            value={professor.sections.length}
                            one='Professor'
                            other='Professors'
                          />
                        </Trans>
                      </div>

                      <Tooltip
                        label={
                          <Trans>
                            The{' '}
                            <Plural
                              value={professor.sections.length}
                              one='professor for this course section is'
                              other='professors for these course sections are'
                            />{' '}
                            not known.
                          </Trans>
                        }
                        className='text-center text-sm'
                      >
                        <InfoIcon size={14} />
                      </Tooltip>
                    </div>
                  )
                }
                href={
                  professor.id !== 0 ? `/professor/${professor.id}` : undefined
                }
                summarize={professor}
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
        {course.survey.length > 0 ? (
          <div className='flex w-full flex-wrap justify-center gap-4 lg:gap-8'>
            {Object.entries(courseQuestions).map(([question, titleMsg]) => {
              const surveyQuestion = course.survey.find(
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
