import { Plural, Trans } from '@lingui/macro';
import cntl from 'cntl';
import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import { Tag } from '@/components/ui/tag';
import { type components } from '@/lib/api/schema';
import { cn } from '@/lib/utils';

import { GradeDistribution } from './grade-distribution';
import { GradeHistogram } from './grade-histogram';
import { GradeTendencies } from './grade-tendencies';

interface GradeSummaryProps extends PropsWithChildren {
  title?: ReactNode;
  titleSize?: '3xl' | 'lg';
  subtitle?: ReactNode;
  grades?: components['schemas']['GradesResource'];
  graphSize?: 'sm' | 'md';
  info?: ReactNode;
}

function GradeSummary({
  title,
  titleSize = 'lg',
  subtitle,
  grades,
  graphSize = 'md',
  info,
}: GradeSummaryProps) {
  return (
    <GradeSummaryRoot>
      <GradeSummaryHeader grades={grades} info={info}>
        {/* text-3xl text-lg */}
        <GradeSummaryTitle size={titleSize}>{title}</GradeSummaryTitle>

        {subtitle && <GradeSummarySubtitle>{subtitle}</GradeSummarySubtitle>}
      </GradeSummaryHeader>

      {grades && <GradeSummaryGraph grades={grades} size={graphSize} />}
    </GradeSummaryRoot>
  );
}

const GradeSummaryRoot = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    {...props}
    className={cn(
      cntl`
        stack h-full w-full flex-wrap items-center justify-center 
        gap-2 lg:flex-row lg:items-start
      `,
      className,
    )}
  />
);

const GradeSummaryHeader = ({
  grades,
  children,
  className,
  info,
  ...props
}: ComponentProps<'div'> & {
  grades?: components['schemas']['GradesResource'];
  info?: ReactNode;
}) => (
  <div
    {...props}
    className={cn(
      'stack w-full grow items-start justify-center lg:w-min',
      className,
    )}
  >
    {children}

    <span className='mt-3' />

    {grades && <GradeTendencies grades={grades} />}

    {info}
  </div>
);

const GradeSummaryTitle = ({
  size,
  className,
  ...props
}: ComponentProps<'div'> & { size: '3xl' | 'lg' }) => (
  /* text-3xl text-lg */
  <div {...props} className={cn(`font-bold text-${size}`, className)} />
);

const GradeSummarySubtitle = ({
  className,
  ...props
}: ComponentProps<'div'>) => (
  <div {...props} className={cn('text-sm font-extralight', className)} />
);

const GradeSummaryGraph = ({
  size,
  grades,
  className,
  ...props
}: ComponentProps<'div'> & {
  size: 'md' | 'sm';
  grades: components['schemas']['GradesResource'];
}) => (
  <div className={cn('flex flex-col gap-2', className)} {...props}>
    <Tag>
      <Trans>
        {grades.total}{' '}
        <Plural value={grades.total} one='student' other='students' />
      </Trans>
    </Tag>

    <div className='flex flex-col-reverse items-center gap-2.5 sm:flex-row sm:items-start'>
      <GradeHistogram grades={grades} size={size} />
      <GradeDistribution grades={grades} size={size} />
    </div>
  </div>
);

export {
  GradeSummary,
  GradeSummaryRoot,
  GradeSummaryHeader,
  GradeSummaryTitle,
  GradeSummarySubtitle,
  GradeSummaryGraph,
};

export type { GradeSummaryProps };
