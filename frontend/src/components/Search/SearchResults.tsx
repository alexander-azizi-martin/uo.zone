import { Heading, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import { LinkCard } from '~/components/Card';
import type {
  CourseResult,
  ProfessorResult,
  SearchResults as SearchResultsType,
  SubjectResult,
} from '~/lib/api';

interface SearchResultsProps {
  results: SearchResultsType;
}

export default function SearchResults(props: SearchResultsProps) {
  return (
    <>
      <Courses courses={props.results.courses} />
      <Subjects subjects={props.results.subjects} />
      <Professors professors={props.results.professors} />
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
        <LinkCard key={course.code} href={`/course/${course.code}`}>
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
        <LinkCard key={professor.id} href={`/professor/${professor.id}`}>
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
        <LinkCard key={subject.code} href={`/subject/${subject.code}`}>
          {subject.code} - {subject.subject}
        </LinkCard>
      ))}
    </VStack>
  );
}
