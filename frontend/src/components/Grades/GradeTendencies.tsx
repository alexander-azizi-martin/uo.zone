import { useMemo } from 'react';
import { HStack, Tag } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { CourseGrades } from '~/lib/grades';

interface GradeTendenciesProps {
  grades: CourseGrades;
}

export default function GradeTendencies({ grades }: GradeTendenciesProps) {
  const t = useTranslations('Grades');

  const { mean, mode } = useMemo(() => {
    return { mean: grades.mean(), mode: grades.mode() };
  }, [grades]);

  return (
    <HStack>
      {mean.value() >= 0 && grades.totalStudents() > 0 && (
        <Tag size={'sm'} textAlign={'center'} colorScheme={mean.color()} py={1}>
          {t('mean', {
            letter: mean.letter(),
            value: mean.value().toFixed(3),
          })}
        </Tag>
      )}
      {mode.value() >= 0 && grades.totalStudents() > 0 && (
        <Tag size={'sm'} textAlign={'center'} colorScheme={mode.color()} py={1}>
          {t('mode', {
            letter: mode.letter(),
            percent: Math.round(grades.percentage(mode.letter()) * 100),
          })}
        </Tag>
      )}
    </HStack>
  );
}
