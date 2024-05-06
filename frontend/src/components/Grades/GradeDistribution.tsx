import { cva, type VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';

import { Trapezoid } from '@/components/ui/trapezoid';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { type GradeInfo } from '@/lib/api';
import { gradeGradient } from '@/lib/config';
import { Grade, type Letter } from '@/lib/grade';
import { pairwise, percent, createGradient } from '@/lib/helpers';

const gradeDistributionVariants = cva(
  `
    relative flex touch-none overflow-hidden rounded 
    h-[--grade-distribution-height] w-[--grade-distribution-width]
  `,
  {
    variants: {
      size: {
        sm: `
          [--grade-distribution-height:40px]
          [--grade-distribution-width:250px] 
          sm:[--grade-distribution-width:300px]
        `,
        md: ` 
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
  gradeInfo: GradeInfo;
}

const NUM_BINS = Grade.NUMERICAL_GRADES.length - 1;

export function GradeDistribution({ gradeInfo, size }: GradeDistributionProps) {
  const tGrades = useTranslations('Grades');

  const [selectedGrade, setSelectedGrade] = useState<Letter>();
  const gradient = createGradient(gradeGradient);
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: rootRef,
    handler: () => setSelectedGrade(undefined),
  });

  const heightPercents = useMemo(() => {
    const numericalTotal = Grade.NUMERICAL_GRADES.reduce(
      (acc, letter) => acc + gradeInfo.grades[letter],
      0,
    );

    return Grade.NUMERICAL_GRADES.map((letter) => {
      const gradePercent = percent(gradeInfo.grades[letter], numericalTotal);
      const heightPercent = 1 - gradePercent * 4;

      return Math.max(0, heightPercent);
    });
  }, [gradeInfo]);

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
    <div className='flex flex-col'>
      <div
        ref={rootRef}
        className={gradeDistributionVariants({ size })}
        style={{ background: gradient }}
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
              `round(calc(var(--grade-distribution-height) * ${currentPercent}), 1px)`,
              `round(calc(var(--grade-distribution-height) * ${nextPercent}), 1px)`,
            ]}
            leaning={currentPercent > nextPercent ? 'left' : 'right'}
          />
        ))}

        {selectedGrade !== undefined && (
          <>
            <PinPoint
              x={`calc(100% * ${(1 / NUM_BINS) * Grade.value(selectedGrade)})`}
              y={`round(calc(100% * ${heightPercents[Grade.value(selectedGrade)]}), 1px)`}
            />

            <p
              className={`
                color-[#1B202B] absolute left-0 right-0 m-auto w-max 
                select-none text-xs font-bold
              `}
            >
              {tGrades('occurrence', {
                letter: selectedGrade,
                letterClass: selectedGrade[0],
                occurrences: gradeInfo.grades[selectedGrade],
                percent:
                  gradeInfo.total > 0
                    ? Math.round(
                        (gradeInfo.grades[selectedGrade] / gradeInfo.total) *
                          100,
                      )
                    : 0,
              })}
            </p>
          </>
        )}
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
        className={`
          absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 
          rounded-full bg-black/40
        `}
        style={{ left: x, top: y }}
      />
    </>
  );
}
