import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';

import theme from '~/lib/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </NextIntlClientProvider>
  );
}

export { reportWebVitals } from 'next-axiom';
