import { Heading, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { LinkCard } from '~/components/Card';
import {
  type CourseResult,
  type ProfessorResult,
  type SearchResults as SearchResultsType,
  type SubjectResult,
} from '~/lib/api';

interface SearchResultsProps {
  results: SearchResultsType;
}

export default function SearchResults(props: SearchResultsProps) {
  const selectedResult = useRef<number>();

  useEffect(() => {
    const resultNodes =
      document.querySelectorAll<HTMLElement>('.search-result');

    selectedResult.current = undefined;
    const handleKeyPress = (event: KeyboardEvent) => {
      let resultMoved = false;

      if (event.key === 'ArrowDown') {
        if (selectedResult.current === undefined) {
          selectedResult.current = 0;
        } else if (selectedResult.current + 1 < resultNodes.length) {
          selectedResult.current++;
        }

        resultMoved = true;
      } else if (
        event.key === 'ArrowUp' &&
        selectedResult.current !== undefined &&
        selectedResult.current - 1 >= 0
      ) {
        selectedResult.current--;
        resultMoved = true;
      }

      if (resultMoved) {
        event.preventDefault();

        const resultNode = resultNodes[selectedResult.current as number];
        const resultNodeRect = resultNode.getBoundingClientRect();
        resultNode.focus();

        window.scrollTo({
          top:
            resultNodeRect.top +
            resultNodeRect.height / 2 +
            window.scrollY -
            window.innerHeight / 2,
        });
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [props.results]);

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
      {courses.map((course, i) => (
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
