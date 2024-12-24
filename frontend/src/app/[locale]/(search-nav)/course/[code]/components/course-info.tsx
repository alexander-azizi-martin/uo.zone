import { msg, Select, Trans } from '@lingui/macro';
import Markdown from 'markdown-to-jsx';

import { Badge } from '@/components/ui/badge';
import { type components } from '@/lib/api/schema';
import { getI18n } from '@/lib/i18n';
import { TERM_TO_ID } from '@/lib/utils';

import { CourseLink } from './course-link';

interface CourseInfoProps {
  course: components['schemas']['CourseResource'];
}

function CourseInfo({ course }: CourseInfoProps) {
  const i18n = getI18n();

  type Term = keyof typeof TERM_TO_ID;
  const terms: Term[] = [];

  for (const term in TERM_TO_ID) {
    const hasTerm = course.previousTermIds.some(
      (termId) => termId % 10 === TERM_TO_ID[term as Term],
    );

    if (hasTerm) terms.push(term as Term);
  }

  return (
    <div className='stack my-6 items-start gap-4'>
      <div className='text-base leading-6'>
        <Markdown options={{ overrides: { a: CourseLink } }}>
          {course.description}
        </Markdown>
      </div>
      {course.components.length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <p className='mb-auto text-sm font-bold'>
            <Trans>Components</Trans>:
          </p>

          <div className='flex flex-wrap gap-2'>
            {course.components.map((component) => (
              <Badge
                className='w-max-content bg-muted text-center text-foreground'
                size='sm'
                key={component}
              >
                {component}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {course.requirements && (
        <div className='flex gap-2'>
          <p className='mb-auto text-sm font-bold'>
            <Trans>Requirements</Trans>:
          </p>
          <div className='text-sm'>
            <Markdown options={{ overrides: { a: CourseLink } }}>
              {course.requirements}
            </Markdown>
          </div>
        </div>
      )}
      {terms.length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <p className='mb-auto text-sm font-bold'>
            <Trans>Previously Offered Terms</Trans>:
          </p>

          <div className='flex flex-wrap gap-2'>
            {terms.map((term) => (
              <Badge
                className='w-max-content bg-muted text-center text-foreground'
                size='sm'
                key={term}
              >
                {i18n._(TERMS[term])}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {course.equivalentCourse && (
        <div className='flex gap-2'>
          <p className='mb-auto text-sm font-bold'>
            <Select
              value={course.equivalentCourse.language}
              _en={'English Equivalent'}
              _fr={'French Equivalent'}
              other={''}
            />
            :
          </p>
          <div className='text-sm'>
            <CourseLink href={`/course/${course.equivalentCourse.code}`}>
              {course.equivalentCourse.code.slice(0, 3).toUpperCase() +
                ' ' +
                course.equivalentCourse.code.slice(3)}
            </CourseLink>
          </div>
        </div>
      )}
    </div>
  );
}

export { CourseInfo };

export type { CourseInfoProps };

const TERMS = {
  winter: msg`Winter`,
  summer: msg`Summer`,
  fall: msg`Fall`,
};
