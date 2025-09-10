import { PseudoSet } from '../types';

export const ContentCategories20: PseudoSet<string> = {
  has(key: string) {
    const num = parseInt(key);
    // content cat 2.0 ids are simply numbers from 1 to 1480
    return Number.isSafeInteger(num) && num >= 1 && num <= 1480;
  },
};
