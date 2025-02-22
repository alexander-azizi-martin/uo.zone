'use client';

import { useRef } from 'react';

import { useBoolean } from '@/hooks/useBoolean';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Grade, type Letter } from '@/lib/grade';

interface GradeHistogramBarProps {
  letter: Letter;
  value: number;
  barHeightPercent: number;
}

function GradeHistogramBar({
  letter,
  value,
  barHeightPercent,
}: GradeHistogramBarProps) {
  const [hovering, setHovering] = useBoolean(false);
  const ref = useRef(null);
  useOutsideClick({
    ref: ref,
    handler: setHovering.off,
  });

  return (
    <div
      ref={ref}
      className='w-8 border-foreground focus:border'
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      onClick={setHovering.on}
    >
      <div className='relative flex h-[--grade-histogram-bar-height] grow flex-col'>
        <div
          className={`w-full ${Grade.barColor(letter)} opacity-10 dark:opacity-20`}
          style={{
            height: `calc(100% * ${barHeightPercent})`,
          }}
        />
        <div
          className={`w-full ${Grade.barColor(letter)}`}
          style={{
            height: `calc(100% * ${1 - barHeightPercent})`,
          }}
        />

        {hovering && (
          <div className='absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-foreground/20' />
        )}
      </div>

      <p className='m-auto h-3 w-fit text-2xs leading-3 opacity-80'>
        {hovering ? value : letter}
      </p>
    </div>
  );
}

export { GradeHistogramBar };

export type { GradeHistogramBarProps };
