import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { Link } from '@/components/links/Link';
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
        'text-[#8f001a] underline decoration-1 hover:decoration-2',
        className,
      )}
    />
  );
});
CourseLink.displayName = 'CourseLink';
