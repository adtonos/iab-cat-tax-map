import { PseudoSet } from '../types';

export const AdCategories10: PseudoSet<string> = {
  has(key: string) {
    const num = parseInt(key);
    return Number.isSafeInteger(num) && num >= 1 && num <= 863;
  },
};
