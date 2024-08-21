import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const paperVariants = cva(
  'block h-full w-full rounded-lg text-left text-base shadow-[0px_0px_4px] shadow-geegee-light/20 dark:shadow-geegee-light/80',
  {
    variants: {
      variant: {
        default: '',
        link: 'preventable-hover:cursor-pointer preventable-hover:shadow-[0_0_6px] preventable-hover:shadow-geegee-light/30 preventable-hover:dark:shadow-geegee-light/90 focus-visible:outline-geegee',
      },
      size: {
        md: 'py-3 px-5',
        lg: 'py-9 px-5 shadow-[0_0_6px] shadow-geegee-light/30 dark:shadow-geegee-light/90',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

interface PaperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperVariants> {
  asChild?: boolean;
}

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, asChild, variant, size, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(paperVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Paper.displayName = 'Paper';

export { Paper, paperVariants };

export type { PaperProps };
