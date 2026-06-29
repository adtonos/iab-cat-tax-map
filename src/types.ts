export const CategoryTaxonomies = {
  CONTENT_V1: 1,
  CONTENT_V2: 2,
  AD_PRODUCT_V1: 3,
  AUDIENCE_V1_1: 4,
  CONTENT_V2_1: 5,
  CONTENT_V2_2: 6,
  CONTENT_V3: 7,
  AD_PRODUCT_V2: 8,
  CONTENT_V3_1: 9,
  APPLE_V1: 10,
} as const;
export type CategoryTaxonomy = (typeof CategoryTaxonomies)[keyof typeof CategoryTaxonomies];

// NOTE: Sometimes it is more efficient to use heuristics instead of Set
export interface PseudoSet<K> {
  has(key: K): boolean;
}

// @returns null when input does not map to the taxonomy
export type TaxonomyMapper = (input: string) => string | null;
