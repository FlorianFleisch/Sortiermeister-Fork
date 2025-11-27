import type { ColorConfig } from '@/types';

export const COLOR_PALETTE: ColorConfig[] = [
  { bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #FF8E72 0%, #FF7043 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #FFD93D 0%, #FFCA3D 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #6BCB77 0%, #4CAF50 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #4FB3D9 0%, #00BCD4 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)', text: '#fff' },
];

export const getColor = (num: number): ColorConfig => {
  return COLOR_PALETTE[(num - 1) % COLOR_PALETTE.length];
};

export const generateUniqueNumbers = (count: number, max: number = 49): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers);
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
