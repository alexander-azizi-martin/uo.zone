import {
  Divider,
  Heading,
  HStack,
  Link,
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
import { courseQuestions } from '~/lib/config';
import { getDictionary } from '~/lib/dictionary';
import CourseGrades from '~/lib/grades';
import Survey from '~/lib/survey';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const tCourse = useTranslations('Course');
  const tSurvey = useTranslations('Survey');

  const grades = useMemo(() => {
    return new CourseGrades(course.grades);
  }, [course.grades]);

  const survey = useMemo(() => {
    return new Survey(course.survey);
  }, [course.survey]);

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
        <VStack my={6} spacing={4} align={'start'}>
          <Text fontSize={'md'}>{course.description}</Text>

          {course.components.length > 0 && (
            <HStack>
              <Text fontWeight={'bold'} fontSize={'sm'}>
                Components:
              </Text>

              {course.components.map((component) => (
                <Tag size={'sm'} key={component}>
                  {component}
                </Tag>
              ))}
            </HStack>
          )}
          {course.requirements && (
            <HStack>
              <Text fontWeight={'bold'} fontSize={'sm'} mb={'auto'}>
                <Link
                  as={NextLink}
                  href={`/course/${course.code}/graph`}
                  textDecor={'underline'}
                  textDecorationThickness={'1px'}
                  _hover={{ textDecorationThickness: '2px' }}
                >
                  Requirements:
                </Link>
              </Text>
              <Text fontSize={'sm'}>{course.requirements}</Text>
            </HStack>
          )}
        </VStack>
        <VStack spacing={4} align={'start'} pb={4}>
          {course.survey.length > 0 && (
            <>
              <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
                {Object.entries(courseQuestions)
                  .filter(([question]) => survey.has(question))
                  .map(([question, name]) => (
                    <WrapItem flexGrow={1} flexBasis={'30%'} key={question}>
                      <BigNumberCard
                        info={tSurvey(`${name}.info`)}
                        tooltip={tSurvey(`${name}.tooltip`, {
                          responses: survey.totalResponses(question),
                        })}
                        value={survey.score(question).toFixed(2)}
                        total={5}
                      />
                    </WrapItem>
                  ))}
              </Wrap>
              <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
                {survey.numQuestions() > 0 && (
                  <BigNumberCard
                    info={tSurvey('overall')}
                    value={survey
                      .averageScore(Object.keys(courseQuestions))
                      .toFixed(2)}
                    total={5}
                  />
                )}
              </Wrap>
            </>
          )}

          {course.professors.length > 0 && (
            <>
              <Divider
                orientation={'horizontal'}
                style={{
                  borderColor: '#49080F',
                  borderBottomWidth: 1,
                  opacity: 0.15,
                }}
                my={2}
              />

              <SummaryCard>
                <GradeSummary
                  grades={grades}
                  title={tCourse('all-professors')}
                  titleSize={'3xl'}
                />
              </SummaryCard>

              {course.professors.map((professor) => (
                <LinkCard
                  href={`/professor/${professor.id}`}
                  key={professor.id}
                >
                  <SectionsSummary
                    title={professor.name}
                    summarize={professor}
                  />
                </LinkCard>
              ))}
            </>
          )}
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
