import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pairwise<T>(array: Array<T>) {
  const result: Array<[T, T]> = [];

  for (let i = 0; i < array.length - 1; i++) {
    result.push([array[i], array[i + 1]]);
  }

  return result;
}

export function percent(value: number, total: number) {
  if (total === 0) return 0;

  return value / total;
}

export const TERM_TO_ID = { fall: 2, winter: 0, summer: 1 };
