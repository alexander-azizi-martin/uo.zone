import { Plural, Trans } from '@lingui/macro';
import { type ReactNode } from 'react';

import { StopEventBoundary } from '@/components/common/StopEventBoundary';
import { Tag } from '@/components/ui/tag';
import { type GradeInfo } from '@/lib/api';

import { GradeDistribution } from './GradeDistribution';
import { GradeHistogram } from './GradeHistogram';
import { GradeTendencies } from './GradeTendencies';

interface GradeSummaryProps {
  title?: ReactNode;
  titleSize?: '3xl' | 'lg';
  subtitle?: ReactNode;
  info?: ReactNode;
  gradeInfo?: GradeInfo;
  graphSize?: 'sm' | 'md';
}

export function GradeSummary({
  title,
  titleSize = 'lg',
  subtitle,
  info,
  gradeInfo,
  graphSize = 'md',
}: GradeSummaryProps) {
  return (
    <div
      className={`
        stack h-full w-full flex-wrap items-center justify-center gap-2 
        lg:flex-row lg:items-start
      `}
    >
      <div className='stack w-full grow items-start justify-center lg:w-min'>
        {/* text-3xl text-lg */}
        <div className={`font-bold text-${titleSize}`}>{title}</div>

        {subtitle && <div className='text-sm font-extralight'>{subtitle}</div>}

        <span className='mt-3' />

        {gradeInfo && <GradeTendencies gradeInfo={gradeInfo} />}

        {info && info}
      </div>

      {gradeInfo && (
        <StopEventBoundary className='flex flex-col gap-2'>
          <Tag>
            <Trans>
              {gradeInfo.total}{' '}
              <Plural value={gradeInfo.total} one='student' other='students' />
            </Trans>
          </Tag>

          <div
            className={`
            flex flex-col-reverse items-center gap-2.5 
            sm:flex-row sm:items-start
          `}
          >
            <GradeHistogram gradeInfo={gradeInfo} size={graphSize} />
            <GradeDistribution gradeInfo={gradeInfo} size={graphSize} />
          </div>
        </StopEventBoundary>
      )}
    </div>
  );
}
