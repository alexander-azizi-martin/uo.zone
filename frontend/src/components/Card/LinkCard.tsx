import { Spinner, useBoolean } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  const [clicked, setClicked] = useBoolean(false);
  const { asPath } = useRouter();

  const handleClicked = () => {
    const normalizedPath = asPath.substring(
      0,
      (asPath.indexOf('?') + asPath.length + 1) % (asPath.length + 1)
    );
    const normalizedHref = href.substring(
      0,
      (href.indexOf('?') + href.length + 1) % (href.length + 1)
    );

    if (normalizedPath !== normalizedHref) {
      setClicked.on();
    }
  };

  return (
    <Link
      href={href}
      style={{ display: 'block', width: '100%', height: '100%' }}
      target={isExternal ? '_blank' : undefined}
    >
      <BaseCard
        {...props}
        onClick={handleClicked}
        as={'button'}
        _hover={{
          cursor: 'pointer',
          boxShadow: '0px 0px 4px rgba(111, 19, 29, 0.175)',
          background: 'rgba(255,255,255,0.25)',
          transition: 'opacity 0.1s',
        }}
        _focusVisible={{
          outline: 'solid #651d32',
        }}
      >
        {children}
        {clicked && !isExternal && (
          <Spinner
            size={'sm'}
            ml={2}
            position={'absolute'}
            left={-1.5}
            top={4}
          />
        )}
      </BaseCard>
    </Link>
  );
}
