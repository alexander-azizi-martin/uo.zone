import { Trans } from '@lingui/macro';

import { SurveyQuestionHistogram } from '@/components/common/survey-question-histogram';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';

interface CourseEvaluationsPageProps {
  params: {
    code: string;
    locale: string;
  };
}

export default async function CourseEvaluationsPage({
  params,
}: CourseEvaluationsPageProps) {
  await loadI18n(params.locale);

  const survey = (
    await client.GET('/courses/{course}/survey', {
      params: {
        path: { course: params.code },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  if (survey.length === 0) {
    return (
      <div>
        <Trans>No survey data.</Trans>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-wrap justify-center gap-4 lg:gap-8'>
      {Object.entries(COURSE_QUESTIONS).map(([question, title]) => {
        const surveyQuestion = survey.find(
          (survey) => survey.question === question,
        );

        if (surveyQuestion === undefined || surveyQuestion.score === null) {
          return null;
        }

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
  );
}

// prettier-ignore
const COURSE_QUESTIONS = {
  // en
  'The course is well organized': 'Organized',
  'Course expectations are clearly explained': 'Expectations',
  'I have learned a lot in this course': 'Learning',
  'I would recommend this course to another student': 'Recommend',
  'In comparison with my other courses, the workload for this course is': 'Workload',
  'Assignments and/or exams closely reflect what is covered in class': 'Activities',
  // fr
  'Le cours est bien organisé': 'Organisé',
  'Les attentes envers les étudiants sont clairement expliquées': 'Attentes',
  'J\'ai beaucoup appris dans ce cours': 'Apprentissage',
  'Je recommanderais ce cours à un autre étudiant': 'Recommander',
  'Comparée à celle de mes autres cours, la charge de travail pour ce cours est': 'Charge de travail',
  'Les travaux et/ou les examens reflètent bien le contenu du cours': 'Activités',
};
