import { useContext, useMemo } from 'react';

import { type components } from '@/lib/api/schema';
import { Grade } from '@/lib/grade';
import { percent, TERM_TO_ID } from '@/lib/utils';

import { CourseFilterContext } from '../_components/course-filter-provider';

function useFilteredCourses(
  courses: components['schemas']['CourseResource'][],
) {
  const courseFilterContext = useContext(CourseFilterContext);
  if (courseFilterContext === null) {
    throw new Error(
      `\`useFilteredCourses\` must be used within \`CourseFilterProvider\``,
    );
  }

  const { filterOptions } = courseFilterContext;

  const filteredCourses = useMemo(
    () =>
      courses
        .filter((course) => {
          const includesLanguage =
            filterOptions.languages.length === 0 ||
            filterOptions.languages.some((language) => {
              return course.languages.includes(language);
            });

          const courseYear = Math.min(5, parseInt(course.code[3])).toString();
          const includesYear =
            filterOptions.years.length === 0 ||
            filterOptions.years.some((year) => {
              return courseYear === year;
            });

          const includesTerm =
            filterOptions.term.length === 0 ||
            filterOptions.term.some((term) => {
              return course.previousTermIds.some(
                (termId) => termId % 10 === TERM_TO_ID[term],
              );
            });

          return includesLanguage && includesYear && includesTerm;
        })
        .sort((a, b) => {
          switch (filterOptions.sortBy) {
            case 'code':
              return Number(a.code > b.code);
            case 'average':
              return compareAverage(a, b);
            case 'mode':
              return compareMode(a, b);
            case 'median':
              return compareMedian(a, b);
            default:
              return 0;
          }
        }),
    [
      courses,
      filterOptions.sortBy,
      filterOptions.languages,
      filterOptions.years,
      filterOptions.term,
    ],
  );

  return filteredCourses;
}

function compareAverage(
  a: components['schemas']['CourseResource'],
  b: components['schemas']['CourseResource'],
) {
  if (!a.grades?.mean && !b.grades?.mean) return Number(a.code > b.code);
  if (!a.grades?.mean) return 1;
  if (!b.grades?.mean) return -1;

  const aAverage = a.grades.mean;
  const bAverage = b.grades.mean;

  if (aAverage < bAverage) {
    return 1;
  } else if (aAverage > bAverage) {
    return -1;
  }

  return 0;
}

function compareMode(
  a: components['schemas']['CourseResource'],
  b: components['schemas']['CourseResource'],
) {
  if (!a.grades?.mode && !b.grades?.mode) return Number(a.code > b.code);
  if (!a.grades?.mode) return 1;
  if (!b.grades?.mode) return -1;

  const aMode = Grade.value(a.grades.mode);
  const aModePercent = percent(
    a.grades.distribution[a.grades.mode],
    a.grades.total,
  );
  const bMode = Grade.value(b.grades.mode);
  const bModePercent = percent(
    b.grades.distribution[b.grades.mode],
    b.grades.total,
  );

  if (aMode < bMode) return 1;
  else if (aMode > bMode) return -1;
  else if (aModePercent < bModePercent) return 1;
  else if (aModePercent > bModePercent) return -1;
  else return 0;
}

function compareMedian(
  a: components['schemas']['CourseResource'],
  b: components['schemas']['CourseResource'],
) {
  if (!a.grades?.median && !b.grades?.median) return Number(a.code > b.code);
  if (!a.grades?.median) return 1;
  if (!b.grades?.median) return -1;

  const aMedian = Grade.value(a.grades.median);
  const aMedianPercent = percent(
    a.grades.distribution[a.grades.median],
    a.grades.total,
  );
  const bMedian = Grade.value(b.grades.median);
  const bMedianPercent = percent(
    b.grades.distribution[b.grades.median],
    b.grades.total,
  );

  if (aMedian < bMedian) return 1;
  else if (bMedian > aMedian) return -1;
  else if (aMedianPercent < bMedianPercent) return 1;
  else if (aMedianPercent > bMedianPercent) return -1;
  else return 0;
}

export { useFilteredCourses };
