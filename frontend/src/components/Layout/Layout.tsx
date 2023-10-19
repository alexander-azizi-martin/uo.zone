import { Box, Flex } from '@chakra-ui/react';
import { Footer } from '~/components/Layout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Flex direction={'row'} justifyContent={'center'}>
        <Box px={[2, 5, 10]} maxW={'1300px'} width={'100%'}>
          <Flex direction={'column'} justifyContent={'space-between'} height={'100vh'}>
            {children}
            <Footer />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
