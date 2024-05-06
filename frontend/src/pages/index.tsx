import { useTranslations } from 'next-intl';

import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useBoolean } from '@/hooks/useBoolean';
import { useEffect, useRef } from 'react';

export default function Home() {
  const tHome = useTranslations('Home');

  const [searching, setSearching] = useBoolean();
  const searchBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("hello")
    searchBarRef.current?.select();
  }, [searchBarRef]);

  return (
    <Layout>
      <div className='stack w-full items-center md:items-start'>
        <Collapsible
          open={!searching}
          className={`
            flex w-full flex-col-reverse items-center justify-center 
            md:flex-row md:items-end md:justify-between
          `}
        >
          <CollapsibleContent className='min-w-[410px]'>
            <h1
              className={` 
                min-w-max text-center text-[50px] 
                sm:pt-2.5 sm:text-[55px] 
                md:pt-[calc(50vh-185px)] md:text-left md:text-[90px]
              `}
            >
              UO Grades
            </h1>
            <p className='py-2 text-center font-light md:text-left'>
              {tHome('description')}
            </p>
          </CollapsibleContent>
          <CollapsibleContent
            className={`
                relative 
                sm:pl-8
                md:top-24 md:opacity-50 
                lg:top-40
             `}
          >
            <img
              className={`
                w-[250px] pb-5 pt-20 
                sm:w-[300px] 
                md:w-[500px] md:pb-0 md:pt-0
              `}
              src={'geegee.svg'}
              alt={'Geegee'}
            />
          </CollapsibleContent>
        </Collapsible>

        <SearchNav
          onSearchOpen={setSearching.on}
          onSearchClose={setSearching.off}
          searchBarProps={{ ref: searchBarRef, className: 'w-full md:w-3/5' }}
        />
      </div>
    </Layout>
  );
}

export { getStaticProps } from '@/lib/dictionary';
