import {
  Divider,
  Heading,
  Link,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BigNumberCard, LinkCard, SummaryCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import SectionsSummary from '~/components/SectionsSummary';
import type { CourseWithProfessors } from '~/lib/api';
import { getCourse } from '~/lib/api';
import { courseSurveys } from '~/lib/config';
import { getDictionary } from '~/lib/dictionary';
import { CourseGrades } from '~/lib/grades';
import { Surveys } from '~/lib/surveys';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const tCourse = useTranslations('Course');
  const tSurvey = useTranslations('Survey');

  const grades = useMemo(() => {
    return new CourseGrades(course.grades);
  }, [course.grades]);

  const surveys = useMemo(() => {
    return new Surveys(course.surveys);
  }, [course.surveys]);

  const subject = course.title.slice(0, 3);

  return (
    <Layout>
      <SearchNav>
        <Heading mt={4}>
          <Link
            as={NextLink}
            href={`/subject/${subject}`}
            textDecor={'underline'}
            textDecorationThickness={'2px'}
          >
            {subject}
          </Link>
          {course.title.slice(3)}
        </Heading>
        <Stack direction={'row'} mt={1} spacing={2} wrap={'wrap'}>
          {course.units !== null && (
            <Tag size={'md'}>{tCourse('units', { units: course.units })}</Tag>
          )}
          <Tag colorScheme={'blue'} variant={'solid'} size={'sm'}>
            {course.subject.subject}
          </Tag>
          <Tag colorScheme={'blue'} variant={'solid'} size={'sm'}>
            {course.subject.faculty}
          </Tag>
        </Stack>
        <Text my={4} fontSize={'sm'}>
          {course.description}
        </Text>
        <VStack spacing={4} align={'start'} pb={4} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              grades={grades}
              title={tCourse('all-professors')}
              titleSize={'3xl'}
            />
          </SummaryCard>

          <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
            {Object.entries(courseSurveys)
              .filter(([question]) => surveys.has(question))
              .map(([question, name]) => (
                <WrapItem flexGrow={1} flexBasis={'20%'} key={question}>
                  <BigNumberCard
                    info={tSurvey(`${name}.info`)}
                    tooltip={tSurvey(`${name}.tooltip`, {
                      responses: surveys.totalResponses(question),
                    })}
                    value={surveys.score(question).toFixed(2)}
                    total={5}
                  />
                </WrapItem>
              ))}
          </Wrap>

          <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
            {surveys.numQuestions() > 0 && (
              <BigNumberCard
                info={tSurvey('overall')}
                value={surveys
                  .averageScore(Object.keys(courseSurveys))
                  .toFixed(2)}
                total={5}
              />
            )}
          </Wrap>

          <Divider
            orientation={'horizontal'}
            style={{
              borderColor: '#49080F',
              borderBottomWidth: 1,
              opacity: 0.15,
            }}
          />

          {course.professors.map((professor) => (
            <LinkCard href={`/professor/${professor.id}`} key={professor.id}>
              <SectionsSummary
                title={professor.name}
                sectionGrades={professor.sections.map(
                  ({ grades, term, section }) =>
                    new CourseGrades(grades, term, section)
                )}
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
