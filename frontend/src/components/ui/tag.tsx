import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'm-auto rounded bg-accent px-2 text-xs font-bold uppercase',
          className,
        )}
        {...props}
      />
    );
  },
);
Tag.displayName = 'Tag';

export { Tag };
