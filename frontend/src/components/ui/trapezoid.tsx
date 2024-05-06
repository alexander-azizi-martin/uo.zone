import * as React from 'react';

import { cn } from '@/lib/utils';
import styles from '@/styles/trapezoid.module.css';

export interface TrapezoidProps extends React.HTMLAttributes<HTMLSpanElement> {
  leaning?: 'left' | 'right';
  heights: [string, string];
  width: string;
}

const Trapezoid = React.forwardRef<HTMLSpanElement, TrapezoidProps>(
  ({ className, leaning, heights, width, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.trapezoid, className)}
        data-leaning={leaning || 'left'}
        style={{
          ['--trapezoid-height-0' as any]: heights[0],
          ['--trapezoid-height-1' as any]: heights[1],
          ['--trapezoid-width' as any]: width,
        }}
        {...props}
      />
    );
  },
);
Trapezoid.displayName = 'Trapezoid';

export { Trapezoid };
