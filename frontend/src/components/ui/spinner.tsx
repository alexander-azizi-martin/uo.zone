import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'inline-block animate-spin duration-500 rounded-full border-2 border-solid border-transparent border-l-current border-t-current',
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-4',
        md: 'size-6',
        lg: 'size-8',
        xl: 'size-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const Spinner = React.forwardRef<
  HTMLSpanElement,
  React.ButtonHTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof spinnerVariants>
>(({ className, size, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(spinnerVariants({ size, className }))}
    {...props}
  />
));
Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
