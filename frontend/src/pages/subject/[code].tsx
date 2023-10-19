import type { GetServerSidePropsContext } from 'next';
import { getSubject, Subject } from '~/lib/api';
import Layout from '~/components/Layout';

interface SubjectProps {
  subject: Subject;
}

export default function Subject({ subject }: SubjectProps) {
  return <Layout>{subject.code}</Layout>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const subject = await getSubject(context.params?.code as string);

  return {
    props: {
      subject,
    },
  };
}
