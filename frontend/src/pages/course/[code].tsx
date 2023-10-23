import { useMemo } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import {
  Heading,
  Stack,
  Tag,
  Text,
  VStack,
  Divider,
  Box,
  Wrap,
} from '@chakra-ui/react';
import { getCourse, CourseWithProfessors } from '~/lib/api';
import { CourseGrades } from '~/lib/grades';
import { getDictionary } from '~/lib/dictionary';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import SectionsSummary from '~/components/SectionsSummary';
import { LinkCard, SummaryCard, BigNumberCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const tCourse = useTranslations('Course');
  const tSurvey = useTranslations('Survey');

  const grades = useMemo(() => {
    return new CourseGrades(course.grades);
  }, [course.grades]);

  return (
    <Layout>
      <SearchNav>
        <Box px={'10px'}>
          <Heading mt={4}>{course.title}</Heading>
          <Stack direction={['column', 'row']} mt={1} spacing={2} wrap={'wrap'}>
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
              {true && (
                <BigNumberCard
                  info={'Recommend'}
                  tooltip={`I would recommend this class to a friend. (100 responses)`}
                  value={(2.4).toFixed(2)}
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
        </Box>
      </SearchNav>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const course = await getCourse(
    context.params?.code as string,
    context.locale
  );
  console.log(course);
  return {
    props: {
      course,
      messages: await getDictionary(context.locale),
    },
  };
}
