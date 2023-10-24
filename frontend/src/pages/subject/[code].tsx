import { useMemo } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Heading, VStack, Divider } from '@chakra-ui/react';
import { getSubject, Subject, SubjectWithCourses } from '~/lib/api';
import { CourseGrades } from '~/lib/grades';
import { getDictionary } from '~/lib/dictionary';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import { LinkCard, SummaryCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';

interface SubjectProps {
  subject: SubjectWithCourses;
}

export default function Subject({ subject }: SubjectProps) {
  const t = useTranslations('Course');

  const grades = useMemo(() => {
    return new CourseGrades(subject.grades);
  }, [subject.grades]);

  return (
    <Layout>
      <SearchNav>
        <Heading my={4}>{`${subject.code}: ${subject.subject}`}</Heading>
        <VStack spacing={4} align={'start'} pb={4} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              grades={grades}
              title={t('all-courses', { code: subject.code })}
              titleSize={'3xl'}
            />
          </SummaryCard>

          <Divider
            orientation={'horizontal'}
            style={{
              borderColor: '#49080F',
              borderBottomWidth: 1,
              opacity: 0.15,
            }}
          />

          {subject.courses.map((course) => (
            <LinkCard href={`/course/${course.code}`} key={course.code}>
              <GradeSummary
                title={course.title}
                grades={new CourseGrades(course.grades)}
                distributionWidth={300}
                distributionHeight={40}
              />
            </LinkCard>
          ))}
        </VStack>
      </SearchNav>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const subject = await getSubject(
      context.params?.code as string,
      context.locale
    );

    return {
      props: {
        subject,
        messages: await getDictionary(context.locale),
      },
    };
  } catch (error: any) {
    if (error.status == 404) {
      return {
        notFound: true,
      };
    }

    throw new Error('Internal Server Error');
  }
}
