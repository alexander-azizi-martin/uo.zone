import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import debounce from 'lodash.debounce';
import {
  Spinner,
  Collapse,
  Heading,
  VStack,
  Box,
  InputGroupProps,
} from '@chakra-ui/react';
import { search, SearchResults as SearchResultsType } from '~/lib/api';
import { searchDurations } from '~/lib/config';
import { SearchBar, SearchResults } from '~/components/Search';

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
  const t = useTranslations('Search');
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

  useEffect(() => {
    setQuery('');
  }, [pathname]);

  useEffect(() => {
    setResults(null);
    setSearching(!!query);
    updateResults.cancel();
    if (query) updateResults(query);
  }, [query]);

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
        placeholder={t('placeholder')}
      />

      <Collapse
        in={searching}
        transition={{
          exit: { duration: searchDurations.enter },
          enter: {
            duration: (3 * searchDurations.exit) / 4,
            delay: searchDurations.exit / 8,
          },
        }}
        startingHeight={1}
      >
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
            {t.rich('result', {
              query: query.trim(),
              quotes: (text) => <>&ldquo;{text}&rdquo;</>,
            })}
          </Heading>

          {!results && query.trim() && (
            <Heading size={'md'} pt={4}>
              <Spinner size={'sm'} mr={2} />
              {t('loading')}
            </Heading>
          )}

          {results &&
            results.courses.length +
              results.professors.length +
              results.subjects.length ===
              0 && (
              <Heading size={'md'} pt={4}>
                {t('empty')}
              </Heading>
            )}

          {results && <SearchResults results={results} />}
        </VStack>
      </Collapse>

      {children && (
        <Collapse in={!searching} animateOpacity>
          <Box px={'10px'} pb={10}>
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
