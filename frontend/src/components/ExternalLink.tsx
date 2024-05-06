import { ExternalLinkIcon } from 'lucide-react';
import { type AnchorHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function ExternalLink({
  href,
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center font-medium text-gray-700 hover:underline',
        className,
      )}
      {...props}
    >
      {children}
      <ExternalLinkIcon className='mx-0.5' size={14} />
    </a>
  );
}
