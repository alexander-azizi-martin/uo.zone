import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import Script from 'next/script';

import { Footer } from '~/components/Layout';
import { openGraph } from '~/lib/config';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
        <meta property={'twitter:description'} content={openGraph.description} />
      </Head>

      <Flex direction={'row'} justifyContent={'center'}>
        <Box px={[2, 5, 10]} maxW={'1300px'} width={'100%'}>
          <Box minH={'100vh'}>{children}</Box>
          <Footer />
        </Box>
      </Flex>

      <Script
        async
        src={'/stats/script.js'}
        data-domains={'uo.zone'}
        data-website-id={'fddef98b-d861-4a60-a798-f74bb07995cc'}
      />
    </>
  );
}
