import { Badge } from '@/components/ui/badge';
import { type GradeInfo } from '@/lib/api';
import { Grade } from '@/lib/grade';
import { Trans } from '@lingui/macro';
import { percent } from '@/lib/helpers';
import { useLingui } from '@lingui/react';

interface GradeTendenciesProps {
  gradeInfo: GradeInfo;
}

export function GradeTendencies({ gradeInfo }: GradeTendenciesProps) {
  const { i18n } = useLingui();

  return (
    <div className='flex gap-2'>
      {gradeInfo.mean !== undefined &&
        gradeInfo.mean !== null &&
        gradeInfo.total > 0 && (
          <Badge
            className={`py-1 text-center ${Grade.badgeColor(gradeInfo.mean)}`}
            size={'sm'}
          >
            <Trans>
              {Grade.letter(gradeInfo.mean)} Average (
              {gradeInfo.mean.toFixed(3)})
            </Trans>
          </Badge>
        )}
      {gradeInfo.mode !== undefined &&
        gradeInfo.mode !== null &&
        gradeInfo.total > 0 && (
          <Badge
            className={`py-1 text-center ${Grade.badgeColor(gradeInfo.mode)}`}
            size={'sm'}
          >
            <Trans>
              Most Common: {gradeInfo.mode} (
              {i18n.number(
                percent(gradeInfo.grades[gradeInfo.mode], gradeInfo.total),
                { style: 'percent' },
              )}
              )
            </Trans>
          </Badge>
        )}
    </div>
  );
}
