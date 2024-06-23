import { useMemo } from 'react';

import { type components } from '@/lib/api/schema';
import { type Letter } from '@/lib/grade';
import { percent } from '@/lib/utils';

function useGradePercents(
  grades: components['schemas']['GradesResource'],
  includedLetters: Letter[],
) {
  const gradePercents = useMemo(() => {
    let total = 0;
    for (const letter of includedLetters) {
      total += grades.distribution[letter];
    }

    const gradePercents: { [t in Letter]: number } = {} as any;
    for (const letter of includedLetters) {
      gradePercents[letter] = percent(grades.distribution[letter], total);
    }

    return gradePercents;
  }, [grades, includedLetters]);

  return gradePercents;
}

export { useGradePercents };
