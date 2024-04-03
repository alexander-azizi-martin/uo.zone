import Link from 'next/link';

import { BaseCard, type BaseCardProps } from '~/components';

interface LinkCardProps extends BaseCardProps {
  href: string;
  isExternal?: boolean;
}

export function LinkCard({
  href = '',
  isExternal,
  children,
  ...props
}: LinkCardProps) {
  return (
    <Link
      href={href}
      style={{ display: 'block', width: '100%', height: '100%' }}
      target={isExternal ? '_blank' : undefined}
    >
      <BaseCard
        {...props}
        as={'button'}
        _hover={{
          cursor: 'pointer',
          boxShadow: '0px 0px 6px rgba(111, 19, 29, 0.175)',
          background: 'rgba(255,255,255,0.25)',
          transition: 'opacity 0.1s',
        }}
        _focusVisible={{
          outline: 'solid #651d32',
        }}
      >
        {children}
      </BaseCard>
    </Link>
  );
}
