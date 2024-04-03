import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  useBoolean,
  useOutsideClick,
} from '@chakra-ui/react';
import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';

import { type SurveyQuestion } from '~/lib/api';
import Survey from '~/lib/survey';

import { BaseCard, Tooltip } from '.';

interface SurveyQuestionHistogramProps {
  title: string;
  tooltip: string;
  surveyQuestion: SurveyQuestion;
}

export function SurveyQuestionHistogram({
  title,
  tooltip,
  surveyQuestion,
}: SurveyQuestionHistogramProps) {
  const tGeneral = useTranslations('General');

  const score = useMemo(() => Survey.score(surveyQuestion), [surveyQuestion]);

  return (
    <BaseCard style={{ width: '525px', paddingRight: 32, paddingBottom: 32 }}>
      <Flex pb={6} justify={'space-between'}>
        <Box>
          <Flex align={'center'}>
            <Text
              fontSize={['2xl', '3xl', '3xl']}
              fontWeight={'bold'}
              lineHeight={'36px'}
            >
              {title}
            </Text>

            <Tooltip label={tooltip}>
              <Box ml={1} color={'gray.400'}>
                <InfoIcon size={18} />
              </Box>
            </Tooltip>
          </Flex>

          <Text fontSize={'sm'} fontWeight={'light'} lineHeight={'18px'}>
            {surveyQuestion.totalResponses} {tGeneral('responses')}
          </Text>
        </Box>

        <HStack alignItems={'start'}>
          <Heading m={0} color={'black'} fontSize={['3xl', '4xl', '5xl']}>
            {score.toFixed(2)}
          </Heading>
          <Heading fontSize={['md', 'lg', 'xl']} color={'black'} pt={2}>
            / 5
          </Heading>
        </HStack>
      </Flex>

      <Box pos={'relative'}>
        {Object.entries(surveyQuestion.options)
          .sort(
            ([a], [b]) => Survey.RESPONSE_VALUES[b] - Survey.RESPONSE_VALUES[a]
          )
          .map(([option, responses]) => (
            <HistogramBar
              key={option}
              label={option}
              value={responses}
              total={surveyQuestion.totalResponses}
            />
          ))}

        {[25, 50, 75, 100].map((percent) => (
          <HistogramPercentBoundary key={percent} percent={percent} />
        ))}
      </Box>
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

  const valuePercent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Flex
      align={'center'}
      w={'100%'}
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      onClick={setHovering.on}
    >
      <Box
        pos={'relative'}
        borderRight={'1px solid black'}
        minW={'100px'}
        maxW={'100px'}
        py={4}
        pr={3}
        textAlign={'right'}
      >
        {label}
      </Box>

      <Flex
        zIndex={1}
        align={'center'}
        w={'100%'}
        h={4}
        _before={{
          w: `${valuePercent}%`,
          h: '100%',
          mr: 1.5,
          bgColor: '#651d32',
          content: `''`,
        }}
      >
        {hovering ? value : `${valuePercent}%`}
      </Flex>
    </Flex>
  );
}

interface HistogramPercentBoundaryProps {
  percent: number;
}

function HistogramPercentBoundary({ percent }: HistogramPercentBoundaryProps) {
  return (
    <Box
      pos={'absolute'}
      top={0}
      left={`calc(${percent / 100} * (100% - 100px) + 100px)`}
      h={'100%'}
      _before={{
        display: 'block',
        borderLeft: '1px solid black',
        w: '1px',
        h: '100%',
        opacity: 0.1,
        transform: 'translateX(-50%)',
        content: `''`,
      }}
    >
      <Box
        pos={'absolute'}
        bottom={0}
        w={'fit-content'}
        fontSize={'xs'}
        opacity={0.5}
        transform={'translate(-50%, 100%)'}
      >
        {percent}%
      </Box>
    </Box>
  );
}
