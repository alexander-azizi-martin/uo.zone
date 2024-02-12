import {
  Box,
  Collapse,
  Heading,
  InputGroupProps,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import { SearchBar, SearchResults } from '~/components/Search';
import { search, type SearchResults as SearchResultsType } from '~/lib/api';
import { searchDurations } from '~/lib/config';

interface SearchProps {
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
  children?: React.ReactNode;
  searchBarProps?: InputGroupProps;
}

export default function Search({
  onSearchClose,
  onSearchOpen,
  children,
  searchBarProps,
}: SearchProps) {
  const tSearch = useTranslations('Search');
  const { locale } = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResultsType | null>();

  const updateResults = useCallback(
    debounce((query: string) => {
      search(query, locale)
        .then((data) => {
          setResults(data);
        })
        .catch(() => {
          setResults({ courses: [], professors: [], subjects: [] });
        });
    }, 300),
    [locale]
  );

  // Removes query when page changes
  useEffect(() => {
    setQuery('');
  }, [pathname]);

  // Sends search request when query or language changes
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    const trimmedQuery = query.trim();
    setResults(null);
    setSearching(!!trimmedQuery);
    updateResults.cancel();
    if (trimmedQuery) updateResults(trimmedQuery);
  }, [query, locale, updateResults]);

  // Updates search listeners
  useEffect(() => {
    if (searching) onSearchOpen?.();
    else onSearchClose?.();
  }, [searching, onSearchClose, onSearchOpen]);

  return (
    <Box pt={8} w={'100%'}>
      <SearchBar
        {...searchBarProps}
        value={query}
        onChange={setQuery}
        placeholder={tSearch('placeholder')}
      />

      <Collapse in={searching} startingHeight={1}>
        <VStack
          spacing={4}
          width={'100%'}
          align={'start'}
          px={2}
          pt={2}
          pb={16}
          minH={'75vh'}
        >
          <Heading pt={4}>
            {tSearch.rich('result', {
              query: query.trim(),
              quotes: (text) => <>&ldquo;{text}&rdquo;</>,
            })}
          </Heading>

          {!results && query.trim() && (
            <Heading size={'md'} pt={4}>
              <Spinner size={'sm'} mr={2} />
              {tSearch('loading')}
            </Heading>
          )}

          {results &&
            results.courses.length +
              results.professors.length +
              results.subjects.length ===
              0 && (
              <Heading size={'md'} pt={4}>
                {tSearch('empty')}
              </Heading>
            )}

          {results && <SearchResults results={results} />}
        </VStack>
      </Collapse>

      {children && (
        <Collapse
          unmountOnExit={false}
          in={!searching}
          startingHeight={0.01}
          animateOpacity
          transition={{
            exit: { duration: searchDurations.exit },
            enter: { duration: searchDurations.enter },
          }}
        >
          <Box
            px={'10px'}
            pb={10}
            style={{ transition: 'opacity 0.2s', opacity: searching ? 0 : 1 }}
          >
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
