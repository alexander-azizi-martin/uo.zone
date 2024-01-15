import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Collapse,
  IconButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BaseCard } from '~/components/Card';
import { GradeSummary } from '~/components/Grades';
import { CourseSection, GradeInfo } from '~/lib/api';

interface SectionsSummaryProps {
  title: string;
  summarize: {
    gradeInfo: GradeInfo;
    sections: CourseSection[];
  };
}

export default function SectionsSummary({
  title,
  summarize,
}: SectionsSummaryProps) {
  const tCourse = useTranslations('Course');

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

  return (
    <Box>
      <GradeSummary
        title={title}
        subtitle={term}
        gradeInfo={summarize.gradeInfo}
        distributionWidth={300}
        distributionHeight={40}
      />

      {summarize.sections.length > 1 && (
        <>
          <Collapse in={isOpen} animateOpacity>
            <VStack spacing={3} p={2} pt={3}>
              {summarize.sections.map((section) => (
                <BaseCard key={`${section.term} - ${section.section}`}>
                  <GradeSummary
                    subtitle={`${section.term} - ${section.section}`}
                    gradeInfo={section.gradeInfo}
                    distributionWidth={300}
                    distributionHeight={40}
                  />
                </BaseCard>
              ))}
            </VStack>
          </Collapse>

          <IconButton
            pos={'absolute'}
            size={'xs'}
            top={'36.5px'}
            left={'1px'}
            aria-label={'toggle dropdown'}
            variant={'ghost'}
            colorScheme={'blackAlpha'}
            rounded={'full'}
            onClick={(event) => {
              onToggle();
              event.preventDefault();
              event.stopPropagation();
            }}
            as={'div'}
          >
            {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </IconButton>
        </>
      )}
    </Box>
  );
}
