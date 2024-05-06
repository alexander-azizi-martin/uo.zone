import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'inline-block animate-spin duration-500 rounded-full border-2 border-solid border-transparent border-l-current border-t-current',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
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
>(({ className, size, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  );
});
Spinner.displayName = 'Spinner';

export { Spinner };
