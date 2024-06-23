import { cva, VariantProps } from 'class-variance-authority';

import { type components } from '@/lib/api/schema';
import { Grade } from '@/lib/grade';
import { percent } from '@/lib/utils';

import { GradeHistogramBar } from './grade-histogram-bar';

const gradeHistogramVariants = cva(
  'prevent-hover z-10 flex hover:cursor-default',
  {
    variants: {
      size: {
        sm: '[--grade-histogram-bar-height:40px]',
        md: '[--grade-histogram-bar-height:55px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

interface GradeHistogramProps
  extends VariantProps<typeof gradeHistogramVariants> {
  grades: components['schemas']['GradesResource'];
}

function GradeHistogram({ grades, size }: GradeHistogramProps) {
  const nonNumericalTotal = Grade.NON_NUMERICAL_GRADES.reduce(
    (acc, letter) => acc + grades.distribution[letter],
    0,
  );

  const heightPercents = Grade.NON_NUMERICAL_GRADES.map((letter) => {
    const heightPercent = percent(
      grades.distribution[letter],
      nonNumericalTotal,
    );
    const complement = Math.max(0, 1 - heightPercent);

    return complement;
  });

  return (
    <div className={gradeHistogramVariants({ size })}>
      {heightPercents.map((heightPercent, i) => (
        <GradeHistogramBar
          key={i}
          letter={Grade.NON_NUMERICAL_GRADES[i]}
          value={grades.distribution[Grade.NON_NUMERICAL_GRADES[i]]}
          barHeightPercent={heightPercent}
        />
      ))}
    </div>
  );
}

export { GradeHistogram };

export type { GradeHistogramProps };
