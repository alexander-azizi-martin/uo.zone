import { useTranslations } from 'next-intl';
import { useBoolean, Box } from '@chakra-ui/react';
import { searchDurations } from '~/lib/config';
import { Flex, VStack, Collapse, Heading, Text, Image } from '@chakra-ui/react';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';

export default function Home() {
  const t = useTranslations('Home');

  const [searching, setSearching] = useBoolean();

  return (
    <Layout>
      <VStack
        alignItems={['center', 'center', 'start']}
        spacing={0}
        width={'100%'}
      >
        <Flex
          alignItems={['center', 'center', 'end']}
          justifyContent={['center', 'start', 'start']}
          flexDirection={['column-reverse', 'column-reverse', 'row']}
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
            <Box>
              <Heading
                fontSize={['50px', '55px', '90px']}
                paddingTop={[0, 10, 'calc(50vh - 185px)']}
                textAlign={['center', 'center', 'left']}
              >
                uoZone
              </Heading>
              <Text
                style={{ color: 'black' }}
                textAlign={['center', 'center', 'left']}
                py={2}
                fontWeight={300}
              >
                {t('description')}
              </Text>
            </Box>
          </Collapse>
          <Box
            pt={[10, 10, 0]}
            pb={[5, 5, 0]}
            zIndex={-1}
            opacity={[0.9, 0.9, 0.5]}
            position={'relative'}
            left={[0, 0, 0, 0, '80px']}
            top={[0, 0, '90px', '160px', '160px']}
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
                src={'images/geegee.png'}
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
