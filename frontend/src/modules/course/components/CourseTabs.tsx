import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { GradeSummary } from '@/components/grades';
import { SectionsSummary } from '@/components/SectionsSummary';
import { SurveyQuestionHistogram } from '@/components/SurveyQuestionHistogram';
import { Tooltip } from '@/components/Tooltip';
import { Paper } from '@/components/ui/paper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type CourseWithProfessors } from '@/lib/api';
import { courseQuestions } from '@/lib/config';
import { Grade } from '@/lib/grade';

interface CourseTabsProps {
  course: CourseWithProfessors;
}

export function CourseTabs({ course }: CourseTabsProps) {
  const tCourse = useTranslations('Course');
  const tGeneral = useTranslations('General');
  const tSurvey = useTranslations('Survey');

  const [tab, setTab] = useQueryState(
    't',
    parseAsStringLiteral(['grades', 'reviews', 'evaluations', 'graph'])
      .withDefault('grades')
      .withOptions({ clearOnDefault: true }),
  );

  return (
    <Tabs value={tab} onValueChange={setTab as any}>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='grades'>{tGeneral('grades')}</TabsTrigger>
        <TabsTrigger value='evaluations'>
          {tGeneral('course-evaluations')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value='grades'>
        {course.professors.length > 0 ? (
          <div className='flex flex-col items-start gap-4'>
            {course.gradeInfo && (
              <Paper size='lg'>
                <GradeSummary
                  gradeInfo={course.gradeInfo}
                  title={tCourse('all-professors')}
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
                        {tCourse('unknown-professor', {
                          count: professor.sections.length,
                        })}
                      </div>

                      <Tooltip
                        label={tCourse('unknown-professor-info', {
                          count: professor.sections.length,
                        })}
                        fontSize={'sm'}
                        textAlign={'center'}
                        hasArrow
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
          <div>{tCourse('no-grade-data')}</div>
        )}
      </TabsContent>

      <TabsContent value='evaluations'>
        {course.survey.length > 0 ? (
          <div className='flex w-full flex-wrap justify-center gap-4 lg:gap-8'>
            {Object.entries(courseQuestions).map(([question, name]) => {
              const surveyQuestion = course.survey.find(
                (survey) => survey.question === question,
              );

              if (surveyQuestion === undefined) return null;

              return (
                <SurveyQuestionHistogram
                  key={name}
                  title={tSurvey(`${name}.info`)}
                  tooltip={tSurvey(`${name}.tooltip`)}
                  surveyQuestion={surveyQuestion}
                />
              );
            })}
          </div>
        ) : (
          <div>{tCourse('no-survey-data')}</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
