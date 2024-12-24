import { msg, Trans } from '@lingui/macro';

import { SurveyQuestionHistogram } from '@/components/survey-question-histogram';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';
import { type Locale } from '@/lingui.config';

interface CourseEvaluationsPageProps {
  params: {
    id: number;
    locale: Locale;
  };
}

export default async function CourseEvaluationsPage({
  params,
}: CourseEvaluationsPageProps) {
  const i18n = await loadI18n(params.locale);

  const survey = (
    await client.GET('/professors/{professor}/survey-responses', {
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
    <div className='flex h-full w-full flex-wrap justify-center gap-4 lg:gap-8'>
      {Object.entries(PROFESSOR_QUESTIONS).map(([question, title]) => {
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
const PROFESSOR_QUESTIONS = {
  // en
  'I find the professor well prepared for class': msg`Prepared`,
  'I think the professor conveys the subject matter effectively': msg`Clear Communication`,
  'The professor\'s feedback contributes to my learning': msg`Good Feedback`,
  'The professor is available to address questions outside of class': msg`Available`,
  'The professor shows respect towards the students': msg`Respectful`,
  'Instructions for completing activities and assignments are clear': msg`Good Instructions`,
  // fr
  'J\'estime que le professeur prépare bien ses cours': msg`Prepared`,
  'J\'estime que le professeur communique efficacement la matière': msg`Clear Communication`,
  'Le professeur est disponible pour répondre aux questions en dehors des heures de cours': msg`Available`,
  'Le professeur fait preuve de respect envers les étudiants': msg`Respectful`,
  'Les instructions sur les activités et les travaux à faire sont claires': msg`Good Instructions`,
};
