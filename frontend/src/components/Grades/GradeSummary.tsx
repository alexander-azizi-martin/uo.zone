import { HStack, VStack, Box, Text, Spacer } from '@chakra-ui/react';
import { CourseGrades } from '~/lib/grades';
import { RateMyProfessorReview } from '~/lib/api';
import {
  GradeDistribution,
  GradeTendencies,
  RmpRating,
} from '~/components/Grades';

interface GradeSummaryProps {
  title?: string;
  titleSize?: '3xl' | 'lg';
  subtitle?: string;
  info?: React.ReactNode;
  grades: CourseGrades;
  rmpReview?: RateMyProfessorReview;
  distributionWidth?: number;
  distributionHeight?: number;
}

export default function GradeSummary({
  title,
  titleSize = 'lg',
  subtitle,
  info,
  grades,
  rmpReview,
  distributionWidth = 390,
  distributionHeight = 55,
}: GradeSummaryProps) {
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

        <GradeTendencies grades={grades} />

        {info && info}
      </VStack>

      <GradeDistribution
        grades={grades}
        width={distributionWidth}
        height={distributionHeight}
      />
    </HStack>
  );
}
