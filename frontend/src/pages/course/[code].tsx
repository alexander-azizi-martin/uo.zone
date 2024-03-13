import { Heading, HStack, Link, Tag } from '@chakra-ui/react';
import NextLink from 'next/link';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';

import { Layout, SearchNav } from '~/components';
import { type CourseWithProfessors, getCourse } from '~/lib/api';
import { getDictionary } from '~/lib/dictionary';
import { CourseInfo, CourseTabs } from '~/modules/course/components';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const tCourse = useTranslations('Course');

  const subjectCode = course.title.slice(0, 3);

  return (
    <Layout>
      <SearchNav>
        <Heading mt={4} position={'relative'}>
          <Link
            as={NextLink}
            href={`/subject/${subjectCode}`}
            textDecor={'underline'}
            textDecorationThickness={'2px'}
          >
            {subjectCode}
          </Link>

          {course.title.slice(3)}
        </Heading>

        <HStack mt={1} spacing={2} wrap={'wrap'}>
          {course.units !== null && (
            <Tag size={'md'}>{tCourse('units', { units: course.units })}</Tag>
          )}

          <Tag colorScheme={'blue'} variant={'solid'} size={'sm'}>
            {course.subject.subject}
          </Tag>
          <Tag colorScheme={'blue'} variant={'solid'} size={'sm'}>
            {course.subject.faculty}
          </Tag>
        </HStack>

        <CourseInfo course={course} />

        <CourseTabs course={course} />
      </SearchNav>
    </Layout>
  );
}

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
    try {
      const course = await getCourse(
        context.params?.code as string,
        context.locale
      );

      return {
        props: {
          course,
          messages: await getDictionary(context.locale),
        },
      };
    } catch (error: any) {
      if (error.status == 404) {
        return {
          notFound: true,
        };
      }

      context.log.error('Internal Server Error', error);

      throw new Error('Internal Server Error');
    }
  }
);
