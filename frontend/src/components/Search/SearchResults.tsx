import { Heading, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { type RefObject } from 'react';

import { LinkCard } from '~/components';
import { useSearchNavigation } from '~/hooks';
import {
  type CourseResult,
  type ProfessorResult,
  type SearchResults as SearchResultsType,
  type SubjectResult,
} from '~/lib/api';

interface SearchResultsProps {
  results: SearchResultsType;
  searchBar?: RefObject<HTMLInputElement>;
}

export function SearchResults({ results, searchBar }: SearchResultsProps) {
  useSearchNavigation(searchBar?.current);

  return (
    <>
      <Subjects subjects={results.subjects} />
      <Courses courses={results.courses} />
      <Professors professors={results.professors} />
    </>
  );
}

interface CoursesProps {
  courses: CourseResult[];
}

function Courses({ courses }: CoursesProps) {
  const tSearch = useTranslations('Search');

  if (courses.length === 0) return null;

  return (
    <VStack spacing={2} width={'100%'} align={'start'}>
      <Heading size={'md'} pt={4}>
        {tSearch('courses')}
      </Heading>
      {courses.map((course) => (
        <LinkCard
          key={course.code}
          href={`/course/${course.code}`}
          className={'search-result'}
        >
          {course.title}
        </LinkCard>
      ))}
    </VStack>
  );
}

interface ProfessorsProps {
  professors: ProfessorResult[];
}

function Professors({ professors }: ProfessorsProps) {
  const tSearch = useTranslations('Search');

  if (professors.length === 0) return null;

  return (
    <VStack spacing={2} width={'100%'} align={'start'}>
      <Heading size={'md'} pt={4}>
        {tSearch('professors')}
      </Heading>
      {professors.map((professor) => (
        <LinkCard
          key={professor.id}
          href={`/professor/${professor.id}`}
          className={'search-result'}
        >
          {professor.name}
        </LinkCard>
      ))}
    </VStack>
  );
}

interface SubjectsProps {
  subjects: SubjectResult[];
}

function Subjects({ subjects }: SubjectsProps) {
  const tSearch = useTranslations('Search');

  if (subjects.length === 0) return null;

  return (
    <VStack spacing={2} width={'100%'} align={'start'}>
      <Heading size={'md'} pt={4}>
        {tSearch('subjects')}
      </Heading>
      {subjects.map((subject) => (
        <LinkCard
          key={subject.code}
          href={`/subject/${subject.code}`}
          className={'search-result'}
        >
          {subject.code} - {subject.subject}
        </LinkCard>
      ))}
    </VStack>
  );
}
