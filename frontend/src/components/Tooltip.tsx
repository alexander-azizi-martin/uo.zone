import {
  chakra,
  Tooltip as ChakraTooltip,
  type TooltipProps,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export function Tooltip(props: TooltipProps) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(undefined),
  });

  return (
    <chakra.div
      ref={ref}
      onClick={() => {
        setIsOpen(isOpen ? undefined : true);
      }}
    >
      <ChakraTooltip {...props} isOpen={isOpen} />
    </chakra.div>
  );
}
