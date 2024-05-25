import { useContext, useMemo } from 'react';

import { type Course } from '@/lib/api';
import { Grade } from '@/lib/grade';
import { arrayGt, arrayLt, percent } from '@/lib/helpers';

import { CourseFilterContext } from '../components/CourseFilterProvider';

export interface CourseFilterOptions {
  sortBy: string;
  years: string[];
  languages: string[];
}

export function useFilteredCourses(courses: Course[]) {
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

          return includesLanguage && includesYear;
        })
        .sort((a, b) => {
          switch (filterOptions.sortBy) {
            case 'code':
              return Number(a.code > b.code);
            case 'average': {
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
            }
            case 'median': {
              if (!a.gradeInfo && !b.gradeInfo) return Number(a.code > b.code);
              if (!a.gradeInfo) return 1;
              if (!b.gradeInfo) return -1;

              const aMedian = Grade.value(a.gradeInfo.median);
              const aMedianPercent = percent(
                a.gradeInfo.grades[a.gradeInfo.median],
                a.gradeInfo.total,
              );
              const bMedian = Grade.value(b.gradeInfo.median);
              const bMedianPercent = percent(
                b.gradeInfo.grades[b.gradeInfo.median],
                b.gradeInfo.total,
              );

              if (
                arrayLt(
                  [aMedian || 0, aMedianPercent],
                  [bMedian || 0, bMedianPercent],
                )
              ) {
                return 1;
              } else if (
                arrayGt(
                  [aMedian || 0, aMedianPercent],
                  [bMedian || 0, bMedianPercent],
                )
              ) {
                return -1;
              }

              return 0;
            }
            case 'mode': {
              if (!a.gradeInfo && !b.gradeInfo) return Number(a.code > b.code);
              if (!a.gradeInfo) return 1;
              if (!b.gradeInfo) return -1;

              const aMode = Grade.value(a.gradeInfo.mode);
              const aModePercent = percent(
                a.gradeInfo.grades[a.gradeInfo.mode],
                a.gradeInfo.total,
              );
              const bMode = Grade.value(b.gradeInfo.mode);
              const bModePercent = percent(
                b.gradeInfo.grades[b.gradeInfo.mode],
                b.gradeInfo.total,
              );

              if (
                arrayGt([aMode || 0, aModePercent], [bMode || 0, bModePercent])
              ) {
                return -1;
              } else if (
                arrayLt([aMode || 0, aModePercent], [bMode || 0, bModePercent])
              ) {
                return 1;
              }

              return 0;
            }
            default:
              return 0;
          }
        }),

    [
      courses,
      filterOptions.sortBy,
      filterOptions.languages,
      filterOptions.years,
    ],
  );

  return filteredCourses;
}
