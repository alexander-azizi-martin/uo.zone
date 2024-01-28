import { Box, Flex, Text, useBoolean, useOutsideClick, useToken } from '@chakra-ui/react';
import { useMemo, useRef } from 'react';

import { GradeInfo } from '~/lib/api';
import LetterGrade, { Letter } from '~/lib/letterGrade';

interface GradeHistogramProps {
  gradeInfo: GradeInfo;
  barWidth?: number;
  height?: number;
  backgroundColor?: string;
}

export default function GradeHistogram({
  gradeInfo,
  barWidth = 32,
  height = 55,
  backgroundColor = 'white',
}: GradeHistogramProps) {
  const barHeights = useMemo(() => {
    const nonNumericalTotal = LetterGrade.NON_NUMERICAL_GRADES.reduce(
      (acc, letter) => acc + gradeInfo.grades[letter],
      0
    );

    return LetterGrade.NON_NUMERICAL_GRADES.map((letter) => {
      if (nonNumericalTotal == 0) return height;

      const percent = gradeInfo.grades[letter] / nonNumericalTotal;
      const complement = Math.max(0, 1 - percent);

      return Math.round(height * complement);
    });
  }, [gradeInfo, height]);

  return (
    <Flex>
      {barHeights.map((barHeight, i) => (
        <Bar
          key={i}
          letter={LetterGrade.NON_NUMERICAL_GRADES[i]}
          gradeInfo={gradeInfo}
          height={height}
          barHeight={barHeight}
          barWidth={barWidth}
          backgroundColor={backgroundColor}
        />
      ))}
    </Flex>
  );
}

interface BarProps {
  letter: Letter;
  gradeInfo: GradeInfo;
  height: number;
  barWidth: number;
  barHeight: number;
  backgroundColor?: string;
}

function Bar({
  letter,
  gradeInfo,
  height,
  barWidth,
  barHeight,
  backgroundColor,
}: BarProps) {
  const grade = new LetterGrade(letter);
  const [color] = useToken('colors', [`${grade.color()}.400`]);
  const [hovering, setHovering] = useBoolean(false);
  const ref = useRef();
  useOutsideClick({
    ref: ref as any,
    handler: setHovering.off,
  });

  return (
    <Flex
      ref={ref as any}
      w={`${barWidth}px`}
      flexDir={'column'}
      position={'relative'}
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      onClick={setHovering.on}
    >
      <Box h={`${height}px`} w={'100%'} bgColor={color}>
        <Box
          w={'100%'}
          borderTop={`${barHeight}px solid ${backgroundColor}`}
          opacity={'0.92'}
        ></Box>
      </Box>

      <Text h={'14px'} m={'auto'} fontSize={'9px'} opacity={'0.8'}>
        {hovering ? gradeInfo.grades[grade.letter()] : grade.letter()}
      </Text>

      {hovering && (
        <Box
          w={`2px`}
          h={`${height}px`}
          background={'black'}
          opacity={'0.2'}
          position={'absolute'}
          left={`${barWidth / 2 - 1}px`}
        ></Box>
      )}
    </Flex>
  );
}
