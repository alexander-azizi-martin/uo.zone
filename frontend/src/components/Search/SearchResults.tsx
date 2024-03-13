import { Heading, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { type RefObject, useEffect, useRef } from 'react';

import { LinkCard } from '~/components';
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

export function SearchResults(props: SearchResultsProps) {
  const selectedResult = useRef<number>();
  const lastSelectionPos = useRef<number>();

  useEffect(() => {
    const resultNodes =
      document.querySelectorAll<HTMLElement>('.search-result');

    selectedResult.current = undefined;
    const handleKeyPress = (event: KeyboardEvent) => {
      let resultMoved = false;

      if (resultNodes.length > 0) {
        if (event.key === 'ArrowDown') {
          if (selectedResult.current === undefined) {
            selectedResult.current = 0;
          } else if (selectedResult.current + 1 < resultNodes.length) {
            selectedResult.current++;
          }

          if (props?.searchBar?.current) {
            lastSelectionPos.current =
              props.searchBar.current.selectionStart ?? undefined;
          }

          resultMoved = true;
        } else if (
          event.key === 'ArrowUp' &&
          selectedResult.current !== undefined
        ) {
          if (selectedResult.current - 1 >= 0) {
            selectedResult.current--;
            resultMoved = true;
          } else {
            selectedResult.current = undefined;
            props.searchBar?.current?.focus();

            requestAnimationFrame(() => {
              if (props?.searchBar?.current && lastSelectionPos.current) {
                props.searchBar.current.setSelectionRange(
                  lastSelectionPos.current,
                  lastSelectionPos.current
                );
              }
            });
          }
        }
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

      if (
        event.key !== 'ArrowDown' &&
        event.key !== 'ArrowUp' &&
        event.key !== 'Enter'
      ) {
        props.searchBar?.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [props.results, props.searchBar]);

  return (
    <>
      <Subjects subjects={props.results.subjects} />
      <Courses courses={props.results.courses} />
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
