'use client';

import { Trans } from '@lingui/macro';
import cntl from 'cntl';

import { SearchNav } from '@/components/search/search-nav';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useBoolean } from '@/hooks/useBoolean';

export default function IndexPage() {
  const [searching, setSearching] = useBoolean();

  return (
    <div className='stack w-full items-center md:items-start'>
      <Collapsible
        open={!searching}
        className={cntl`
          flex w-full flex-col-reverse items-center justify-center 
          md:flex-row md:items-end md:justify-between
        `}
      >
        <CollapsibleContent className='min-w-[410px]'>
          <h1
            className={cntl` 
              min-w-max text-center text-[50px] 
              sm:pt-2.5 sm:text-[55px] 
              md:pt-[calc(50vh-185px)] md:text-left md:text-[90px]
            `}
          >
            UO Grades
          </h1>
          <p className='py-2 text-center font-light md:text-left'>
            <Trans>
              View all the past grades for courses taken at the University of
              Ottawa.
            </Trans>
          </p>
        </CollapsibleContent>
        <CollapsibleContent
          className={cntl`
            relative 
            sm:pl-8
            md:top-24 md:opacity-50 
            lg:top-40
            dark:md:opacity-80
          `}
        >
          <img
            className={cntl`
              block w-[250px] pb-5 
              pt-20 
              sm:w-[300px] md:w-[500px] md:pb-0
              md:pt-0 dark:hidden
            `}
            src={'static/geegee-dark.svg'}
            alt={'Geegee'}
          />
          <img
            className={cntl`
              hidden w-[250px] pb-5 
              pt-20 
              sm:w-[300px] md:w-[500px] md:pb-0
              md:pt-0 dark:block
            `}
            src={'static/geegee-light.svg'}
            alt={'Geegee'}
          />
        </CollapsibleContent>
      </Collapsible>

      <SearchNav
        onSearchOpen={setSearching.on}
        onSearchClose={setSearching.off}
        searchBarProps={{
          autoFocus: true,
          className: 'md:w-3/5 z-10 mr-0 md:mr-12',
        }}
      />
    </div>
  );
}
