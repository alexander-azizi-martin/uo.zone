import debounce from 'lodash.debounce';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

export default function useSessionStorage<T>(key: string, initState: T) {
  const [state, setState] = useState(initState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionValue = sessionStorage.getItem(key);

      if (sessionValue) setState(JSON.parse(sessionValue) as T);
    }
  }, [key]);

  const saveState = useCallback(
    debounce((value: T) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    }, 1000),
    [key]
  );

  useEffect(() => {
    saveState(state);
  }, [state, saveState]);

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
}
