'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { useMemo, useRef } from 'react';

import { useBoolean } from '@/hooks/useBoolean';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { type components } from '@/lib/api/schema';
import { Grade, type Letter } from '@/lib/grade';
import { percent } from '@/lib/utils';

const gradeHistogramVariants = cva('flex hover:cursor-default', {
  variants: {
    size: {
      sm: '[--grade-histogram-bar-height:40px]',
      md: '[--grade-histogram-bar-height:55px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface GradeHistogramProps
  extends VariantProps<typeof gradeHistogramVariants> {
  grades: components['schemas']['GradesResource'];
}

function GradeHistogram({ grades, size }: GradeHistogramProps) {
  const heightPercents = useMemo(() => {
    const nonNumericalTotal = Grade.NON_NUMERICAL_GRADES.reduce(
      (acc, letter) => acc + grades.distribution[letter],
      0,
    );

    return Grade.NON_NUMERICAL_GRADES.map((letter) => {
      const heightPercent = percent(
        grades.distribution[letter],
        nonNumericalTotal,
      );
      const complement = Math.max(0, 1 - heightPercent);

      return complement;
    });
  }, [grades]);

  return (
    <div className={gradeHistogramVariants({ size })}>
      {heightPercents.map((heightPercent, i) => (
        <Bar
          key={i}
          letter={Grade.NON_NUMERICAL_GRADES[i]}
          grades={grades}
          barHeightPercent={heightPercent}
        />
      ))}
    </div>
  );
}

interface BarProps {
  letter: Letter;
  grades: components['schemas']['GradesResource'];
  barHeightPercent: number;
}

function Bar({ letter, grades, barHeightPercent }: BarProps) {
  const [hovering, setHovering] = useBoolean(false);
  const ref = useRef(null);
  useOutsideClick({
    ref: ref,
    handler: setHovering.off,
  });

  return (
    <div
      ref={ref}
      className='w-8'
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      onClick={setHovering.on}
    >
      <div className='relative flex h-[--grade-histogram-bar-height] grow flex-col'>
        <div
          className={`w-full ${Grade.barColor(letter)} opacity-10`}
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
          <div className='absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-black/20' />
        )}
      </div>

      <p className='m-auto h-3 w-fit text-2xs leading-3 opacity-80'>
        {hovering ? grades.distribution[letter] : letter}
      </p>
    </div>
  );
}

export { GradeHistogram };

export type { GradeHistogramProps };
