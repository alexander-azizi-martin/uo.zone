import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { ChakraProvider } from '@chakra-ui/react';
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

import { reportWebVitals as axiomReportWebVitals } from 'next-axiom';

export function reportWebVitals(metric: any) {
  console.log(metric);
  axiomReportWebVitals(metric);
}
