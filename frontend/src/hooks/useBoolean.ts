import { useMemo, useState } from 'react';

export function useBoolean(
  initialState: boolean | (() => boolean) = false,
): [boolean, { on: () => void; off: () => void; toggle: () => void }] {
  const [bool, setBool] = useState(initialState);

  const setBoolFuncs = useMemo(
    () => ({
      on() {
        setBool(true);
      },
      off() {
        setBool(false);
      },
      toggle() {
        setBool((value) => !value);
      },
    }),
    [],
  );

  return [bool, setBoolFuncs];
}
