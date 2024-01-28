import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Badge,
  Heading,
  HStack,
  Tooltip,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { useRef,useState } from 'react';

import { BaseCardProps, SummaryCard } from '~/components/Card';

interface BigNumberCardProps extends BaseCardProps {
  value: string;
  total: number;
  info: string;
  tooltip?: string;
}

export default function BigNumberCard({
  value,
  total,
  info,
  tooltip = '',
  style,
  ...props
}: BigNumberCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const ref = useRef();
  useOutsideClick({
    ref: ref as any,
    handler: () => setIsOpen(undefined),
  });

  return (
    <SummaryCard
      {...props}
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        ...style,
      }}
    >
      <VStack
        align={'center'}
        spacing={0}
        ref={ref as any}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HStack align={'start'}>
          <Heading color={'black'} size={'2xl'} m={0}>
            {value}
          </Heading>
          <Heading color={'black'} size={'md'} pt={2}>
            /{total}
          </Heading>
        </HStack>
        <Tooltip label={tooltip} hasArrow textAlign={'center'} isOpen={isOpen}>
          <Badge
            color={'gray.500'}
            background={'transparent'}
            display={'flex'}
            alignItems={'center'}
          >
            {info} {tooltip && <InfoOutlineIcon ml={1} />}
          </Badge>
        </Tooltip>
      </VStack>
    </SummaryCard>
  );
}
