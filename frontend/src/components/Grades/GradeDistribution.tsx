import { Badge, Box, Circle, Flex, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler, useMemo, useRef, useState } from 'react';

import { useGradient } from '~/hooks';
import { gradeGradient } from '~/lib/config';
import CourseGrades, { LetterGrade } from '~/lib/grades';

interface GradeDistributionProps {
  grades: CourseGrades;
  width?: number;
  height?: number;
  background?: string;
}

export default function GradeDistribution({
  grades,
  width = 390,
  height = 55,
  background = 'white',
}: GradeDistributionProps) {
  const t = useTranslations('Grades');

  const [selectedGrade, setSelectedGrade] = useState<LetterGrade>();
  const gradient = useGradient(gradeGradient);
  const rootRef = useRef<HTMLDivElement>();

  const heights = useMemo(() => {
    return LetterGrade.LETTER_ORDER.map((letter) =>
      Math.round(height * Math.max(0, 1 - grades.percentage(letter) * 3))
    );
  }, [grades, height]);

  const blockWidth = width / 10;
  const gradeOffset = (grade: number) => grade * blockWidth;

  const handleMouseMove: MouseEventHandler = (event) => {
    if (!rootRef.current) return;

    const rootRect = rootRef.current.getBoundingClientRect();
    const x = event.clientX - rootRect.left;

    let minDistance = width;
    let closestGrade = -1;
    for (let grade = 0; grade < 11; grade++) {
      const distance = Math.abs(gradeOffset(grade) - x);

      if (distance < minDistance) {
        minDistance = distance;
        closestGrade = grade;
      }
    }

    setSelectedGrade(new LetterGrade(closestGrade));
  };

  return (
    <Flex direction={'column'}>
      <Badge margin={'auto'} mb={2}>
        {t('students', { totalStudents: grades.totalStudents() })}
      </Badge>

      <Flex
        ref={rootRef as any}
        w={`${width}px`}
        h={`${height}px`}
        borderRadius={4}
        background={gradient}
        overflow={'hidden'}
        position={'relative'}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setSelectedGrade(undefined)}
      >
        {heights.map((_, i) => {
          if (i + 1 >= heights.length) return null;

          let currentHeight = heights[i];
          let nextHeight = heights[i + 1];

          const rectHeight = Math.min(currentHeight, nextHeight);
          const trigHeight = Math.abs(currentHeight - nextHeight);

          return (
            <Box w={`${blockWidth}px`} key={i}>
              <Box
                w="100%"
                opacity={'0.92'}
                borderTop={`${rectHeight}px solid ${background}`}
              ></Box>
              <Box
                w="100%"
                opacity={'0.92'}
                style={{
                  [currentHeight < nextHeight
                    ? 'borderLeft'
                    : 'borderRight']: `${blockWidth}px solid transparent`,
                }}
                borderTop={`${trigHeight}px solid ${background}`}
              ></Box>
            </Box>
          );
        })}

        {selectedGrade !== undefined && (
          <>
            <PinPoint
              x={gradeOffset(selectedGrade.value())}
              y={heights[selectedGrade.value()]}
            />

            <Text
              style={{
                width: 'max-content',
                color: '#1B202B',
                userSelect: 'none',
                fontSize: 12,
                fontWeight: 'bold',
                margin: 'auto',
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {t('occurrence', {
                letter: selectedGrade.letter(),
                letterClass: selectedGrade.letter()[0],
                occurrences: grades.count(selectedGrade.letter()),
                percent: Math.round(
                  grades.percentage(selectedGrade.letter()) * 100
                ),
              })}
            </Text>
          </>
        )}
      </Flex>

      <Box position={'relative'} h={'14px'}>
        {LetterGrade.LETTER_ORDER.map((letter, i) => {
          if (i % 2 == 1) return null;

          return (
            <Text
              key={letter}
              style={{
                fontSize: '9px',
                opacity: '0.6',
                transform: 'translateX(-50%)',
                position: 'absolute',
                top: 0,
                left: `${gradeOffset(i)}px`,
              }}
            >
              {letter}
            </Text>
          );
        })}
      </Box>
    </Flex>
  );
}

interface PinPointProps {
  x: number;
  y: number;
}

function PinPoint({ x, y }: PinPointProps) {
  const lineWidth = 2;
  const circleRadius = 3;

  return (
    <>
      <Box
        w={'100%'}
        h={`${lineWidth}px`}
        background={'black'}
        opacity={'0.1'}
        position={'absolute'}
        top={`${y - lineWidth / 2}px`}
      ></Box>
      <Box
        w={`${lineWidth}px`}
        h={'100%'}
        background={'black'}
        opacity={'0.2'}
        position={'absolute'}
        left={`${x - lineWidth / 2}px`}
      ></Box>
      <Circle
        position={'absolute'}
        left={`${x - circleRadius / 2}px`}
        top={`${y - circleRadius / 2}px`}
        style={{
          width: `${circleRadius}px`,
          height: `${circleRadius}px`,
          background: 'black',
          opacity: '0.4',
        }}
      />
    </>
  );
}
