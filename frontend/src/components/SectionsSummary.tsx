import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Collapse,
  IconButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ReactNode, useMemo } from 'react';

import { BaseCard, LinkCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';
import { CourseSection, GradeInfo } from '~/lib/api';

interface SectionsSummaryProps {
  title: ReactNode;
  href?: string;
  summarize: {
    gradeInfo?: GradeInfo;
    sections: CourseSection[];
  };
}

export default function SectionsSummary({
  title,
  href,
  summarize,
}: SectionsSummaryProps) {
  const tCourse = useTranslations('Course');
  const tGrades = useTranslations('Grades');

  const { isOpen, onToggle } = useDisclosure();

  const term = useMemo(() => {
    let oldestTerm = summarize.sections[summarize.sections.length - 1].term;
    let newestTerm = summarize.sections[0].term;

    let term: string;
    if (summarize.sections.length === 1)
      term = `${oldestTerm} - ${summarize.sections[0].section}`;
    else if (oldestTerm == newestTerm)
      term = tCourse('term', {
        count: summarize.sections.length,
        term: oldestTerm,
      });
    else
      term = tCourse('terms', {
        count: summarize.sections.length,
        start: oldestTerm,
        stop: newestTerm,
      });

    return term;
  }, [summarize, tCourse]);

  const summaryMarkup = (
    <>
      <GradeSummary
        title={title}
        subtitle={
          <>
            {term}
            {!summarize.gradeInfo && (
              <>
                <br /> {tGrades('no-data')}
              </>
            )}
          </>
        }
        gradeInfo={summarize.gradeInfo}
        distributionSize={'sm'}
      />

      {summarize.sections.length > 1 && (
        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={3} p={2} pt={3}>
            {summarize.sections.map((section) => (
              <BaseCard key={`${section.term} - ${section.section}`}>
                <GradeSummary
                  subtitle={`${section.term} - ${section.section}`}
                  gradeInfo={section.gradeInfo}
                  distributionSize={'sm'}
                />
              </BaseCard>
            ))}
          </VStack>
        </Collapse>
      )}
    </>
  );

  return (
    <Box position={'relative'} w={'100%'}>
      {href ? (
        <LinkCard href={href}>{summaryMarkup}</LinkCard>
      ) : (
        <BaseCard>{summaryMarkup}</BaseCard>
      )}

      {summarize.sections.length > 1 && (
        <IconButton
          pos={'absolute'}
          size={'xs'}
          top={'36.5px'}
          left={'1px'}
          aria-label={'toggle dropdown'}
          variant={'ghost'}
          colorScheme={'blackAlpha'}
          cursor={'pointer'}
          rounded={'full'}
          onClick={() => {
            onToggle();
          }}
          as={'div'}
        >
          {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </IconButton>
      )}
    </Box>
  );
}
