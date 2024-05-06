import { type RefObject, useEffect } from 'react';

export function useResizeOnAnimation(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (ref.current === null) return;

    let isAnimating = false;
    const resizeWindow = () => {
      window.dispatchEvent(new Event('resize'));

      if (isAnimating) {
        requestAnimationFrame(resizeWindow);
      }
    };

    const onAnimation = () => {
      isAnimating = true;
      requestAnimationFrame(resizeWindow);
    };

    const onAnimationEnd = () => {
      isAnimating = false;
    };

    ref.current.addEventListener('animationstart', onAnimation);
    ref.current.addEventListener('animationend', onAnimationEnd);
    ref.current.addEventListener('animationcancel', onAnimationEnd);

    return () => {
      isAnimating = false;

      if (ref.current === null) return;

      ref.current.removeEventListener('animationstart', onAnimation);
      ref.current.removeEventListener('animationend', onAnimationEnd);
      ref.current.removeEventListener('animationcancel', onAnimationEnd);
    };
  }, [ref]);
}
