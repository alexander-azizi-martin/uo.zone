'use client';

import { type PropsWithChildren } from 'react';

import { trackEvent } from '@/lib/helpers';

interface TrackClickProps extends PropsWithChildren {
  event: string;
}

export function TrackClick({ children, event }: TrackClickProps) {
  return (
    <span
      onClickCapture={() => {
        trackEvent(event);
      }}
    >
      {children}
    </span>
  );
}
