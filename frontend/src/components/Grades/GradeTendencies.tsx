import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { type GradeInfo } from '@/lib/api';
import { Grade } from '@/lib/grade';

interface GradeTendenciesProps {
  gradeInfo: GradeInfo;
}

export function GradeTendencies({ gradeInfo }: GradeTendenciesProps) {
  const tGrades = useTranslations('Grades');

  return (
    <div className='flex gap-2'>
      {gradeInfo.mean !== undefined &&
        gradeInfo.mean !== null &&
        gradeInfo.total > 0 && (
          <Badge
            className={`py-1 text-center ${Grade.badgeColor(gradeInfo.mean)}`}
            size={'sm'}
          >
            {tGrades('mean', {
              letter: Grade.letter(gradeInfo.mean),
              value: gradeInfo.mean.toFixed(3),
            })}
          </Badge>
        )}
      {gradeInfo.mode !== undefined &&
        gradeInfo.mode !== null &&
        gradeInfo.total > 0 && (
          <Badge
            className={`py-1 text-center ${Grade.badgeColor(gradeInfo.mode)}`}
            size={'sm'}
          >
            {tGrades('mode', {
              letter: gradeInfo.mode,
              percent: Math.round(
                (gradeInfo.grades[gradeInfo.mode] / gradeInfo.total) * 100,
              ),
            })}
          </Badge>
        )}
    </div>
  );
}
