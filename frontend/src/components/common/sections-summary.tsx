import { msg, Trans } from '@lingui/macro';
import cntl from 'cntl';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { type ReactNode } from 'react';

import {
  GradeSummary,
  GradeSummaryGraph,
  GradeSummaryHeader,
  GradeSummaryRoot,
  GradeSummarySubtitle,
  GradeSummaryTitle,
} from '@/components/grades/grade-summary';
import { Link } from '@/components/links/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Paper } from '@/components/ui/paper';
import { type components } from '@/lib/api/schema';
import { getI18n } from '@/lib/i18n';

interface SectionsSummaryProps {
  title: ReactNode;
  href?: string;
  summarize: {
    grades: components['schemas']['GradesResource'];
    sections: components['schemas']['CourseSectionResource'][];
  };
}

function SectionsSummary({ title, href, summarize }: SectionsSummaryProps) {
  const i18n = getI18n();

  const oldestTerm = summarize.sections[summarize.sections.length - 1].term;
  const newestTerm = summarize.sections[0].term;

  let term: string;
  if (summarize.sections.length === 1) {
    term = `${oldestTerm} - ${summarize.sections[0].section}`;
  } else if (oldestTerm == newestTerm) {
    term = i18n._(
      msg`${summarize.sections.length} sections during ${oldestTerm}`,
    );
  } else {
    term = i18n._(
      msg`${summarize.sections.length} sections from ${oldestTerm} to ${newestTerm}`,
    );
  }

  return (
    <Collapsible className='relative w-full'>
      <Paper variant={href ? 'link' : 'default'}>
        <GradeSummaryRoot>
          <GradeSummaryHeader grades={summarize.grades}>
            <GradeSummaryTitle size='lg'>{title}</GradeSummaryTitle>

            <GradeSummarySubtitle className='relative'>
              {summarize.sections.length > 1 && (
                <CollapsibleTrigger asChild>
                  <button
                    className={cntl`
                      prevent-hover absolute -left-5 -top-0.5 z-10 flex size-6
                      items-center justify-center rounded-full p-0 hover:bg-foreground/5 
                      dark:hover:bg-foreground/15
                    `}
                  >
                    <ChevronDownIcon
                      size={12}
                      className={cntl`
                        text-gray-400
                        [[data-state=closed]>&]:hidden
                        [[data-state=open]>&]:block
                      `}
                    />
                    <ChevronRightIcon
                      size={12}
                      className={cntl`
                        text-gray-400
                        [[data-state=closed]>&]:block
                        [[data-state=open]>&]:hidden
                      `}
                    />
                  </button>
                </CollapsibleTrigger>
              )}

              <p>{term}</p>

              {!summarize.grades && (
                <p>
                  <Trans>No grade data available for this course.</Trans>
                </p>
              )}
            </GradeSummarySubtitle>
          </GradeSummaryHeader>

          {summarize.grades && (
            <GradeSummaryGraph grades={summarize.grades} size='sm' />
          )}
        </GradeSummaryRoot>

        <CollapsibleContent>
          {summarize.sections.length > 1 && (
            <div className='stack gap-3 p-2 pt-3'>
              {summarize.sections.map((section) => (
                <Paper key={`${section.term} - ${section.section}`}>
                  <GradeSummary
                    subtitle={`${section.term} - ${section.section}`}
                    grades={section.grades}
                    graphSize='sm'
                  />
                </Paper>
              ))}
            </div>
          )}
        </CollapsibleContent>

        {href && <Link href={href} className='stretched-link' />}
      </Paper>
    </Collapsible>
  );
}

export { SectionsSummary };

export type { SectionsSummaryProps };
