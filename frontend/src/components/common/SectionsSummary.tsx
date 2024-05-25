import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { type ReactNode, useMemo, useState } from 'react';

import { GradeSummary } from '@/components/grades/GradeSummary';
import { Link } from '@/components/links/Link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Paper } from '@/components/ui/paper';
import { type CourseSection, type GradeInfo } from '@/lib/api';

interface SectionsSummaryProps {
  title: ReactNode;
  href?: string;
  summarize: {
    gradeInfo?: GradeInfo;
    sections: CourseSection[];
  };
}

export function SectionsSummary({
  title,
  href,
  summarize,
}: SectionsSummaryProps) {
  const { _ } = useLingui();

  const [isOpen, setIsOpen] = useState(false);

  const term = useMemo(() => {
    const oldestTerm = summarize.sections[summarize.sections.length - 1].term;
    const newestTerm = summarize.sections[0].term;

    let term: string;
    if (summarize.sections.length === 1) {
      term = `${oldestTerm} - ${summarize.sections[0].section}`;
    } else if (oldestTerm == newestTerm) {
      term = _(msg`${summarize.sections.length} sections during ${oldestTerm}`);
    } else {
      term = _(
        msg`${summarize.sections.length} sections from ${oldestTerm} to ${newestTerm}`,
      );
    }

    return term;
  }, [summarize, _]);

  const summaryMarkup = (
    <>
      <GradeSummary
        title={title}
        subtitle={
          <>
            {term}
            {!summarize.gradeInfo && (
              <div>
                <Trans>No grade data available for this course.</Trans>
              </div>
            )}
          </>
        }
        gradeInfo={summarize.gradeInfo}
        graphSize={'sm'}
      />

      <CollapsibleContent>
        {summarize.sections.length > 1 && (
          <div className='stack gap-3 p-2 pt-3'>
            {summarize.sections.map((section) => (
              <Paper key={`${section.term} - ${section.section}`}>
                <GradeSummary
                  subtitle={`${section.term} - ${section.section}`}
                  gradeInfo={section.gradeInfo}
                  graphSize={'sm'}
                />
              </Paper>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </>
  );

  return (
    <Collapsible
      className='relative w-full'
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {href ? (
        <Paper asChild variant={'link'}>
          <Link href={href}>{summaryMarkup}</Link>
        </Paper>
      ) : (
        <Paper>{summaryMarkup}</Paper>
      )}

      {summarize.sections.length > 1 && (
        <CollapsibleTrigger asChild>
          <div className='absolute left-px'>
            <button
              className={`
                flex size-6 items-center justify-center rounded-full 
                p-0 hover:bg-accent/40
            `}
            >
              {isOpen ? (
                <ChevronDownIcon size={12} />
              ) : (
                <ChevronRightIcon size={12} />
              )}
            </button>
          </div>
        </CollapsibleTrigger>
      )}
    </Collapsible>
  );
}
