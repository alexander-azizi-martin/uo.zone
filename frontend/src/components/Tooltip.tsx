import {
  Tooltip as ChakraTooltip,
  type TooltipProps,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function Tooltip(props: TooltipProps) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const ref = useRef();
  useOutsideClick({
    ref: ref as any,
    handler: () => setIsOpen(undefined),
  });

  return (
    <div
      ref={ref as any}
      onClick={() => {
        setIsOpen(isOpen ? undefined : true);
      }}
    >
      <ChakraTooltip {...props} isOpen={isOpen} />
    </div>
  );
}
