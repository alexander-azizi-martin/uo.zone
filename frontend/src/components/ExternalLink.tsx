import { Link as ChakraLink, Box } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <ChakraLink
      href={href}
      fontWeight={500}
      color={'gray.700'}
      isExternal={true}
      display={'inline-flex'}
      alignItems={'center'}
    >
      {children}
      <ExternalLinkIcon mx={'2px'} />
    </ChakraLink>
  );
}
