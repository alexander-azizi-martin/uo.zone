import { type PropsWithChildren } from 'react';

import { SearchNav } from '@/components/search/search-nav';

export default function SearchNavLayout({ children }: PropsWithChildren) {
  return <SearchNav>{children}</SearchNav>;
}
