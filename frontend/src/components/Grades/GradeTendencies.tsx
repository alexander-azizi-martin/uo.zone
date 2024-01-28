import { HStack, Tag } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import { type GradeInfo } from '~/lib/api';
import LetterGrade from '~/lib/letterGrade';

interface GradeTendenciesProps {
  gradeInfo: GradeInfo;
}

export default function GradeTendencies({ gradeInfo }: GradeTendenciesProps) {
  const tGrades = useTranslations('Grades');

  const mean = new LetterGrade(gradeInfo.mean);
  const median = new LetterGrade(gradeInfo.median);
  const mode = new LetterGrade(gradeInfo.mode);

  return (
    <HStack>
      {gradeInfo.mean && gradeInfo.total > 0 && (
        <Tag size={'sm'} textAlign={'center'} colorScheme={mean.color()} py={1}>
          {tGrades('mean', {
            letter: mean.letter(),
            value: mean.value().toFixed(3),
          })}
        </Tag>
      )}
      {gradeInfo.median && gradeInfo.total > 0 && (
        <Tag
          size={'sm'}
          textAlign={'center'}
          colorScheme={median.color()}
          py={1}
        >
          {tGrades('median', { letter: median.letter() })}
        </Tag>
      )}
      {gradeInfo.mode && gradeInfo.total > 0 && (
        <Tag size={'sm'} textAlign={'center'} colorScheme={mode.color()} py={1}>
          {tGrades('mode', {
            letter: mode.letter(),
            percent: Math.round(
              (gradeInfo.grades[mode.letter()] / gradeInfo.total) * 100
            ),
          })}
        </Tag>
      )}
    </HStack>
  );
}
