import { useMemo } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { Heading, VStack, Divider, Wrap, WrapItem } from '@chakra-ui/react';
import { getProfessor, ProfessorWithCourses } from '~/lib/api';
import { CourseGrades } from '~/lib/grades';
import { Surveys } from '~/lib/surveys';
import { getDictionary } from '~/lib/dictionary';
import { professorSurveys } from '~/lib/config';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import SectionsSummary from '~/components/SectionsSummary';
import { LinkCard, SummaryCard, BigNumberCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
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

    throw new Error('Internal Server Error');
  }
}
