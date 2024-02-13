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
  const mode = new LetterGrade(gradeInfo.mode);
  console.log(mean);
  return (
    <HStack>
      {gradeInfo.mean !== null && gradeInfo.total > 0 && (
        <Tag size={'sm'} textAlign={'center'} colorScheme={mean.color()} py={1}>
          {tGrades('mean', {
            letter: mean.letter(),
            value: mean.value().toFixed(3),
          })}
        </Tag>
      )}
      {gradeInfo.mode !== null && gradeInfo.total > 0 && (
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
