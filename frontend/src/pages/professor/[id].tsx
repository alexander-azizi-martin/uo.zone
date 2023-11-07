import {
  Divider,
  Heading,
  Tag,
  Text,
  Stack,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BigNumberCard, LinkCard, SummaryCard } from '~/components/Card';
import ExternalLink from '~/components/ExternalLink';
import { GradeSummary } from '~/components/Grades';
import Layout from '~/components/Layout';
import RmpRating from '~/components/RmpRating';
import SearchNav from '~/components/Search';
import SectionsSummary from '~/components/SectionsSummary';
import type { ProfessorWithCourses } from '~/lib/api';
import { getProfessor } from '~/lib/api';
import { professorSurveys } from '~/lib/config';
import { getDictionary } from '~/lib/dictionary';
import { CourseGrades } from '~/lib/grades';
import Survey from '~/lib/survey';

interface ProfessorProps {
  professor: ProfessorWithCourses;
}

export default function Professor({ professor }: ProfessorProps) {
  const t = useTranslations('Survey');

  const grades = useMemo(() => {
    return new CourseGrades(professor.grades);
  }, [professor.grades]);

  const surveys = useMemo(() => {
    return new Survey(professor.survey);
  }, [professor.survey]);

  return (
    <Layout>
      <SearchNav>
        <Heading my={4}>{professor.name}</Heading>
        {professor.rmpReview && (
          <>
            <Stack direction={'row'} mt={1} spacing={2} wrap={'wrap'}>
              <RmpRating review={professor.rmpReview} />
              <Tag colorScheme={'blue'} variant={'solid'} size={'sm'}>
                {professor.rmpReview.department}
              </Tag>
            </Stack>
            <Text my={4} fontSize={'sm'}>
              <ExternalLink
                href={professor.rmpReview.link}
                color={'gray.600'}
                fontSize={'sm'}
              >
                View on RateMyProfessor
              </ExternalLink>
            </Text>
          </>
        )}
        <VStack spacing={4} align={'start'} pb={4} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              grades={grades}
              title={professor.name}
              titleSize={'3xl'}
              info={
                <Text fontSize={'sm'} color={'gray.600'} mt={2}>
                  This total also includes classes that they may not teach
                  anymore.
                </Text>
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
