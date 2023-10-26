import Head from 'next/head';
import Script from 'next/script';
import { Box, Flex } from '@chakra-ui/react';
import { Footer } from '~/components/Layout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>uoZone</title>

        <link rel={'icon'} href={'/favicon.ico'} />
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
