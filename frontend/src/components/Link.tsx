import { Link as ChakraLink, Box } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface LinkProps {
  href: string;
  isExternal: boolean;
  children: React.ReactNode;
}

export default function Link({ href, isExternal, children }: LinkProps) {
  return (
    <ChakraLink
      href={href}
      fontWeight={500}
      color={'gray.700'}
      isExternal={isExternal}
      display={'inline-flex'}
      alignItems={'center'}
    >
      {children}
      <ExternalLinkIcon mx={'2px'} />
    </ChakraLink>
  );
}
