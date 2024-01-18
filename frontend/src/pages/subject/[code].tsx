import { Heading,VStack } from '@chakra-ui/react';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';

import { LinkCard, SummaryCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import { getSubject, type SubjectWithCourses } from '~/lib/api';
import { getDictionary } from '~/lib/dictionary';

interface SubjectProps {
  subject: SubjectWithCourses;
}

export default function Subject({ subject }: SubjectProps) {
  const tCourse = useTranslations('Course');
  const tGrades = useTranslations('Grades');

  return (
    <Layout>
      <SearchNav>
        <Heading my={4}>{`${subject.code}: ${subject.subject}`}</Heading>
        <VStack spacing={4} align={'start'} pb={4} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              gradeInfo={subject.gradeInfo}
              title={tCourse('all-courses-for', { code: subject.code })}
              titleSize={'3xl'}
            />
          </SummaryCard>

          {subject.courses.map((course) => (
            <LinkCard href={`/course/${course.code}`} key={course.code}>
              <GradeSummary
                title={course.title}
                subtitle={
                  !course?.gradeInfo?.total
                    ? tGrades('no-data')
                    : undefined
                }
                gradeInfo={course.gradeInfo}
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

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
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

      context.log.error('Internal Server Error', error);

      throw new Error('Internal Server Error');
    }
  }
);
