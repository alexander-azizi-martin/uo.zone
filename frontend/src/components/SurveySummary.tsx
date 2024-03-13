import { VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BigNumberCard } from '~/components';
import { type SurveyQuestion } from '~/lib/api';
import Survey from '~/lib/survey';

interface SurveySummaryProps {
  survey: SurveyQuestion[];
  questions: { [key: string]: string };
}

export function SurveySummary(props: SurveySummaryProps) {
  const tSurvey = useTranslations('Survey');

  const survey = useMemo(() => new Survey(props.survey), [props.survey]);

  return (
    <VStack spacing={4} align={'start'} w={'100%'}>
      <Wrap spacing={'8px'} w={'100%'} overflow={'visible'}>
        {Object.entries(props.questions)
          .filter(([question]) => survey.has(question))
          .map(([question, name], _, questions) => (
            <WrapItem
              flexGrow={1}
              flexBasis={questions.length < 5 ? '45%' : '30%'}
              key={question}
            >
              <BigNumberCard
                info={tSurvey(`${name}.info`)}
                tooltip={tSurvey(`${name}.tooltip`, {
                  responses: survey.totalResponses(question),
                })}
                value={survey.score(question).toFixed(2)}
                total={5}
              />
            </WrapItem>
          ))}
      </Wrap>
      <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
        {survey.numQuestions() > 0 && (
          <BigNumberCard
            info={tSurvey('overall.info')}
            value={survey.averageScore(Object.keys(props.questions)).toFixed(2)}
            tooltip={tSurvey(`overall.tooltip`)}
            total={5}
          />
        )}
      </Wrap>
    </VStack>
  );
}
