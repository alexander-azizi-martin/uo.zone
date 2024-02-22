import {
  Button,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  VStack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { SlidersIcon } from '@primer/octicons-react';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';

import { LinkCard, SummaryCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';
import Layout from '~/components/Layout';
import SearchNav from '~/components/Search';
import {
  type CourseFilterOptions,
  useFilteredCourses,
  useSessionStorage,
} from '~/hooks';
import { getSubject, type SubjectWithCourses } from '~/lib/api';
import { getDictionary } from '~/lib/dictionary';

interface SubjectProps {
  subject: SubjectWithCourses;
}

export default function Subject({ subject }: SubjectProps) {
  const tCourse = useTranslations('Course');
  const tFilter = useTranslations('Filter');
  const tGrades = useTranslations('Grades');
  const tGeneral = useTranslations('General');

  const [filterOptions, setFilterOptions] =
    useSessionStorage<CourseFilterOptions>(subject.code, {
      sortBy: 'code',
      years: [],
      languages: [],
    });

  const handleFilterChange =
    (key: keyof CourseFilterOptions) => (value: any) => {
      setFilterOptions({
        ...filterOptions,
        [key]: value,
      });
    };

  const courseList = useMemo(
    () =>
      subject.courses.map((course) => (
        <LinkCard href={`/course/${course.code}`} key={course.code}>
          <GradeSummary
            title={course.title}
            subtitle={
              !course?.gradeInfo?.total ? tGrades('no-data') : undefined
            }
            gradeInfo={course.gradeInfo}
            distributionSize={'sm'}
          />
        </LinkCard>
      )),
    [subject.courses]
  );

  const filteredCourses = useFilteredCourses(subject.courses, filterOptions);

  return (
    <Layout>
      <SearchNav>
        <Flex justify={'space-between'} align={'center'}>
          <Heading my={4}>{`${subject.code}: ${subject.subject}`}</Heading>

          <Menu closeOnSelect={false} flip={false} placement={'bottom-end'}>
            <MenuButton
              as={Button}
              iconSpacing={1}
              rightIcon={<Icon as={SlidersIcon} />}
              size={'sm'}
              variant={'outline'}
            >
              {tGeneral('filter')}
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                value={filterOptions.sortBy}
                onChange={handleFilterChange('sortBy')}
                title={tFilter('sort-by')}
                type="radio"
              >
                <MenuItemOption value="code">{tGeneral('code')}</MenuItemOption>
                <MenuItemOption value="average">
                  {tGeneral('average')}
                </MenuItemOption>
                {/* <MenuItemOption value="median">Median</MenuItemOption> */}
                <MenuItemOption value="mode">{tGeneral('mode')}</MenuItemOption>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup
                value={filterOptions.years}
                onChange={handleFilterChange('years')}
                title={tFilter('filter-year')}
                type="checkbox"
              >
                <MenuItemOption value="1">{tFilter('1st-year')}</MenuItemOption>
                <MenuItemOption value="2">{tFilter('2nd-year')}</MenuItemOption>
                <MenuItemOption value="3">{tFilter('3rd-year')}</MenuItemOption>
                <MenuItemOption value="4">{tFilter('4th-year')}</MenuItemOption>
                <MenuItemOption value="5">{tFilter('graduate')}</MenuItemOption>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup
                value={filterOptions.languages}
                onChange={handleFilterChange('languages')}
                title={tFilter('filter-language')}
                type="checkbox"
              >
                <MenuItemOption value="en">
                  {tGeneral('english')}
                </MenuItemOption>
                <MenuItemOption value="fr">{tGeneral('french')}</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
        <VStack spacing={4} align={'start'} pb={4} minH={'50vh'}>
          <SummaryCard>
            <GradeSummary
              gradeInfo={subject.gradeInfo}
              title={tCourse('all-courses-for', { code: subject.code })}
              titleSize={'3xl'}
            />
          </SummaryCard>

          {filteredCourses.length === 0 && (
            <Heading my={2} as={'h3'} size={'md'}>
              {tCourse('no-filter-match')}
            </Heading>
          )}

          {filteredCourses.map((i) => courseList[i])}
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
