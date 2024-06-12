import { client } from '@/lib/api/client';

import { VirtualCourseList } from './VirtualCourseList';

interface CourseListProps {
  code: string;
  locale: string;
}

export async function CourseList({ code, locale }: CourseListProps) {
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
