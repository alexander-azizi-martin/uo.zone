import Link from 'next/link';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const CourseLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof Link>
>(({ className, ...props }, ref) => {
  return (
    <Link
      {...props}
      ref={ref}
      className={cn(
        'text-garnet underline decoration-1 hover:decoration-2',
        className,
      )}
    />
  );
});
CourseLink.displayName = 'CourseLink';
