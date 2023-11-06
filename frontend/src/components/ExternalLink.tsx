import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link, LinkProps } from '@chakra-ui/react';

export default function ExternalLink({ href, children, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      fontWeight={500}
      color={'gray.700'}
      isExternal={true}
      display={'inline-flex'}
      alignItems={'center'}
      {...props}
    >
      {children}
      <ExternalLinkIcon mx={'2px'} />
    </Link>
  );
}
