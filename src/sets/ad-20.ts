import { PseudoSet } from '../types';

export const AdCategories20: PseudoSet<string> = {
  has(key: string) {
    const num = parseInt(key);
    return Number.isSafeInteger(num) && num >= 1000 && num <= 1582;
  },
};
