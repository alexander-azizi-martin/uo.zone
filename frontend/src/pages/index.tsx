import { Box, useBoolean } from '@chakra-ui/react';
import { Collapse, Flex, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import { Layout, SearchNav } from '~/components';
import { searchDurations } from '~/lib/config';

export default function Home() {
  const tHome = useTranslations('Home');

  const [searching, setSearching] = useBoolean();

  return (
    <Layout>
      <VStack
        alignItems={['center', 'center', 'start']}
        spacing={0}
        width={'100%'}
        pb={'100px'}
      >
        <Flex
          alignItems={['center', 'center', 'end']}
          justifyContent={['center', 'space-between', 'space-between']}
          flexDirection={['column-reverse', 'column-reverse', 'row']}
          width={'100%'}
        >
          <Collapse
            unmountOnExit={false}
            in={!searching}
            startingHeight={0.01}
            animateOpacity
            transition={{
              exit: { duration: searchDurations.exit },
              enter: { duration: searchDurations.enter },
            }}
            style={{ minWidth: '410px' }}
          >
            <Heading
              fontSize={['50px', '55px', '90px']}
              paddingTop={[0, 10, 'calc(50vh - 185px)']}
              textAlign={['center', 'center', 'left']}
              minW={'max-content'}
            >
              UO Grades
            </Heading>
            <Text
              style={{ color: 'black' }}
              textAlign={['center', 'center', 'left']}
              fontWeight={300}
              py={2}
            >
              {tHome('description')}
            </Text>
          </Collapse>
          <Box
            opacity={[1, 1, 0.5]}
            position={'relative'}
            top={[0, 0, '90px', '160px', '160px']}
            pl={8}
          >
            <Collapse
              unmountOnExit={false}
              in={!searching}
              startingHeight={0.01}
              animateOpacity
              transition={{
                exit: { duration: searchDurations.exit },
                enter: { duration: searchDurations.enter },
              }}
            >
              <Image
                pt={[10, 10, 0]}
                pb={[5, 5, 0]}
                src={'geegee.svg'}
                alt={'Geegee'}
                width={['400px', '400px', '500px']}
              />
            </Collapse>
          </Box>
        </Flex>

        <SearchNav
          onSearchOpen={setSearching.on}
          onSearchClose={setSearching.off}
          searchBarProps={{ w: ['100%', '100%', '60%'] }}
        />
      </VStack>
    </Layout>
  );
}

export { getStaticProps } from '~/lib/dictionary';
