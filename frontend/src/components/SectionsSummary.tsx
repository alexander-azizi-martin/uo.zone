import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  VStack,
  Collapse,
  Box,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { CourseGrades } from '~/lib/grades';
import { termValue } from '~/lib/helpers';
import { GradeSummary } from '~/components/Grades';
import { BaseCard } from '~/components/Card';

interface SectionsSummaryProps {
  title: string;
  sectionGrades: CourseGrades[];
}

export default function SectionsSummary({
  title,
  sectionGrades,
}: SectionsSummaryProps) {
  const t = useTranslations('Course');

  const { isOpen, onToggle } = useDisclosure();

  const { totalGrades, term } = useMemo(() => {
    let minTerm = '';
    let minTermVal = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
    let maxTerm = '';
    let maxTermVal = [0, 0];

    const totalGrades = new CourseGrades({});
    for (let grades of sectionGrades) {
      const termVal = termValue(grades.term() as string);

      if (maxTermVal < termVal) {
        maxTerm = grades.term() as string;
        maxTermVal = termVal;
      }
      if (termVal < minTermVal) {
        minTerm = grades.term() as string;
        minTermVal = termVal;
      }

      totalGrades.add(grades);
    }

    const term =
      sectionGrades.length > 1
        ? t('terms', {
            count: sectionGrades.length,
            start: minTerm,
            stop: maxTerm,
          })
        : minTerm;

    return { totalGrades, term };
  }, [sectionGrades]);

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
