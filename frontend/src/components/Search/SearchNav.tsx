import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';

import {
  SearchBar,
  type SearchBarProps,
  SearchResults,
} from '@/components/search';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';

import { useResizeOnAnimation } from './hooks/useResizeOnAnimation';
import { useSearchResults } from './hooks/useSearchResults';

interface SearchProps extends PropsWithChildren {
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
  searchBarProps?: Omit<SearchBarProps, 'value' | 'onChange' | 'placeholder'>;
}

export function SearchNav({
  onSearchOpen,
  onSearchClose,
  children,
  searchBarProps,
}: SearchProps) {
  const tSearch = useTranslations('Search');

  const searchResultsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useResizeOnAnimation(searchResultsRef);
  useResizeOnAnimation(contentRef);

  const searchBarRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(
    searchBarProps?.ref,
    () => searchBarRef.current as HTMLInputElement,
    [],
  );

  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const { searching, loading, results } = useSearchResults(query);

  useEffect(() => {
    setQuery('');
  }, [pathname]);

  useEffect(() => {
    if (searching) {
      onSearchOpen?.();
    } else {
      onSearchClose?.();
    }
  }, [searching, onSearchClose, onSearchOpen]);

  return (
    <Accordion
      type='single'
      value={searching ? 'search-results' : 'content'}
      className='w-full py-8'
    >
      <SearchBar
        {...searchBarProps}
        ref={searchBarRef}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        placeholder={tSearch('placeholder')}
      />

      <AccordionItem value='search-results' className='border-0'>
        <AccordionContent
          ref={searchResultsRef}
          className={`
            stack min-h-[calc(100vh-theme(spacing.16))]
            w-full items-start gap-8 px-2 pt-6
            ${
              searching
                ? 'duration-700 animate-in fade-in fill-mode-forwards'
                : 'duration-200 animate-out fade-out fill-mode-forwards'
            }
          `}
        >
          <h2 className='text-4xl'>
            {tSearch.rich('result', {
              query: query.trim(),
              quotes: (text) => <>&ldquo;{text}&rdquo;</>,
            })}
          </h2>

          {loading && (
            <h3>
              <Spinner className='mr-2' size={'sm'} />
              {tSearch('loading')}
            </h3>
          )}

          {results && (
            <SearchResults searchBar={searchBarRef} results={results} />
          )}
        </AccordionContent>
      </AccordionItem>

      {children && (
        <AccordionItem value='content' className='border-0'>
          <AccordionContent
            ref={contentRef}
            className='min-h-[calc(100vh-theme(spacing.16))] px-2'
          >
            {children}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
