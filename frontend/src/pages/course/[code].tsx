import type { GetServerSidePropsContext } from 'next';
import { getCourse, CourseWithProfessors } from '~/lib/api';
import Layout from '~/components/Layout';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  return <Layout>{course.code}</Layout>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const course = await getCourse(context.params?.code as string);

  return {
    props: {
      course,
    },
  };
}
