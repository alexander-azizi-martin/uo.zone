'use client';

import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from 'nuqs';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';

import { type Locale } from '@/lingui.config';

interface CourseFilterOptions {
  sortBy: 'code' | 'average' | 'median' | 'mode';
  sortOrder: 'increasing' | 'decreasing';
  years: ('1' | '2' | '3' | '4' | '5')[];
  languages: Locale[];
  term: ('fall' | 'winter' | 'summer')[];
}

const CourseFilterContext = createContext<{
  filterOptions: CourseFilterOptions;
  setFilterOptions: (
    key: keyof CourseFilterOptions,
    value: string | string[],
  ) => void;
  resetFilterOptions: () => void;
} | null>(null);

function CourseFilterProvider({ children }: PropsWithChildren) {
  const [filterOptions, setFilterOptionsObject] = useQueryStates(
    {
      sortBy: parseAsStringLiteral(['code', 'average', 'mode'])
        .withDefault('code')
        .withOptions({ clearOnDefault: true }),
      sortOrder: parseAsStringLiteral(['increasing', 'decreasing'])
        .withDefault('increasing')
        .withOptions({ clearOnDefault: true }),
      years: parseAsArrayOf(parseAsStringLiteral(['1', '2', '3', '4', '5']))
        .withDefault([])
        .withOptions({ clearOnDefault: true }),
      languages: parseAsArrayOf(parseAsStringLiteral(['en', 'fr']))
        .withDefault([])
        .withOptions({ clearOnDefault: true }),
      term: parseAsArrayOf(parseAsStringLiteral(['fall', 'winter', 'summer']))
        .withDefault([])
        .withOptions({ clearOnDefault: true }),
    },
    { clearOnDefault: true },
  );

  const resetFilterOptions = useCallback(() => {
    setFilterOptionsObject({
      sortBy: 'code',
      sortOrder: 'increasing',
      years: [],
      languages: [],
      term: [],
    });
  }, [setFilterOptionsObject]);

  const setFilterOptions = useCallback(
    (key: string, value: string | string[]) => {
      setFilterOptionsObject({ [key]: value });
    },
    [setFilterOptionsObject],
  );

  const courseFilterContext = useMemo(
    () => ({
      filterOptions,
      setFilterOptions,
      resetFilterOptions,
    }),
    [filterOptions, setFilterOptions, resetFilterOptions],
  );

  return (
    <CourseFilterContext.Provider value={courseFilterContext as any}>
      {children}
    </CourseFilterContext.Provider>
  );
}

export { CourseFilterContext, CourseFilterProvider };

export type { CourseFilterOptions };
