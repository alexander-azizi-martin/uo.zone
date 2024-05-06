import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export interface CollapsibleContentProps
  extends React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.CollapsibleContent
  > {
  animateOpacity?: boolean;
}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(({ animateOpacity, className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
    'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all fill-mode-forwards',
      //   animateOpacity &&
      //     'data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
      className,
    )}
    {...props}
  />
));
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
