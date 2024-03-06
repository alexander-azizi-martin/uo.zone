import {
  Badge,
  Flex,
  HStack,
  Spacer,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import {
  GradeDistribution,
  GradeHistogram,
  GradeTendencies,
} from '~/components/Grades';
import { GradeInfo } from '~/lib/api';

interface GradeSummaryProps {
  title?: ReactNode;
  titleSize?: '3xl' | 'lg';
  subtitle?: ReactNode;
  info?: ReactNode;
  gradeInfo?: GradeInfo;
  distributionSize?: 'sm' | 'md';
  firstRender?: boolean;
}

export default function GradeSummary({
  title,
  titleSize = 'lg',
  subtitle,
  info,
  gradeInfo,
  distributionSize = 'md',
  firstRender = true,
}: GradeSummaryProps) {
  const tGrades = useTranslations('Grades');
  const [isLargerThan600] = useMediaQuery('(min-width: 650px)', {
    ssr: firstRender || typeof window === 'undefined',
    fallback: false,
  });

  let distributionWidth;
  let distributionHeight;

  if (distributionSize == 'sm') {
    distributionWidth = isLargerThan600 ? 300 : 250;
    distributionHeight = 40;
  } else if (distributionSize == 'md') {
    distributionWidth = isLargerThan600 ? 390 : 300;
    distributionHeight = 55;
  }

  return (
    <HStack
      justify={'center'}
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
        <Text fontSize={titleSize} fontWeight={'bold'} as={'div'}>
          {title}
        </Text>

        {subtitle && (
          <Text fontSize={'xs'} fontWeight={'200'} as={'div'}>
            {subtitle}
          </Text>
        )}

        <Spacer mt={3} />

        {gradeInfo && <GradeTendencies gradeInfo={gradeInfo} />}

        {info && info}
      </VStack>

      {gradeInfo && (
        <VStack
          gap={2}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <Badge margin={'auto'}>
            {tGrades('students', { totalStudents: gradeInfo.total })}
          </Badge>

          <Flex
            alignItems={['center', 'flex-end', 'flex-end']}
            gap={'10px'}
            flexDir={['column-reverse', 'row', 'row']}
          >
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
