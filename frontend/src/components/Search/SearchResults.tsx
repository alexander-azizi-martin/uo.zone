import { useTranslations } from 'next-intl';
import type {
  SearchResults as SearchResultsType,
  CourseResult,
  ProfessorResult,
  SubjectResult,
} from '~/lib/api';
import { VStack, Heading } from '@chakra-ui/react';
import { LinkCard } from '~/components/Card';

interface SearchResultsProps {
  results: SearchResultsType;
}

export default function SearchResults(props: SearchResultsProps) {
  return (
    <>
      <Courses courses={props.results.courses} />
      <Professors professors={props.results.professors} />
      <Subjects subjects={props.results.subjects} />
    </>
  );
}

interface CoursesProps {
  courses: CourseResult[];
}

function Courses({ courses }: CoursesProps) {
  const t = useTranslations('Search');

  if (courses.length === 0) {
    return null;
  }

  return (
    <VStack spacing={2} width={'100%'} align={'start'}>
      <Heading size={'md'} pt={4}>
        {t('courses')}
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
  const t = useTranslations('Search');

  if (professors.length === 0) {
    return null;
  }

  return (
    <VStack spacing={2} width={'100%'} align={'start'}>
      <Heading size={'md'} pt={4}>
        {t('professors')}
      </Heading>
      {professors.map((professor) => (
        <LinkCard key={professor.id} href={`/professor/${professor.name}`}>
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
  const t = useTranslations('Search');

  if (subjects.length === 0) {
    return null;
  }

  return (
    <VStack spacing={2} width={'100%'} align={'start'}>
      <Heading size={'md'} pt={4}>
        {t('subjects')}
      </Heading>
      {subjects.map((subject) => (
        <LinkCard key={subject.code} href={`/subject/${subject.code}`}>
          {subject.code} - {subject.subject}
        </LinkCard>
      ))}
    </VStack>
  );
}
