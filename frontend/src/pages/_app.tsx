import { ChakraProvider } from '@chakra-ui/provider';
import { type AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';

import ErrorBoundary from '~/components/ErrorBoundary';
import { usePreserveScroll } from '~/hooks';
import theme from '~/lib/theme';

export default function App({ Component, pageProps }: AppProps) {
  usePreserveScroll();

  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary>
          <Component {...pageProps} />{' '}
        </ErrorBoundary>
      </ChakraProvider>
    </NextIntlClientProvider>
  );
}

export { reportWebVitals } from 'next-axiom/dist/webVitals';
