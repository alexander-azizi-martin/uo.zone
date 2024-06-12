'use client';

import { Trans } from '@lingui/macro';
import { ReactNode, type RefObject } from 'react';

import { Link } from '@/components/links/link';
import { Paper } from '@/components/ui/paper';

import { useSearchNavigation } from './hooks/useSearchNavigation';
import { type SearchResultsType } from './hooks/useSearchResults';

interface SearchResultsProps {
  results: SearchResultsType;
  searchBar?: RefObject<HTMLInputElement>;
}

function SearchResults({ results, searchBar }: SearchResultsProps) {
  useSearchNavigation(searchBar?.current);

  const numResults =
    results.subjects.length +
    results.courses.length +
    results.professors.length;

  return (
    <>
      {numResults === 0 && (
        <h3>
          <Trans>No results found.</Trans>
        </h3>
      )}

      <SearchResultCollection
        collection={results.subjects}
        header={<Trans>Subjects</Trans>}
        itemTitle={(item) => `${item.code} - ${item.subject}`}
        itemLink={(item) => `/subject/${item.code}`}
      />
      <SearchResultCollection
        collection={results.courses}
        header={<Trans>Courses</Trans>}
        itemTitle={(item) => item.title}
        itemLink={(item) => `/course/${item.code}`}
      />
      <SearchResultCollection
        collection={results.professors}
        header={<Trans>Professors</Trans>}
        itemTitle={(item) => item.name}
        itemLink={(item) => `/professor/${item.id}`}
      />
    </>
  );
}

interface SearchResultCollectionProps<T> {
  collection: T[];
  header: ReactNode;
  itemTitle: (item: T) => string;
  itemLink: (item: T) => string;
}

function SearchResultCollection<T>({
  collection,
  header,
  itemTitle,
  itemLink,
}: SearchResultCollectionProps<T>) {
  if (collection.length === 0) return null;

  return (
    <div className='flex w-full flex-col items-start gap-2'>
      <h3 className='text-md'>{header}</h3>
      {collection.map((item) => {
        const title = itemTitle(item);
        const link = itemLink(item);

        return (
          <Paper
            asChild
            key={link}
            variant='link'
            className='focus-visible:outline focus-visible:outline-geegee'
            data-search-result=''
          >
            <Link href={link}>{title}</Link>
          </Paper>
        );
      })}
    </div>
  );
}

export { SearchResults };

export type { SearchResultsProps };
