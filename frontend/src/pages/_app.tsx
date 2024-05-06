import 'nprogress/nprogress.css';
import '@/styles/global.css';

import { type AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { IBM_Plex_Sans, Inter } from 'next/font/google';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useNProgress } from '@/hooks/useNProgress';
import { usePreserveScroll } from '@/hooks/usePreserveScroll';
import { cn } from '@/lib/utils';

export const inter = Inter({
  subsets: ['latin'],
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const ibmPlexSans = IBM_Plex_Sans({
  weight: '700',
  subsets: ['latin'],
  display: 'block',
  variable: '--font-plex',
});

export default function App({ Component, pageProps }: AppProps) {
  usePreserveScroll();
  useNProgress();

  return (
    <div id='body' className={cn(inter.variable, ibmPlexSans.variable)}>
      <NextIntlClientProvider messages={pageProps.messages}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </NextIntlClientProvider>
    </div>
  );
}

export { reportWebVitals } from 'next-axiom/dist/webVitals';
