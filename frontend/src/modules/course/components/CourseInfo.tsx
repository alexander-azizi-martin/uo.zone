import Markdown from 'markdown-to-jsx';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { type Course } from '@/lib/api';
import { CourseLink } from '@/modules/course/components';

interface CourseInfoProps {
  course: Course;
}

export function CourseInfo({ course }: CourseInfoProps) {
  const tGeneral = useTranslations('General');

  return (
    <div className='stack my-6 items-start gap-4'>
      <div className='text-base leading-6'>
        <Markdown options={{ overrides: { a: CourseLink } }}>
          {course.description}
        </Markdown>
      </div>

      {course.components.length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <p className='mb-auto text-sm font-bold'>{tGeneral('components')}:</p>

          <div className='flex flex-wrap gap-2'>
            {course.components.map((component) => (
              <Badge
                className='w-max-content text-center'
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
            {tGeneral('requirements')}:
          </p>
          <div className='text-sm'>
            <Markdown options={{ overrides: { a: CourseLink } }}>
              {course.requirements}
            </Markdown>
          </div>
        </div>
      )}
      {course.englishEquivalent && (
        <div className='flex gap-2'>
          <p className='mb-auto text-sm font-bold'>
            {tGeneral('english-equivalent')}:
          </p>
          <div className='text-sm'>
            <CourseLink href={`/course/${course.englishEquivalent}`}>
              {course.englishEquivalent.slice(0, 3).toUpperCase() +
                ' ' +
                course.englishEquivalent.slice(3)}
            </CourseLink>
          </div>
        </div>
      )}
      {course.frenchEquivalent && (
        <div className='flex gap-2'>
          <p className='mb-auto text-sm font-bold'>
            {tGeneral('french-equivalent')}:
          </p>
          <div className='text-sm'>
            <CourseLink href={`/course/${course.frenchEquivalent}`}>
              {course.frenchEquivalent.slice(0, 3).toUpperCase() +
                ' ' +
                course.frenchEquivalent.slice(3)}
            </CourseLink>
          </div>
        </div>
      )}
    </div>
  );
}
