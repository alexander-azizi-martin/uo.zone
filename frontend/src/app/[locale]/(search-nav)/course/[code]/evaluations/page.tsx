import { msg, Trans } from '@lingui/macro';

import { SurveyQuestionHistogram } from '@/components/common/survey-question-histogram';
import { client } from '@/lib/api/client';
import { getI18n, loadI18n } from '@/lib/i18n';

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
  const i18n = getI18n();

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
    <div className='flex w-full flex-wrap justify-center gap-4 lg:gap-8'>
      {Object.entries(COURSE_QUESTIONS).map(([question, titleMsg]) => {
        const surveyQuestion = survey.find(
          (survey) => survey.question === question,
        );

        if (surveyQuestion === undefined) return null;

        const title = i18n._(titleMsg);
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

const COURSE_QUESTIONS = {
  'The course is well organized': msg`Organized`,
  'Course expectations are clearly explained': msg`Expectations`,
  'I have learned a lot in this course': msg`Learning`,
  'I would recommend this course to another student': msg`Recommend`,
  'In comparison with my other courses, the workload for this course is': msg`Workload`,
  'Assignments and/or exams closely reflect what is covered in class': msg`Activities`,
};
