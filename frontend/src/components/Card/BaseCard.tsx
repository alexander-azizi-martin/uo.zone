import { Box, BoxProps } from '@chakra-ui/react';

export interface BaseCardProps extends BoxProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export default function BaseCard({
  children,
  onClick,
  style,
  ...props
}: BaseCardProps) {
  return (
    <Box
      background={'rgba(255,255,255,0.35)'}
      boxShadow={'0px 0px 4px rgba(111, 19, 29, 0.1)'}
      style={{
        borderRadius: 8,
        width: '100%',
        padding: '12px 20px',
        position: 'relative',
        textAlign: 'left',
        ...style,
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Box>
  );
}
