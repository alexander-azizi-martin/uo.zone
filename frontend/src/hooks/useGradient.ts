import { useMemo } from 'react';

export type Gradient = { color: string; offset: number }[];

export function useGradient(gradientData: Gradient) {
  const gradient = useMemo(() => {
    const gradientColors = gradientData
      .map(({ color, offset }) => `${color} ${offset}%`)
      .join(',');

    return `linear-gradient(to right, ${gradientColors})`;
  }, [gradientData]);

  return gradient;
}
