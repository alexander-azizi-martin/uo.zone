'use client';

import clsx from 'clsx';
import { ChevronUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let prevScrollY: number;

    const handleScroll = () => {
      if (prevScrollY !== undefined) {
        // Only show back to top button when user has scrolled 300px
        // down and starts scrolling up
        setShow(prevScrollY > window.scrollY && window.scrollY >= 300);
      }

      prevScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      data-umami-event='back-to-top'
      className={clsx(
        'fixed bottom-4 right-4 z-50 size-10 rounded-full p-0 transition-all',
        show && 'visible scale-100 opacity-100',
        !show && 'invisible scale-0 opacity-0',
      )}
    >
      <ChevronUpIcon size={24} />
    </Button>
  );
}

export { BackToTopButton };
