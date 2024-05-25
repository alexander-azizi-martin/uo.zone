import { Plural, Trans } from '@lingui/macro';

import { Link } from '@/components/links/Link';
import { Badge } from '@/components/ui/badge';
import { getCourse } from '@/lib/api';
import { loadI18n } from '@/lib/i18n';

import { CourseInfo } from './components/CourseInfo';
import { CourseTabs } from './components/CourseTabs';

interface CoursePageProps {
  params: {
    code: string;
    locale: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  await loadI18n(params.locale);
  const course = await getCourse(params.code, params.locale);

  const subjectCode = course.title.slice(0, 3);
  const courseTitle = course.title.slice(3);

  return (
    <div>
      <h2 className='relative mt-4 sm:text-4xl'>
        <Link
          href={`/subject/${subjectCode}`}
          className='underline decoration-2 hover:decoration-4'
        >
          {subjectCode}
        </Link>

        {courseTitle}
      </h2>

      <div className='mt-1 flex flex-wrap gap-2'>
        {course.units !== null && (
          <Badge className='text-black bg-muted'>
            <Trans>
              {course.units}{' '}
              <Plural value={course.units} one='unit' other='units' />
            </Trans>
          </Badge>
        )}

        <Badge className='bg-blue-500' size='sm'>
          {course.subject.subject}
        </Badge>
        <Badge className='bg-blue-500' size='sm'>
          {course.subject.faculty}
        </Badge>
      </div>

      <CourseInfo course={course} />

      <CourseTabs course={course} />
    </div>
  );
}
