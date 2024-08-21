'use client';

import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import cntl from 'cntl';
import { usePathname } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

import { useResizeOnAnimation } from './hooks/useResizeOnAnimation';
import { useSearchResults } from './hooks/useSearchResults';
import { SearchBar, type SearchBarProps } from './search-bar';
import { SearchResults } from './search-results';

interface SearchNavProps extends PropsWithChildren {
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
  searchBarProps?: Omit<SearchBarProps, 'value' | 'onChange' | 'placeholder'>;
}

function SearchNav({
  onSearchOpen,
  onSearchClose,
  children,
  searchBarProps,
}: SearchNavProps) {
  const { _ } = useLingui();

  const searchResultsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useResizeOnAnimation(searchResultsRef);
  useResizeOnAnimation(contentRef);

  const searchBarRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const { searching, stopSearching, loading, results } =
    useSearchResults(query);

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
      className='w-full pt-8'
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          stopSearching();
        }
      }}
    >
      <SearchBar
        {...searchBarProps}
        ref={searchBarRef}
        value={query}
        className={cn('mr-12', searchBarProps?.className)}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        placeholder={_(msg`Search by Course, Professor, or Subject`)}
      />

      <AccordionItem value='search-results' className='border-0'>
        <AccordionContent
          ref={searchResultsRef}
          className={cntl`
            stack min-h-search-nav-body
            w-full items-start gap-8 px-2 pb-0 pt-6
            ${
              searching
                ? 'duration-700 animate-in fade-in fill-mode-forwards'
                : 'duration-200 animate-out fade-out fill-mode-forwards'
            }
          `}
        >
          <h2 className='text-4xl'>
            <Trans>Search Results for &ldquo;{query}&rdquo;</Trans>
          </h2>

          {loading && (
            <h3>
              <Spinner className='mr-2' size={'sm'} />
              <Trans>Loading...</Trans>
            </h3>
          )}

          {results && (
            <SearchResults searchBar={searchBarRef} results={results} />
          )}

          <div></div>
        </AccordionContent>
      </AccordionItem>

      {children && (
        <AccordionItem value='content' className='border-0'>
          <AccordionContent
            ref={contentRef}
            className='min-h-search-nav-body px-2 pb-0'
          >
            {children}

            <div className='pb-8'></div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

export { SearchNav };

export type { SearchNavProps };
