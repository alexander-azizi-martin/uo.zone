import { Trans } from '@lingui/macro';
import cntl from 'cntl';
import { InfoIcon } from 'lucide-react';
import { type ReactNode } from 'react';

import { Paper } from '@/components/ui/paper';
import { Tooltip } from '@/components/ui/tooltip';
import { type components } from '@/lib/api/schema';

import { SurveyQuestionHistogramBar } from './survey-question-histogram-bar';
interface SurveyQuestionHistogramProps {
  title: ReactNode;
  tooltip: ReactNode;
  surveyQuestion: components['schemas']['SurveyQuestionResource'];
}

function SurveyQuestionHistogram({
  title,
  tooltip,
  surveyQuestion,
}: SurveyQuestionHistogramProps) {
  return (
    <Paper className='h-full w-[525px] pb-8 pr-8'>
      <div className='flex justify-between pb-6'>
        <div>
          <div className='flex items-center'>
            <p className='text-2xl font-bold leading-8 sm:text-3xl'>{title}</p>

            <Tooltip label={tooltip}>
              <div className='ml-1 text-gray-400'>
                <InfoIcon size={18} />
              </div>
            </Tooltip>
          </div>

          <p className='text-sm font-light leading-5'>
            {surveyQuestion.totalResponses} <Trans>responses</Trans>
          </p>
        </div>

        <div className='flex items-start gap-2'>
          <h2 className='text-3xl text-foreground sm:text-4xl md:text-5xl'>
            {surveyQuestion.score?.toFixed(2)}
          </h2>
          <h3 className='text-md pt-1 text-foreground sm:text-lg md:text-xl'>/ 5</h3>
        </div>
      </div>

      <div
        className={cntl`
          relative 
          [--question-bar-label-width:85px] 
          sm:[--question-bar-label-width:100px]
        `}
      >
        {surveyQuestion.responses.map(({ response, numResponses }) => (
          <SurveyQuestionHistogramBar
            key={response}
            label={response}
            value={numResponses}
            total={surveyQuestion.totalResponses}
          />
        ))}

        {[0.25, 0.5, 0.75, 1].map((percent) => (
          <SurveyQuestionHistogramPercentBoundary
            key={percent}
            percent={percent}
          />
        ))}
      </div>
    </Paper>
  );
}

export { SurveyQuestionHistogram };

export type { SurveyQuestionHistogramProps };

interface SurveyQuestionHistogramPercentBoundaryProps {
  percent: number;
}

function SurveyQuestionHistogramPercentBoundary({
  percent,
}: SurveyQuestionHistogramPercentBoundaryProps) {
  return (
    <div
      className='absolute top-0 h-full'
      style={{
        left: `calc(${percent * 100}% + ${1 - percent} * var(--question-bar-label-width))`,
      }}
    >
      <div
        className={cntl`
          h-full w-px -translate-x-1/2
          border-l border-solid border-foreground/10 
        `}
      />

      <div
        className={cntl`
          absolute bottom-0 w-fit -translate-x-1/2 translate-y-full 
          text-xs opacity-50
        `}
      >
        {Math.round(percent * 100)}%
      </div>
    </div>
  );
}
