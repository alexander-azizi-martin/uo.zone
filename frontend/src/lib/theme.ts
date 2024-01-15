import { extendTheme } from '@chakra-ui/react';
import { IBM_Plex_Sans, Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  fallback: ['system-ui', 'arial'],
});

export const ibmPlexSans = IBM_Plex_Sans({
  weight: '700',
  subsets: ['latin'],
  display: 'block',
});

export default extendTheme({
  fonts: {
    body: `${inter.style.fontFamily}, sans-serif`,
    heading: `${ibmPlexSans.style.fontFamily}, sans-serif`,
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '700',
        color: '#651d32',
        letterSpacing: '-0.05em',
      },
    },
  },
});
