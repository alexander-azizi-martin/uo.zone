import { Spinner, useBoolean } from '@chakra-ui/react';
import Link from 'next/link';
import { BaseCard, BaseCardProps } from '~/components/Card';

interface LinkCardProps extends BaseCardProps {
  href: string;
  isExternal?: boolean;
}

export default function LinkCard({
  href = '',
  isExternal,
  children,
  ...props
}: LinkCardProps) {
  const [clicked, setClicked] = useBoolean(false);

  const extraProps = isExternal ? { target: '_blank' } : {};

  const hoverStyles = {
    cursor: 'pointer',
    boxShadow: '0px 0px 4px rgba(111, 19, 29, 0.175)',
    background: 'rgba(255,255,255,0.25)',
    transition: 'opacity 0.1s',
  };

  return (
    <Link href={href} style={{ width: '100%' }} {...extraProps}>
      <BaseCard
        {...props}
        onClick={setClicked.on}
        as={'button'}
        _hover={hoverStyles}
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
