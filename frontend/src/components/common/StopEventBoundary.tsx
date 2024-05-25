'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';

export const StopEventBoundary = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>((props, ref) => {
  return (
    <div
      ref={ref}
      onClickCapture={(event) => {
        props.onClickCapture?.(event);
        event.stopPropagation();
        event.preventDefault();
      }}
      {...props}
    />
  );
});
StopEventBoundary.displayName = 'StopEventBoundary';
