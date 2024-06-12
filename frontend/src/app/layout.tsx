import './global.css';
import 'nprogress/nprogress.css';

import { IBM_Plex_Sans, Inter } from 'next/font/google';
import Script from 'next/script';
import { type PropsWithChildren } from 'react';

const inter = Inter({
  subsets: ['latin'],
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: '700',
  subsets: ['latin'],
  display: 'block',
  variable: '--font-plex',
});

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body className={`${inter.variable} ${ibmPlexSans.variable}`}>
        {children}

        <Script
          async
          src={'/stats/script.js'}
          data-domains={'uo.zone'}
          data-website-id={'fddef98b-d861-4a60-a798-f74bb07995cc'}
        />
      </body>
    </html>
  );
}
