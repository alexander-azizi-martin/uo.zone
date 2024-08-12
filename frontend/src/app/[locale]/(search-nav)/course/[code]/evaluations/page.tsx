import { msg, Trans } from '@lingui/macro';

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
  const i18n = await loadI18n(params.locale);

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
            key={title.id}
            title={i18n._(title)}
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
  'The course is well organized': msg`Organized`,
  'Course expectations are clearly explained': msg`Clear Expectations`,
  'I have learned a lot in this course': msg`Learned a Lot`,
  'I would recommend this course to another student': msg`Recommend`,
  'In comparison with my other courses, the workload for this course is': msg`Workload`,
  'Assignments and/or exams closely reflect what is covered in class': msg`Fair Assessments`,
  // fr
  'Le cours est bien organisé': msg`Organized`,
  'Les attentes envers les étudiants sont clairement expliquées': msg`Clear Expectations`,
  'J\'ai beaucoup appris dans ce cours': msg`Learned a Lot`,
  'Je recommanderais ce cours à un autre étudiant': msg`Recommend`,
  'Comparée à celle de mes autres cours, la charge de travail pour ce cours est': msg`Workload`,
  'Les travaux et/ou les examens reflètent bien le contenu du cours': msg`Fair Assessments`,
};
