import debounce from 'lodash.debounce';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { search, type SearchResults as SearchResultsType } from '@/lib/api';

export function useSearchResults(query: string) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResultsType | null>();
  const { locale } = useParams<{ locale: string }>()!;

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

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      setSearching(true);
    } else {
      setSearching(false);
    }

    updateResults.cancel();
    if (trimmedQuery) {
      setResults(null);
      updateResults(trimmedQuery);
    }
  }, [query, updateResults]);

  return { searching, results, loading: searching && !results };
}
