import { Trans } from '@lingui/macro';

import { Badge } from '@/components/ui/badge';
import { type components } from '@/lib/api/schema';
import { Grade } from '@/lib/grade';
import { percent } from '@/lib/utils';

interface GradeTendenciesProps {
  grades: components['schemas']['GradesResource'];
}

export function GradeTendencies({ grades }: GradeTendenciesProps) {
  return (
    <div className='flex gap-2'>
      {grades.mean !== undefined &&
        grades.mean !== null &&
        grades.total > 0 && (
          <Badge
            className={`py-1 text-center ${Grade.badgeColor(grades.mean)}`}
            size={'sm'}
          >
            <Trans>
              {Grade.letter(grades.mean)} Average ({grades.mean.toFixed(3)})
            </Trans>
          </Badge>
        )}
      {grades.mode !== undefined &&
        grades.mode !== null &&
        grades.total > 0 && (
          <Badge
            className={`py-1 text-center ${Grade.badgeColor(grades.mode as any)}`}
            size={'sm'}
          >
            <Trans>
              Most Common: {grades.mode} (
              {Math.round(
                percent(grades.distribution[grades.mode], grades.total) * 100,
              )}
            </Trans>
          </Badge>
        )}
    </div>
  );
}
