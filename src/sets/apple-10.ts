import { appleToContent22mapping } from '../maps/appleToContent22';

export const AppleCategories = new Set<string>(Object.keys(appleToContent22mapping));

export function isAppleCategory(category?: string | null): boolean {
  if (!category) {
    return false;
  }
  return AppleCategories.has(category.trim().toLowerCase());
}
