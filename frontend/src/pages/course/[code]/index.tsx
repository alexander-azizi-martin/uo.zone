import { InfoOutlineIcon } from '@chakra-ui/icons';
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
import Markdown from 'react-markdown';

import { BigNumberCard, SummaryCard } from '~/components/Card';
import CourseLink from '~/components/CourseLink';
import { GradeSummary } from '~/components/Grades';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import SectionsSummary from '~/components/SectionsSummary';
import Tooltip from '~/components/Tooltip';
import { type CourseWithProfessors, getCourse } from '~/lib/api';
import { courseQuestions } from '~/lib/config';
import { getDictionary } from '~/lib/dictionary';
import Survey from '~/lib/survey';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const tCourse = useTranslations('Course');
  const tSurvey = useTranslations('Survey');

  const survey = useMemo(() => new Survey(course.survey), [course.survey]);

  const subject = course.title.slice(0, 3);

  return (
    <Layout>
      <SearchNav>
        <Heading mt={4} position={'relative'}>
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
          <Text fontSize={'md'} as="div">
            <Markdown components={{ a: CourseLink }}>
              {course.description}
            </Markdown>
          </Text>

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
                Requirements:
              </Text>
              <Text fontSize={'sm'} as={'div'}>
                <Markdown components={{ a: CourseLink }}>
                  {course.requirements}
                </Markdown>
              </Text>
            </HStack>
          )}
        </VStack>
        <VStack spacing={4} align={'start'} pb={4}>
          {course.survey.length > 0 && (
            <>
              <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
                {Object.entries(courseQuestions)
                  .filter(([question]) => survey.has(question))
                  .map(([question, name], _, questions) => (
                    <WrapItem
                      flexGrow={1}
                      flexBasis={questions.length < 5 ? '45%' : '30%'}
                      key={question}
                    >
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

              {course.gradeInfo && (
                <SummaryCard>
                  <GradeSummary
                    gradeInfo={course.gradeInfo}
                    title={tCourse('all-professors')}
                    titleSize={'3xl'}
                  />
                </SummaryCard>
              )}

              {course.professors.map((professor) => (
                <SectionsSummary
                  key={professor.id}
                  title={
                    professor.id !== 0 ? (
                      professor.name
                    ) : (
                      <HStack alignItems={'center'}>
                        <span>
                          {tCourse('unknown-professor', {
                            count: professor.sections.length,
                          })}
                        </span>

                        <Tooltip
                          label={tCourse('unknown-professor-info', {
                            count: professor.sections.length,
                          })}
                          fontSize={'sm'}
                          textAlign={'center'}
                          hasArrow
                        >
                          <InfoOutlineIcon fontSize={'sm'} />
                        </Tooltip>
                      </HStack>
                    )
                  }
                  href={
                    professor.id !== 0
                      ? `/professor/${professor.id}`
                      : undefined
                  }
                  summarize={professor}
                />
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
