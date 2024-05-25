import { getSubjectCourses } from '@/lib/api';

import { VirtualCourseList } from './VirtualCourseList';

interface CourseListProps {
  code: string;
  locale: string;
}

export async function CourseList({ code, locale }: CourseListProps) {
  const courses = await getSubjectCourses(code, locale);

  return <VirtualCourseList courses={courses} />;
}
