import { msg, Trans } from '@lingui/macro';

import { SurveyQuestionHistogram } from '@/components/common/survey-question-histogram';
import { client } from '@/lib/api/client';
import { getI18n, loadI18n } from '@/lib/i18n';

interface CourseEvaluationsPageProps {
  params: {
    id: number;
    locale: string;
  };
}

export default async function CourseEvaluationsPage({
  params,
}: CourseEvaluationsPageProps) {
  await loadI18n(params.locale);
  const i18n = getI18n();

  const survey = (
    await client.GET('/professors/{professor}/survey', {
      params: {
        path: { professor: params.id },
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
      {Object.entries(PROFESSOR_QUESTIONS).map(([question, titleMsg]) => {
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

const PROFESSOR_QUESTIONS = {
  // 'I find that the professor as a teacher is': msg`teacher`,
  'I find the professor well prepared for class': msg`Prepared`,
  'I think the professor conveys the subject matter effectively': msg`Communication`,
  'The professors feedback contributes to my learning': msg`Feedback`,
  'The professor is available to address questions outside of class': msg`Availability`,
  'The professor shows respect towards the students': msg`Respect`,
  'Instructions for completing activities and assignments are clear': msg`Instructions`,
};
