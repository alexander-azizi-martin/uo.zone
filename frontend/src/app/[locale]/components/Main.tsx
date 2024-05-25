import { type PropsWithChildren } from 'react';

import { Footer } from './Footer';

export function Main({ children }: PropsWithChildren) {
  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-[1300px] px-2 sm:px-5 md:px-10'>
        <main className='min-h-[100vh]'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
