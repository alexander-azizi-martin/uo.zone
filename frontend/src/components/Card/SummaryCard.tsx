import { BaseCard, type BaseCardProps } from '~/components';

export function SummaryCard({ children, style, ...props }: BaseCardProps) {
  return (
    <BaseCard
      {...props}
      style={{
        ...style,
        background: 'rgba(255,255,255,0.85)',
        boxShadow: '0px 0px 6px rgba(111, 19, 29, 0.175)',
        padding: '36px 20px',
      }}
    >
      {children}
    </BaseCard>
  );
}
