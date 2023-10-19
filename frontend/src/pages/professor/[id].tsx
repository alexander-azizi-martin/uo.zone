import type { GetServerSidePropsContext } from 'next';
import { getProfessor, ProfessorWithCourses } from '~/lib/api';
import Layout from '~/components/Layout';

interface ProfessorProps {
  professor: ProfessorWithCourses;
}

export default function Professor({ professor }: ProfessorProps) {
  return <Layout>{professor.name}</Layout>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const professor = await getProfessor(context.params?.code as string);

  return {
    props: {
      professor,
    },
  };
}
