import './global.css';
import 'nprogress/nprogress.css';

import Script from 'next/script';
import { type PropsWithChildren } from 'react';

export default async function LanguageLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
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
