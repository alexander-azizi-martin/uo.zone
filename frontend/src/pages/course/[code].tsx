import Link from 'next/link';
import { withAxiomGetServerSideProps } from 'next-axiom';
import { useTranslations } from 'next-intl';

import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Badge } from '@/components/ui/badge';
import { type CourseWithProfessors, getCourse } from '@/lib/api';
import { getDictionary } from '@/lib/dictionary';
import { CourseInfo, CourseTabs } from '@/modules/course/components';

interface CourseProps {
  course: CourseWithProfessors;
}

export default function Course({ course }: CourseProps) {
  const tCourse = useTranslations('Course');

  const subjectCode = course.title.slice(0, 3);

  return (
    <Layout>
      <SearchNav>
        <h2 className='relative mt-4 sm:text-4xl'>
          <Link
            href={`/subject/${subjectCode}`}
            className='underline decoration-2 hover:decoration-4'
          >
            {subjectCode}
          </Link>

          {course.title.slice(3)}
        </h2>

        <div className='mt-1 flex flex-wrap gap-2'>
          {course.units !== null && (
            <Badge>{tCourse('units', { units: course.units })}</Badge>
          )}

          <Badge className='bg-[#3182ce]' size='sm'>
            {course.subject.subject}
          </Badge>
          <Badge className='bg-[#3182ce]' size='sm'>
            {course.subject.faculty}
          </Badge>
        </div>

        <CourseInfo course={course} />

        <CourseTabs course={course} />
      </SearchNav>
    </Layout>
  );
}

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
    try {
      const course = await getCourse(
        context.params?.code as string,
        context.locale,
      );

      return {
        props: {
          course,
          messages: await getDictionary(context.locale),
        },
      };
    } catch (error: any) {
      if (error.status == 404) {
        return {
          notFound: true,
        };
      }

      context.log.error('Internal Server Error', error);

      throw new Error('Internal Server Error');
    }
  },
);
