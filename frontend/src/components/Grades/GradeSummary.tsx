import { Badge, Flex,HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import {
  GradeDistribution,
  GradeHistogram,
  GradeTendencies,
} from '~/components/Grades';
import { GradeInfo } from '~/lib/api';

interface GradeSummaryProps {
  title?: string;
  titleSize?: '3xl' | 'lg';
  subtitle?: string;
  info?: React.ReactNode;
  gradeInfo?: GradeInfo;
  distributionWidth?: number;
  distributionHeight?: number;
}

export default function GradeSummary({
  title,
  titleSize = 'lg',
  subtitle,
  info,
  gradeInfo,
  distributionWidth = 390,
  distributionHeight = 55,
}: GradeSummaryProps) {
  const tGrades = useTranslations('Grades');

  return (
    <HStack
      justify={'center'}
      align={'center'}
      width={'100%'}
      flexWrap={'wrap'}
      alignItems={'start'}
    >
      <VStack
        align={'start'}
        flexGrow={1}
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

        <Spacer mt={3} />

        {gradeInfo && <GradeTendencies gradeInfo={gradeInfo} />}

        {info && info}
      </VStack>

      {gradeInfo && (
        <VStack gap={2}>
          <Badge margin={'auto'}>
            {tGrades('students', { totalStudents: gradeInfo.total })}
          </Badge>

          <Flex alignItems={'flex-end'} gap={'10px'}>
            <GradeHistogram gradeInfo={gradeInfo} height={distributionHeight} />
            <GradeDistribution
              gradeInfo={gradeInfo}
              width={distributionWidth}
              height={distributionHeight}
            />
          </Flex>
        </VStack>
      )}
    </HStack>
  );
}
