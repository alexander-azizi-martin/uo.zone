import { useMemo } from 'react';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';
import {
  Heading,
  VStack,
  HStack,
  Divider,
  Text,
  Box,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { getProfessor, ProfessorWithCourses } from '~/lib/api';
import { CourseGrades } from '~/lib/grades';
import { Surveys } from '~/lib/surveys';
import { getDictionary } from '~/lib/dictionary';
import { professorSurveys } from '~/lib/config';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import SectionsSummary from '~/components/SectionsSummary';
import ExternalLink from '~/components/ExternalLink';
import { LinkCard, SummaryCard, BigNumberCard } from '~/components/Card';
import { GradeSummary, RmpRating } from '~/components/Grades';

interface ProfessorProps {
  professor: ProfessorWithCourses;
}

export default function Professor({ professor }: ProfessorProps) {
  const t = useTranslations('Survey');

  const grades = useMemo(() => {
    return new CourseGrades(professor.grades);
  }, [professor.grades]);

  const surveys = useMemo(() => {
    return new Surveys(professor.surveys);
  }, [professor.surveys]);

  return (
    <Layout>
      <SearchNav>
        <Heading my={4}>{professor.name}</Heading>
        <VStack spacing={4} align={'start'} pb={4} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              grades={grades}
              title={professor.name}
              titleSize={'3xl'}
              rmpReview={professor.rmp_review}
              info={
                <>
                  <Text fontSize={'sm'} color={'gray.600'} mt={2}>
                    This total also includes classes that they may not teach
                    anymore.
                  </Text>

                  {professor.rmp_review && (
                    <VStack spacing={2} alignItems={'start'} mt={3}>
                      <RmpRating review={professor.rmp_review} />
                      <ExternalLink
                        href={professor.rmp_review.link}
                        color={'gray.600'}
                        fontSize={'sm'}
                      >
                        View on RateMyProfessor
                      </ExternalLink>
                    </VStack>
                  )}
                </>
              }
            />
          </SummaryCard>

          <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
            {Object.entries(professorSurveys)
              .filter(([question]) => surveys.has(question))
              .map(([question, name]) => (
                <WrapItem flexGrow={1} flexBasis={'18%'} key={question}>
                  <BigNumberCard
                    info={t(`${name}.info`)}
                    tooltip={t(`${name}.tooltip`, {
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
                info={t('overall')}
                value={surveys
                  .averageScore(Object.keys(professorSurveys))
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

          {professor.courses.map((course) => (
            <LinkCard href={`/course/${course.code}`} key={course.code}>
              <SectionsSummary
                title={course.title}
                sectionGrades={course.sections.map(
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
      const professor = await getProfessor(
        context.params?.id as string,
        context.locale
      );

      return {
        props: {
          professor,
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
