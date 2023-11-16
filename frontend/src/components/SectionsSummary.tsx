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
import { CourseSection, Grades } from '~/lib/api';
import CourseGrades from '~/lib/grades';
import { compareTerms } from '~/lib/helpers';

interface SectionsSummaryProps {
  title: string;
  summarize: {
    grades: Grades;
    sections: CourseSection[];
  };
}

export default function SectionsSummary({
  title,
  summarize,
}: SectionsSummaryProps) {
  const t = useTranslations('Course');

  const { isOpen, onToggle } = useDisclosure();

  const { totalGrades, sectionGrades, term } = useMemo(() => {
    summarize.sections.sort(({ term: term1 }, { term: term2 }) =>
      compareTerms(term2, term1)
    );

    const totalGrades = new CourseGrades(summarize.grades);
    const sectionGrades = summarize.sections.map(
      ({ grades, term, section }) => new CourseGrades(grades, term, section)
    );

    let oldestTerm = summarize.sections[summarize.sections.length - 1].term;
    let newestTerm = summarize.sections[0].term;

    let term: string;
    if (sectionGrades.length === 1)
      term = `${oldestTerm} - ${summarize.sections[0].section}`;
    else if (oldestTerm == newestTerm)
      term = t('term', {
        count: sectionGrades.length,
        term: oldestTerm,
      });
    else
      term = t('terms', {
        count: sectionGrades.length,
        start: oldestTerm,
        stop: newestTerm,
      });

    return { totalGrades, sectionGrades, term };
  }, [summarize]);

  return (
    <Box>
      <GradeSummary
        title={title}
        subtitle={term}
        grades={totalGrades}
        distributionWidth={300}
        distributionHeight={40}
      />

      {sectionGrades.length > 1 && (
        <>
          <Collapse in={isOpen} animateOpacity>
            <VStack spacing={3} p={2} pt={3}>
              {sectionGrades.map((grades) => (
                <BaseCard
                  key={`${grades.term()} - ${grades.section()}` as string}
                >
                  <GradeSummary
                    subtitle={
                      `${grades.term()} - ${grades.section()}` as string
                    }
                    grades={grades}
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
