import debounce from 'lodash.debounce';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { client } from '@/lib/api/client';
import { type components } from '@/lib/api/schema';

interface SearchResultsType {
  subjects: components['schemas']['SubjectSearchRecourse'][];
  courses: components['schemas']['CourseSearchRecourse'][];
  professors: components['schemas']['ProfessorSearchRecourse'][];
}

function useSearchResults(query: string) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResultsType | null>();
  const { locale } = useParams<{ locale: string }>()!;

  const updateResults = useMemo(
    () =>
      debounce((query: string) => {
        client
          .POST('/search', {
            body: { q: query },
            params: { header: { 'Accept-Language': locale } },
          })
          .then(({ data }) => {
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

export { useSearchResults };

export type { SearchResultsType };
