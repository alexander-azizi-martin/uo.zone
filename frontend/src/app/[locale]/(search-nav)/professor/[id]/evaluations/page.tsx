import { Trans } from '@lingui/macro';

import { SurveyQuestionHistogram } from '@/components/common/survey-question-histogram';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';

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
const PROFESSOR_QUESTIONS = {
  // en
  'I find the professor well prepared for class': 'Prepared',
  'I think the professor conveys the subject matter effectively': 'Communication',
  'The professor\'s feedback contributes to my learning': 'Feedback',
  'The professor is available to address questions outside of class': 'Availability',
  'The professor shows respect towards the students': 'Respect',
  'Instructions for completing activities and assignments are clear': 'Instructions',
  // fr
  'J\'estime que le professeur prépare bien ses cours': 'Préparé',
  'J\'estime que le professeur communique efficacement la matière': 'Communication',
  'Le professeur est disponible pour répondre aux questions en dehors des heures de cours': 'Disponibilité',
  'Le professeur fait preuve de respect envers les étudiants': 'Respect',
  'Les instructions sur les activités et les travaux à faire sont claires': 'Instructions',
};
