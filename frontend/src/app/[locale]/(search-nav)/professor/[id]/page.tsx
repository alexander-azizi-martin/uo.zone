import { Trans } from '@lingui/macro';

import { GradeSummary } from '@/components/grades/grade-summary';
import { SectionsSummary } from '@/components/sections-summary';
import { Paper } from '@/components/ui/paper';
import { client } from '@/lib/api/client';
import { loadI18n } from '@/lib/i18n';
import { type Locale } from '@/lingui.config';

interface ProfessorPageProps {
  params: {
    id: number;
    locale: Locale;
  };
}

export default async function ProfessorPage({ params }: ProfessorPageProps) {
  await loadI18n(params.locale);

  const professor = (
    await client.GET('/professors/{professor}', {
      params: {
        path: { professor: params.id },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;
  console.log(professor);
  console.log('jdjskalfkjdhsf')
  const courses = (
    await client.GET('/professors/{professor}/courses', {
      params: {
        path: { professor: params.id },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  console.log(courses);
  if (courses.length === 0) {
    return (
      <div>
        <Trans>No grade data.</Trans>
      </div>
    );
  }

  return (
    <div className='stack items-start gap-4'>
      {professor.grades && (
        <Paper size='lg'>
          <GradeSummary
            grades={professor.grades}
            title={<Trans>All Courses</Trans>}
            titleSize={'3xl'}
            info={
              <p className='mt-2 text-sm text-foreground/60'>
                <Trans>
                  This total also includes classes that they may not teach
                  anymore.
                </Trans>
              </p>
            }
          />
        </Paper>
      )}

      {courses.map((course) => (
        <SectionsSummary
          key={course.code}
          title={course.title}
          href={`/course/${course.code}`}
          summarize={course}
        />
      ))}
    </div>
  );
}
