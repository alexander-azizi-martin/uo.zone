import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const paperVariants = cva(
  'relative block h-full w-full rounded-lg text-left text-base shadow-[0px_0px_4px_rgba(111,19,29,0.1)]',
  {
    variants: {
      variant: {
        default: '',
        link: 'hover:cursor-pointer hover:shadow-[0_0_6px_rgba(111,19,29,0.175)] focus-visible:outline-[#651d32]',
      },
      size: {
        md: 'py-3 px-5',
        lg: 'py-9 px-5 shadow-[0_0_4px_rgba(111,19,29,0.175)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface PaperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperVariants> {
  asChild?: boolean;
}

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, asChild, variant, size, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span';
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

export { Paper };
