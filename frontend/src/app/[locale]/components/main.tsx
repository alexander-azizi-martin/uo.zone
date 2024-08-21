import { type PropsWithChildren } from 'react';

import { ThemeToggle } from '@/components/common/theme-toggle';

import { Footer } from './footer';

function Main({ children }: PropsWithChildren) {
  return (
    <div className='flex justify-center'>
      <div className='relative w-full max-w-[1300px] mx-2 sm:mx-5 md:mx-10'>
        <main className='min-h-[100vh]'>{children}</main>
        <Footer />

        <ThemeToggle className='absolute right-0 top-8' />
      </div>
    </div>
  );
}

export { Main };
