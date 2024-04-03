import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useRef } from 'react';

import { removeQueryString } from '~/lib/helpers';

export function useNProgress() {
  const router = useRouter();
  const routeChanged = useRef(false);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
    });

    const handleRouteChangeStart = (url: string) => {
      routeChanged.current =
        removeQueryString(url) !== removeQueryString(router.asPath);
      if (routeChanged.current) {
        NProgress.start();
      }
    };

    const handleRouteChangeComplete = () => {
      if (routeChanged.current) {
        routeChanged.current = false;
        NProgress.done();
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);
}
