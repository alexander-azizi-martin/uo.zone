import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { search, type SearchResults as SearchResultsType } from '@/lib/api';

export function useSearchResults(query: string) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResultsType | null>();
  const { locale } = useRouter();

  const updateResults = useMemo(
    () =>
      debounce((query: string) => {
        search(query, locale)
          .then((data) => {
            setResults(data);
          })
          .catch(() => {
            setResults({ courses: [], professors: [], subjects: [] });
          });
      }, 300),
    [locale],
  );

  const debounceSetSearching = useMemo(() => debounce(setSearching, 500), []);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const trimmedQuery = query.trim();

    if (!!trimmedQuery) {
      debounceSetSearching.cancel();
      setSearching(true);
    } else {
      debounceSetSearching(false);
    }

    updateResults.cancel();
    if (trimmedQuery) {
      setResults(null);
      updateResults(trimmedQuery);
    }
  }, [query, updateResults]);

  return { searching, results, loading: searching && !results };
}
