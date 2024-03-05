import { useRef } from 'react';

export default function useFirstRender() {
  const ref = useRef(true);

  const firstRender = ref.current;
  ref.current = false;

  return firstRender;
}
