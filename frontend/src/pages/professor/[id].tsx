import {
  Divider,
  Heading,
  Stack,
  Tag,
  Text,
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
import { getProfessor, type ProfessorWithCourses } from '~/lib/api';
import { professorQuestions } from '~/lib/config';
import { getDictionary } from '~/lib/dictionary';
import Survey from '~/lib/survey';

interface ProfessorProps {
  professor: ProfessorWithCourses;
}

export default function Professor({ professor }: ProfessorProps) {
  const tCourse = useTranslations('Course');
  const tSurvey = useTranslations('Survey');

  const survey = useMemo(
    () => new Survey(professor.survey),
    [professor.survey]
  );

  return (
    <Layout>
      <SearchNav>
        <Heading my={4}>{professor.name}</Heading>
        {professor.rmpReview && professor.rmpReview.numRatings > 0 && (
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
                {tCourse('rmp')}
              </ExternalLink>
            </Text>
          </>
        )}
        <VStack spacing={4} align={'start'} pb={4}>
          <Wrap spacing={'8px'} width={'100%'} overflow={'visible'}>
            {Object.entries(professorQuestions)
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
                  .averageScore(Object.keys(professorQuestions))
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

          <SummaryCard>
            <GradeSummary
              gradeInfo={professor.gradeInfo}
              title={tCourse('all-courses')}
              titleSize={'3xl'}
              info={
                <Text fontSize={'sm'} color={'gray.600'} mt={2}>
                  {tCourse('total-info')}
                </Text>
              }
            />
          </SummaryCard>

          {professor.courses.map((course) => (
            <LinkCard href={`/course/${course.code}`} key={course.code}>
              <SectionsSummary title={course.title} summarize={course} />
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
