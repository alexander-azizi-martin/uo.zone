import { Plural, Trans } from '@lingui/macro';
import { type PropsWithChildren } from 'react';

import { Link } from '@/components/links/link';
import { TabLink, TabLinkList } from '@/components/links/tab-link';
import { Badge } from '@/components/ui/badge';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';
import { Locale } from '@/lingui.config';

import { CourseInfo } from './components/course-info';

interface CourseLayoutProps extends PropsWithChildren {
  params: {
    code: string;
    locale: Locale;
  };
}

export default async function CoursePage({
  children,
  params,
}: CourseLayoutProps) {
  await loadI18n(params.locale);

  const course = (
    await client.GET('/courses/{course}', {
      params: {
        path: { course: params.code },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  const subjectCode = course.title.slice(0, 3);
  const courseTitle = course.title.slice(3);

  return (
    <div>
      <h2 className='pt-4 sm:text-4xl'>
        <Link
          href={`/subject/${subjectCode.toLowerCase()}`}
          className='underline decoration-2 hover:decoration-4'
        >
          {subjectCode}
        </Link>

        {courseTitle}
      </h2>

      <div className='mt-1 flex flex-wrap gap-2'>
        {course.units !== null && (
          <Badge className='bg-muted text-foreground'>
            <Trans>
              {course.units}{' '}
              <Plural value={course.units} one='unit' other='units' />
            </Trans>
          </Badge>
        )}

        <Badge className='bg-blue-500' size='sm'>
          {course.subject.title}
        </Badge>
        <Badge className='bg-blue-500' size='sm'>
          {course.subject.faculty}
        </Badge>
      </div>

      <CourseInfo course={course} />

      <TabLinkList>
        <TabLink href={`/course/${course.code}`}>
          <Trans>Grades</Trans>
        </TabLink>

        <TabLink href={`/course/${course.code}/evaluations`}>
          <Trans>Evaluations</Trans>
        </TabLink>
      </TabLinkList>

      {children}
    </div>
  );
}
