import { client } from '@/lib/api/client';
import { type Locale } from '@/lingui.config';

import { VirtualCourseList } from './virtual-course-list';

interface CourseListProps {
  code: string;
  locale: Locale;
}

async function CourseList({ code, locale }: CourseListProps) {
  const courses = (
    await client.GET('/subjects/{subject}/courses', {
      params: {
        path: { subject: code },
        header: { 'Accept-Language': locale },
      },
    })
  ).data!;

  return <VirtualCourseList courses={courses} />;
}

export { CourseList };

export type { CourseListProps };
