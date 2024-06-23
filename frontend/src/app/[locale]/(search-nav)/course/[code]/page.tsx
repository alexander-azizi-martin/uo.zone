import { Plural, Trans } from '@lingui/macro';
import { InfoIcon } from 'lucide-react';

import { SectionsSummary } from '@/components/common/sections-summary';
import { GradeSummary } from '@/components/grades/grade-summary';
import { Paper } from '@/components/ui/paper';
import { Tooltip } from '@/components/ui/tooltip';
import { client } from '@/lib/api/client';
import { type components } from '@/lib/api/schema';
import { loadI18n } from '@/lib/i18n';

interface CoursePageProps {
  params: {
    code: string;
    locale: string;
  };
}

export default async function GradeCoursePage({ params }: CoursePageProps) {
  await loadI18n(params.locale);

  const course = (
    await client.GET('/courses/{course}', {
      params: {
        path: { course: params.code },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  const professors = (
    await client.GET('/courses/{course}/professors', {
      params: {
        path: { course: params.code },
        header: { 'Accept-Language': params.locale },
      },
    })
  ).data!;

  if (professors.length === 0) {
    return (
      <div>
        <Trans>No grade data.</Trans>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col items-start gap-4'>
        {course.grades && (
          <Paper size='lg'>
            <GradeSummary
              grades={course.grades}
              title={<Trans>All Professors</Trans>}
              titleSize={'3xl'}
            />
          </Paper>
        )}

        {professors.map((professor) => (
          <SectionsSummary
            key={professor.id}
            title={
              professor.id !== 0 ? (
                professor.name
              ) : (
                <UnknownProfessor professor={professor} />
              )
            }
            href={professor.id !== 0 ? `/professor/${professor.publicId}` : undefined}
            summarize={professor}
          />
        ))}
      </div>
    </div>
  );
}

interface UnknownProfessorProps {
  professor: components['schemas']['ProfessorWithSectionsResource'];
}

function UnknownProfessor({ professor }: UnknownProfessorProps) {
  return (
    <div className='flex items-center gap-2'>
      <div>
        <Trans>
          Unknown{' '}
          <Plural
            value={professor.sections.length}
            one='Professor'
            other='Professors'
          />
        </Trans>
      </div>

      <Tooltip
        label={
          <Trans>
            The{' '}
            <Plural
              value={professor.sections.length}
              one='professor for this course section is'
              other='professors for these course sections are'
            />{' '}
            not known.
          </Trans>
        }
        className='text-center text-sm'
      >
        <InfoIcon size={14} />
      </Tooltip>
    </div>
  );
}
