import { useTranslations } from 'next-intl';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { GradeSummary } from '@/components/grades';
import { SectionsSummary } from '@/components/SectionsSummary';
import { SurveyQuestionHistogram } from '@/components/SurveyQuestionHistogram';
import { Paper } from '@/components/ui/paper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type ProfessorWithCourses } from '@/lib/api';
import { professorQuestions } from '@/lib/config';

interface ProfessorTabsProps {
  professor: ProfessorWithCourses;
}

export function ProfessorTabs({ professor }: ProfessorTabsProps) {
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
        {professor.courses.length > 0 ? (
          <div className='stack items-start gap-4'>
            {professor.gradeInfo && (
              <Paper size='lg'>
                <GradeSummary
                  gradeInfo={professor.gradeInfo}
                  title={tCourse('all-courses')}
                  titleSize={'3xl'}
                  info={
                    <p className='mt-2 text-sm text-gray-600'>
                      {tCourse('total-info')}
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
          <div>{tCourse('no-grade-data')}</div>
        )}
      </TabsContent>

      <TabsContent value='evaluations'>
        {professor.survey.length > 0 ? (
          <div className='flex w-full flex-wrap gap-4 lg:gap-8'>
            {Object.entries(professorQuestions).map(([question, name]) => {
              const surveyQuestion = professor.survey.find(
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
