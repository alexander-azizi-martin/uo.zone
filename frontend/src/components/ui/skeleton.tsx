import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  length: number;
}

function SkeletonList({ className, length }: SkeletonListProps) {
  return Array.from({ length }).map((_, i) => (
    <Skeleton key={i} className={className} />
  ));
}

export { Skeleton, SkeletonList };

export type { SkeletonListProps };
