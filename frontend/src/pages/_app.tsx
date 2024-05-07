import 'nprogress/nprogress.css';
import '@/styles/global.css';

import { type AppProps } from 'next/app';
import { IBM_Plex_Sans, Inter } from 'next/font/google';

import { I18nProvider } from '@/components/layout/I18nProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useNProgress } from '@/hooks/useNProgress';
import { usePreserveScroll } from '@/hooks/usePreserveScroll';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';

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

  const router = useRouter();

  return (
    <div id='body' className={cn(inter.variable, ibmPlexSans.variable)}>
      <I18nProvider locale={router.locale!} messages={pageProps.messages}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </I18nProvider>
    </div>
  );
}

export { reportWebVitals } from 'next-axiom/dist/webVitals';
