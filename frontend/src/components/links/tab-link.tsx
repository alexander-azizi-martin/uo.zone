'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';
import linguiConfig from '@/lingui.config';

import { Link, type LinkProps } from './link';

function TabLink({ href, ...props }: LinkProps) {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(
    new RegExp(`^/(${linguiConfig.locales.join('|')})`),
    '',
  );

  const active = normalizedPathname === href;

  return (
    <Link
      prefetch
      href={href}
      className={cn(
        '-mb-0.5 border-b-2 border-transparent px-4 py-2 text-base',
        active && 'border-garnet text-garnet',
      )}
      {...props}
    />
  );
}

function TabLinkList({ children }: PropsWithChildren) {
  return (
    <div className='my-4 flex justify-start border-b-2 border-solid border-accent'>
      {children}
    </div>
  );
}

export { TabLink, TabLinkList };
