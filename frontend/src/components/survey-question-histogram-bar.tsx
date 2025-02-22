'use client';

import cntl from 'cntl';
import { useRef } from 'react';

import { useBoolean } from '@/hooks/useBoolean';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { percent } from '@/lib/utils';

interface SurveyQuestionHistogramBarProps {
  label: string;
  value: number;
  total: number;
}

function SurveyQuestionHistogramBar({
  label,
  total,
  value,
}: SurveyQuestionHistogramBarProps) {
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
        className={cntl`
          relative min-w-[--question-bar-label-width] 
          max-w-[--question-bar-label-width] border-r border-solid 
          border-foreground/10 py-4 pr-1 text-center sm:pr-2
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

export { SurveyQuestionHistogramBar };

export type { SurveyQuestionHistogramBarProps };
