import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  useBoolean,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { BaseCard, Tooltip } from '~/components';
import { type SurveyQuestion } from '~/lib/api';

interface SurveyQuestionGraphProps {
  surveyQuestion: SurveyQuestion;
}

// rename to histogram
export function SurveyQuestionGraph({
  surveyQuestion,
}: SurveyQuestionGraphProps) {
  return (
    <BaseCard>
      <Flex justify={'space-between'} pb={6}>
        <Tooltip label={'hello'} hasArrow textAlign={'center'}>
          <Flex>
            <Heading color={'black'} size={'xl'}>
              Organized
            </Heading>
            <Badge
              color={'gray.500'}
              background={'transparent'}
              display={'flex'}
              alignItems={'center'}
            >
              <InfoOutlineIcon ml={1}  />
            </Badge>
          </Flex>
        </Tooltip>

        <HStack align={'start'}>
          <Heading color={'black'} size={'2xl'} m={0}>
            4.30
          </Heading>
          <Heading color={'black'} size={'md'} pt={2}>
            / 5
          </Heading>
        </HStack>
      </Flex>

      {Object.entries(surveyQuestion.options).map(([option, responses]) => (
        <HistogramBar
          key={option}
          label={option}
          value={responses}
          total={surveyQuestion.totalResponses}
        />
      ))}
    </BaseCard>
  );
}

interface HistogramBar {
  label: string;
  value: number;
  total: number;
}

function HistogramBar({ label, value, total }: HistogramBar) {
  const [hovering, setHovering] = useBoolean(false);
  const ref = useRef(null);
  useOutsideClick({
    ref: ref,
    handler: setHovering.off,
  });

  return (
    <Flex
      width={'100%'}
      align={'center'}
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      onClick={setHovering.on}
    >
      <Box
        borderRight={'gray 1px solid'}
        width={'150px'}
        py={4}
        textAlign={'center'}
        position={'relative'}
      >
        {label}

        <Divider
          width={'10px'}
          border={'gray 1px solid'}
          opacity={1}
          position={'absolute'}
          right={'-6px'}
          top={'50%'}
        />
      </Box>

      <Flex height={4} width={'100%'} align={'center'}>
        <Box
          bgColor={'red'}
          width={`${(value / total) * 100}%`}
          height={'100%'}
        ></Box>
        {hovering ? value : Math.round((value / total) * 100) + '%'}
      </Flex>
    </Flex>
  );
}
