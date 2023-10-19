import type { GetServerSidePropsContext } from 'next';
import {
  Box,
  Collapse,
  Heading,
  Stack,
  Tag,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import { getCourse, CourseWithProfessors } from '~/lib/api';
import { getDictionary } from '~/lib/dictionary';
import Layout from '~/components/Layout';
import Search from '~/components/Search';
import { useTranslations } from 'next-intl';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const t = useTranslations('Course');

  const [searching, setSearching] = useBoolean(false);

  return (
    <Layout>
      <Box py={8} width={'100%'}>
        <Search
          onSearchOpen={setSearching.on}
          onSearchClose={setSearching.off}
        />

        <Collapse in={!searching} animateOpacity>
          <Heading mt={4}>{course.title}</Heading>
          <Stack direction={['column', 'row']} mt={1} spacing={2} wrap={'wrap'}>
            {course.units !== null && (
              <Tag size={'md'}>{t('units', { units: course.units })}</Tag>
            )}
          </Stack>
          <Text mt={4} mb={2} fontSize={'sm'}>
            {course.description}
          </Text>
        </Collapse>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const course = await getCourse(context.params?.code as string);

  return {
    props: {
      course,
      messages: await getDictionary(context.locale),
    },
  };
}
