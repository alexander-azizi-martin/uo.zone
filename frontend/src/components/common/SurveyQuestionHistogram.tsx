import { Trans } from '@lingui/macro';
import { InfoIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';

import { Tooltip } from '@/components/common/Tooltip';
import { Paper } from '@/components/ui/paper';
import { useBoolean } from '@/hooks/useBoolean';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { type SurveyQuestion } from '@/lib/api';
import { percent } from '@/lib/helpers';
import { Survey } from '@/lib/survey';

interface SurveyQuestionHistogramProps {
  title: string;
  tooltip: string;
  surveyQuestion: SurveyQuestion;
}

export function SurveyQuestionHistogram({
  title,
  tooltip,
  surveyQuestion,
}: SurveyQuestionHistogramProps) {
  const score = useMemo(() => Survey.score(surveyQuestion), [surveyQuestion]);

  return (
    <Paper className='w-[525px] pb-8 pr-8'>
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
          <h2 className='text-3xl text-black sm:text-4xl md:text-5xl'>
            {score.toFixed(2)}
          </h2>
          <h3 className='text-md pt-1 text-black sm:text-lg md:text-xl'>/ 5</h3>
        </div>
      </div>

      <div
        className={`
          relative 
          [--question-bar-label-width:70px] 
          sm:[--question-bar-label-width:100px]
        `}
      >
        {Object.entries(surveyQuestion.options)
          .sort(
            ([a], [b]) => Survey.RESPONSE_VALUES[b] - Survey.RESPONSE_VALUES[a],
          )
          .map(([option, responses]) => (
            <HistogramBar
              key={option}
              label={option}
              value={responses}
              total={surveyQuestion.totalResponses}
            />
          ))}

        {[0.25, 0.5, 0.75, 1].map((percent) => (
          <HistogramPercentBoundary key={percent} percent={percent} />
        ))}
      </div>
    </Paper>
  );
}

interface HistogramBar {
  label: string;
  value: number;
  total: number;
}

function HistogramBar({ label, value, total }: HistogramBar) {
  const [hovering, setHovering] = useBoolean(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: ref,
    handler: setHovering.off,
  });

  const valuePercent = Math.round(percent(value, total) * 100);

  return (
    <div
      ref={ref}
      className='flex w-full items-center'
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      onClick={setHovering.on}
    >
      <div
        className={`
          relative min-w-[--question-bar-label-width] 
          max-w-[--question-bar-label-width] border-r border-solid 
          border-black py-4 pr-1 text-center sm:pr-2
        `}
      >
        {label}
      </div>

      <div className='z-10 flex h-4 w-full items-center'>
        <div
          className='mr-1.5 h-full bg-geegee'
          style={{ width: `${valuePercent}%` }}
        />

        {hovering ? value : `${valuePercent}%`}
      </div>
    </div>
  );
}

interface HistogramPercentBoundaryProps {
  percent: number;
}

function HistogramPercentBoundary({ percent }: HistogramPercentBoundaryProps) {
  return (
    <div
      className='absolute top-0 h-full'
      style={{
        left: `calc(${percent * 100}% + ${1 - percent} * var(--question-bar-label-width))`,
      }}
    >
      <div
        className={`
          h-full w-px -translate-x-1/2
          border-l border-solid border-black/10 
        `}
      />

      <div
        className={`
          absolute bottom-0 w-fit -translate-x-1/2 translate-y-full 
          text-xs opacity-50
        `}
      >
        {Math.round(percent * 100)}%
      </div>
    </div>
  );
}
