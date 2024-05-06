import Head from 'next/head';
import Script from 'next/script';

import { Footer } from '@/components/layout';
import { openGraph } from '@/lib/config';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>UO Grades</title>

        <link rel={'icon'} href={'/favicon.ico'} />
        <meta name={'description'} content={openGraph.description} />
        <meta name={'theme-color'} content={openGraph.theme} />
        <meta property={'og:type'} content={'website'} />
        <meta property={'og:url'} content={openGraph.url} />
        <meta property={'og:title'} content={openGraph.title} />
        <meta property={'og:description'} content={openGraph.description} />
        <meta property={'og:image'} content={openGraph.image} />
        <meta property={'twitter:image'} content={openGraph.image} />
        <meta property={'twitter:card'} content={'summary_large_image'} />
        <meta property={'twitter:url'} content={openGraph.url} />
        <meta property={'twitter:title'} content={openGraph.title} />
        <meta
          property={'twitter:description'}
          content={openGraph.description}
        />
      </Head>

      <div className='flex justify-center'>
        <div className='w-full max-w-[1300px] px-5 sm:px-5 md:px-10'>
          <div className='min-h-[100vh]'>{children}</div>
          <Footer />
        </div>
      </div>

      <Script
        async
        src={'/stats/script.js'}
        data-domains={'uo.zone'}
        data-website-id={'fddef98b-d861-4a60-a798-f74bb07995cc'}
      />
    </>
  );
}
