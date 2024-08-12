'use client';

import { Plural, Select, Trans } from '@lingui/macro';
import { cva, type VariantProps } from 'class-variance-authority';
import cntl from 'cntl';
import { useRef, useState } from 'react';

import { Trapezoid } from '@/components/ui/trapezoid';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { type components } from '@/lib/api/schema';
import { Grade, type Letter } from '@/lib/grade';
import { pairwise, percent } from '@/lib/utils';

const gradeDistributionVariants = cva(
  cntl`
    relative flex touch-none overflow-hidden rounded 
    bg-grades-gradient 
    h-[--grade-distribution-height] w-[--grade-distribution-width]
  `,
  {
    variants: {
      size: {
        sm: cntl`
          [--grade-distribution-height:40px]
          [--grade-distribution-width:250px] 
          sm:[--grade-distribution-width:300px]
        `,
        md: cntl` 
          [--grade-distribution-height:55px]
          [--grade-distribution-width:300px] 
          sm:[--grade-distribution-width:390px]
        `,
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

interface GradeDistributionProps
  extends VariantProps<typeof gradeDistributionVariants> {
  grades: components['schemas']['GradesResource'];
}

const NUM_BINS = Grade.NUMERICAL_GRADES.length - 1;

function GradeDistribution({ grades, size }: GradeDistributionProps) {
  const numericalTotal = Grade.NUMERICAL_GRADES.reduce(
    (acc, letter) => acc + grades.distribution[letter],
    0,
  );

  const heightPercents = Grade.NUMERICAL_GRADES.map((letter) => {
    const gradePercent = percent(grades.distribution[letter], numericalTotal);
    const heightPercent = 1 - gradePercent * 4;

    return Math.max(0, heightPercent).toFixed(2);
  });

  const [selectedGrade, setSelectedGrade] = useState<Letter>();
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: rootRef,
    handler: () => setSelectedGrade(undefined),
  });

  const handleMouseMove = (event: any) => {
    if (!rootRef.current) return;

    event.stopPropagation();

    const rootRect = rootRef.current.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rootRect.left;

    let minDistance = Infinity;
    let closestGrade = -1;
    for (let grade = 0; grade < 11; grade++) {
      const distance = Math.abs(rootRect.width * (grade / NUM_BINS) - x);

      if (distance < minDistance) {
        minDistance = distance;
        closestGrade = grade;
      }
    }

    setSelectedGrade(Grade.letter(closestGrade));
  };

  return (
    <div className='prevent-hover z-10 flex flex-col hover:cursor-default'>
      <div
        ref={rootRef}
        className={gradeDistributionVariants({ size })}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={() => setSelectedGrade(undefined)}
      >
        {pairwise(heightPercents).map(([currentPercent, nextPercent], i) => (
          <Trapezoid
            key={i}
            className='text-white/90'
            width={`calc(var(--grade-distribution-width) * ${1 / NUM_BINS})`}
            heights={[
              `calc(var(--grade-distribution-height) * ${currentPercent})`,
              `calc(var(--grade-distribution-height) * ${nextPercent})`,
            ]}
            leaning={currentPercent > nextPercent ? 'left' : 'right'}
          />
        ))}
        {selectedGrade && (
          <>
            <PinPoint
              x={`calc(100% * ${(1 / NUM_BINS) * Grade.value(selectedGrade)})`}
              y={`calc(100% * ${heightPercents[Grade.value(selectedGrade)]})`}
            />

            <p
              className={cntl`
              color-[#1B202B] absolute left-0 right-0 m-auto w-max 
              select-none text-xs font-bold
            `}
            >
              <Trans>
                {grades.distribution[selectedGrade]}{' '}
                <Plural
                  value={grades.distribution[selectedGrade]}
                  one='student'
                  other='students'
                />{' '}
                got <Select value={selectedGrade[0]} _A={'an'} other={'a'} />{' '}
                {selectedGrade}{' '}
                {`(${Math.round(percent(grades.distribution[selectedGrade], grades.total) * 100)}%)`}
              </Trans>
            </p>
          </>
        )}{' '}
      </div>

      <div className='relative h-3.5'>
        {Grade.NUMERICAL_GRADES.filter((_, i) => i % 2 === 0).map(
          (letter, i) => (
            <p
              key={letter}
              className='absolute top-0 -translate-x-1/2 text-3xs leading-3 opacity-60'
              style={{ left: `calc(100% * ${(i / NUM_BINS) * 2})` }}
            >
              {letter}
            </p>
          ),
        )}
      </div>
    </div>
  );
}

export { GradeDistribution };

export type { GradeDistributionProps };

interface PinPointProps {
  x: string;
  y: string;
}

function PinPoint({ x, y }: PinPointProps) {
  return (
    <>
      <div
        className='absolute h-0.5 w-full -translate-y-1/2 bg-black/10'
        style={{ top: y }}
      />
      <div
        className='absolute h-full w-0.5 -translate-x-1/2 bg-black/20'
        style={{ left: x }}
      />
      <div
        className={cntl`
          absolute size-1 -translate-x-1/2 -translate-y-1/2 
          rounded-full bg-black/40
        `}
        style={{ left: x, top: y }}
      />
    </>
  );
}
