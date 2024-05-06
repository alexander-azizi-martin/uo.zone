import { cva, VariantProps } from 'class-variance-authority';
import { useMemo, useRef } from 'react';

import { useBoolean } from '@/hooks/useBoolean';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { GradeInfo } from '@/lib/api';
import { Grade, type Letter } from '@/lib/grade';
import { percent } from '@/lib/helpers';

const gradeHistogramVariants = cva('flex', {
  variants: {
    size: {
      sm: 'h-[40px]',
      md: 'h-[55px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface GradeHistogramProps
  extends VariantProps<typeof gradeHistogramVariants> {
  gradeInfo: GradeInfo;
}

export function GradeHistogram({ gradeInfo, size }: GradeHistogramProps) {
  const heightPercents = useMemo(() => {
    const nonNumericalTotal = Grade.NON_NUMERICAL_GRADES.reduce(
      (acc, letter) => acc + gradeInfo.grades[letter],
      0,
    );

    return Grade.NON_NUMERICAL_GRADES.map((letter) => {
      const heightPercent = percent(
        gradeInfo.grades[letter],
        nonNumericalTotal,
      );
      const complement = Math.max(0, 1 - heightPercent);

      return complement;
    });
  }, [gradeInfo]);

  return (
    <div className={gradeHistogramVariants({ size })}>
      {heightPercents.map((heightPercent, i) => (
        <Bar
          key={i}
          letter={Grade.NON_NUMERICAL_GRADES[i]}
          gradeInfo={gradeInfo}
          barHeightPercent={heightPercent}
        />
      ))}
    </div>
  );
}

interface BarProps {
  letter: Letter;
  gradeInfo: GradeInfo;
  barHeightPercent: number;
}

function Bar({ letter, gradeInfo, barHeightPercent }: BarProps) {
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
      <div className='relative flex h-full grow flex-col'>
        <div
          className={`h-[--height] w-full ${Grade.barColor(letter)} opacity-10`}
          style={{
            ['--height' as any]: `calc(100% * ${barHeightPercent})`,
          }}
        />
        <div
          className={`h-[--height] w-full ${Grade.barColor(letter)}`}
          style={{
            ['--height' as any]: `calc(100% * ${1 - barHeightPercent})`,
          }}
        />

        {hovering && (
          <div className='absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-black/20' />
        )}
      </div>

      <p className='m-auto h-3 w-fit text-2xs leading-3 opacity-80'>
        {hovering ? gradeInfo.grades[letter] : letter}
      </p>
    </div>
  );
}
