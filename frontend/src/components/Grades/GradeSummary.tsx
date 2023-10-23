import { HStack, VStack, Text } from '@chakra-ui/react';
import { CourseGrades } from '~/lib/grades';
import { GradeDistribution, GradeTendencies } from '.';

interface GradeSummaryProps {
  title?: string;
  titleSize?: '3xl' | 'lg';
  subtitle?: string;
  info?: string;
  grades: CourseGrades;
  distributionWidth?: number;
  distributionHeight?: number;
}

export default function GradeSummary({
  title,
  titleSize = 'lg',
  subtitle,
  info,
  grades,
  distributionWidth = 390,
  distributionHeight = 55,
}: GradeSummaryProps) {
  return (
    <HStack
      justify={'center'}
      align={'center'}
      width={'100%'}
      flexWrap={'wrap'}
    >
      <VStack
        align={'start'}
        flexGrow={1}
        pb={2}
        width={'50%'}
        justifyContent={'center'}
        height={'100%'}
        spacing={0}
      >
        <Text fontSize={titleSize} fontWeight={'bold'}>
          {title}
        </Text>
        {subtitle && (
          <Text fontSize={'xs'} fontWeight={'200'}>
            {subtitle}
          </Text>
        )}

        <GradeTendencies grades={grades} />

        {info && (
          <Text fontSize={'sm'} color={'gray.600'} pt={2}>
            {info}
          </Text>
        )}
      </VStack>

      <GradeDistribution
        grades={grades}
        width={distributionWidth}
        height={distributionHeight}
      />
    </HStack>
  );
}
