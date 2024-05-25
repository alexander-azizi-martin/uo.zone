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

    const node = ref.current;
    node.addEventListener('animationstart', onAnimation);
    node.addEventListener('animationend', onAnimationEnd);
    node.addEventListener('animationcancel', onAnimationEnd);

    return () => {
      isAnimating = false;

      node.removeEventListener('animationstart', onAnimation);
      node.removeEventListener('animationend', onAnimationEnd);
      node.removeEventListener('animationcancel', onAnimationEnd);
    };
  }, [ref]);
}
