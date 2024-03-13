import { useMemo } from 'react';

import { type Course } from '~/lib/api';
import { arrayGt, arrayLt } from '~/lib/helpers';
import LetterGrade from '~/lib/letterGrade';

export interface CourseFilterOptions {
  sortBy: string;
  years: string[];
  languages: string[];
}

export function useFilteredCourses(
  courses: Course[],
  filterOptions: CourseFilterOptions
) {
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

          return includesLanguage && includesYear;
        })
        .sort((a, b) => {
          switch (filterOptions.sortBy) {
            case 'code':
              return Number(a.code > b.code);
            case 'average':
              if (!a?.gradeInfo?.mean && !b?.gradeInfo?.mean)
                return Number(a.code > b.code);
              if (!a?.gradeInfo?.mean) return 1;
              if (!b?.gradeInfo?.mean) return -1;

              const aAverage = a.gradeInfo.mean;
              const bAverage = b.gradeInfo.mean;

              if (aAverage < bAverage) {
                return 1;
              } else if (aAverage > bAverage) {
                return -1;
              }

              return 0;
            case 'median':
              if (!a.gradeInfo && !b.gradeInfo) return Number(a.code > b.code);
              if (!a.gradeInfo) return 1;
              if (!b.gradeInfo) return -1;

              const aMedian = new LetterGrade(a.gradeInfo.median);
              const aMedianPercent =
                a.gradeInfo.grades[aMedian.letter()] / a.gradeInfo.total;
              const bMedian = new LetterGrade(b.gradeInfo.median);
              const bMedianPercent =
                b.gradeInfo.grades[bMedian.letter()] / b.gradeInfo.total;

              if (
                arrayLt(
                  [aMedian.value() || 0, aMedianPercent],
                  [bMedian.value() || 0, bMedianPercent]
                )
              ) {
                return 1;
              } else if (
                arrayGt(
                  [aMedian.value() || 0, aMedianPercent],
                  [bMedian.value() || 0, bMedianPercent]
                )
              ) {
                return -1;
              }

              return 0;
            case 'mode':
              if (!a.gradeInfo && !b.gradeInfo) return Number(a.code > b.code);
              if (!a.gradeInfo) return 1;
              if (!b.gradeInfo) return -1;

              const aMode = new LetterGrade(a.gradeInfo.mode);
              const aModePercent =
                a.gradeInfo.grades[aMode.letter()] / a.gradeInfo.total;
              const bMode = new LetterGrade(b.gradeInfo.mode);
              const bModePercent =
                b.gradeInfo.grades[bMode.letter()] / b.gradeInfo.total;

              if (
                arrayGt(
                  [aMode.value() || 0, aModePercent],
                  [bMode.value() || 0, bModePercent]
                )
              ) {
                return -1;
              } else if (
                arrayLt(
                  [aMode.value() || 0, aModePercent],
                  [bMode.value() || 0, bModePercent]
                )
              ) {
                return 1;
              }

              return 0;
            default:
              return 0;
          }
        }),

    [
      courses,
      filterOptions.sortBy,
      filterOptions.languages,
      filterOptions.years,
    ]
  );

  return filteredCourses;
}
