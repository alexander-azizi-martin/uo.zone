import { ExternalLinkIcon } from 'lucide-react';
import { type AnchorHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

function ExternalLink({
  href,
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target='_blank'
      className={cn(
        'inline-flex items-center font-medium text-foreground/70 hover:underline',
        className,
      )}
      {...props}
    >
      {children}
      <ExternalLinkIcon className='mx-0.5' size={14} />
    </a>
  );
}

export { ExternalLink };
