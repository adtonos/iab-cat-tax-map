import { isValidTaxonomy } from './is-valid-taxonomy';
import { content10ToContent20 } from './maps/content10ToContent20';
import { content10ToProduct20 } from './maps/content10ToProduct20';
import { content20ToContent10 } from './maps/content20ToContent10';
import { product20ToContent10 } from './maps/product20ToContent10';
import { CategoryTaxonomies, CategoryTaxonomy, TaxonomyMapper } from './types';
import { applePodcastToContent22 } from './maps/appleToContent22';
import { ContentCategories20 } from './sets/content-20';

const mappers: Record<CategoryTaxonomy, Map<CategoryTaxonomy, TaxonomyMapper>> = {
  1: new Map(),
  2: new Map(),
  3: new Map(),
  4: new Map(),
  5: new Map(),
  6: new Map(),
  7: new Map(),
  8: new Map(),
  9: new Map(),
  10: new Map(),
};

const identityMapper: TaxonomyMapper = (input) => [input];
const unmappable: TaxonomyMapper = (_input) => [];

const addNewTaxonomyBasedOnOldMappings = (
  targetTax: CategoryTaxonomy,
  baseTax: CategoryTaxonomy,
  alreadyAddedTaxonomies: CategoryTaxonomy[],
  targetToBase: TaxonomyMapper,
  baseToTarget: TaxonomyMapper
) => {
  if (!alreadyAddedTaxonomies.includes(baseTax)) {
    throw new Error(
      `Error while trying to add mapping of "${targetTax}" using "${baseTax}" as base: base is missing in already added taxonomies!`
    );
  }

  mappers[targetTax].set(baseTax, targetToBase);
  mappers[baseTax].set(targetTax, baseToTarget);

  for (const existingTax of alreadyAddedTaxonomies) {
    if (existingTax === baseTax) {
      continue;
    }

    mappers[existingTax].set(targetTax, (existing) => {
      const existingToBase = mappers[existingTax].get(baseTax);
      if (!existingToBase) {
        throw new Error(
          `
Error while trying to add mapping of "${targetTax}" using "${baseTax}" as base:
"${baseTax}" is not valid base as mapping "${existingTax}" -> "${baseTax}" is missing
`
        );
      }
      const bases = existingToBase(existing);
      return bases.flatMap((base) => baseToTarget(base));
    });

    mappers[targetTax].set(existingTax, (target) => {
      const bases = targetToBase(target);
      const baseToExisting = mappers[baseTax].get(existingTax);
      if (!baseToExisting) {
        throw new Error(
          `
Error while trying to add mapping of "${targetTax}" using "${baseTax}" as base:
"${baseTax}" is not valid base as mapping "${baseTax}" -> "${existingTax}" is missing
`
        );
      }
      return bases.flatMap((base) => baseToExisting(base));
    });
  }
};

// Content 1<->2
mappers[CategoryTaxonomies.CONTENT_V1].set(CategoryTaxonomies.CONTENT_V2, content10ToContent20);
mappers[CategoryTaxonomies.CONTENT_V2].set(CategoryTaxonomies.CONTENT_V1, content20ToContent10);

// Apple Podcast <-> V2.2
mappers[CategoryTaxonomies.APPLE_V1].set(CategoryTaxonomies.CONTENT_V2_2, applePodcastToContent22);

// Base every other content category on their relation to 2.0
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.CONTENT_V2_1,
  CategoryTaxonomies.CONTENT_V2,
  [CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2],
  identityMapper,
  identityMapper
);
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.CONTENT_V2_2,
  CategoryTaxonomies.CONTENT_V2,
  [CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V2_1],
  identityMapper,
  identityMapper
);
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.APPLE_V1,
  CategoryTaxonomies.CONTENT_V2_2,
  [
    CategoryTaxonomies.CONTENT_V1,
    CategoryTaxonomies.CONTENT_V2,
    CategoryTaxonomies.CONTENT_V2_1,
    CategoryTaxonomies.CONTENT_V2_2,
  ],
  applePodcastToContent22,
  unmappable
);
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.CONTENT_V3,
  CategoryTaxonomies.CONTENT_V2,
  [
    CategoryTaxonomies.CONTENT_V1,
    CategoryTaxonomies.CONTENT_V2,
    CategoryTaxonomies.CONTENT_V2_1,
    CategoryTaxonomies.CONTENT_V2_2,
    CategoryTaxonomies.APPLE_V1,
  ],
  // NOTE: IAB randomly removed and added some ids, unique ids remained the same...
  (v3) => {
    if (isValidTaxonomy(v3, CategoryTaxonomies.CONTENT_V2)) {
      return [v3];
    }
    return [];
  },
  (v2) => {
    if (isValidTaxonomy(v2, CategoryTaxonomies.CONTENT_V3)) {
      return [v2];
    }
    return [];
  }
);
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.CONTENT_V3_1,
  CategoryTaxonomies.CONTENT_V3,
  [
    CategoryTaxonomies.CONTENT_V1,
    CategoryTaxonomies.CONTENT_V2,
    CategoryTaxonomies.CONTENT_V2_1,
    CategoryTaxonomies.CONTENT_V2_2,
    CategoryTaxonomies.APPLE_V1,
    CategoryTaxonomies.CONTENT_V3,
  ],
  (v3_1) => {
    // NOTE: the only difference is in "thriller" genre, which has id 700
    if (v3_1 === '700') {
      return [];
    }
    return [v3_1];
  },
  identityMapper
);
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.AD_PRODUCT_V2,
  CategoryTaxonomies.CONTENT_V1,
  [
    CategoryTaxonomies.CONTENT_V1,
    CategoryTaxonomies.CONTENT_V2,
    CategoryTaxonomies.CONTENT_V2_1,
    CategoryTaxonomies.CONTENT_V2_2,
    CategoryTaxonomies.APPLE_V1,
    CategoryTaxonomies.CONTENT_V3,
    CategoryTaxonomies.CONTENT_V3_1,
  ],
  product20ToContent10,
  content10ToProduct20
);

/*
TODO: product mappings are broken because of low quality source used
it should be fixed in the future
addNewTaxonomyBasedOnOldMappings(
  CategoryTaxonomies.AD_PRODUCT_V1,
  CategoryTaxonomies.AD_PRODUCT_V2,
  [CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V2_1, CategoryTaxonomies.CONTENT_V2_2, CategoryTaxonomies.CONTENT_V3, CategoryTaxonomies.CONTENT_V3_1, CategoryTaxonomies.AD_PRODUCT_V2],
  product10ToProduct20,
  product20ToProduct10,
);
*/
// Until we fix the issue we consider them unmappable
for (const tax of Object.values(CategoryTaxonomies)) {
  mappers[tax].set(CategoryTaxonomies.AD_PRODUCT_V1, unmappable);
  mappers[CategoryTaxonomies.AD_PRODUCT_V1].set(tax, unmappable);
}

// NOTE: Audience categories are unmappable to anything but audience categories
for (const tax of Object.values(CategoryTaxonomies)) {
  mappers[tax].set(CategoryTaxonomies.AUDIENCE_V1_1, unmappable);
  mappers[CategoryTaxonomies.AUDIENCE_V1_1].set(tax, unmappable);
}

export function mapCategory(input: string, inputTax: CategoryTaxonomy, outputTax: CategoryTaxonomy): string[] {
  if (inputTax === outputTax) {
    return [input];
  }
  const mapper = mappers[inputTax].get(outputTax);
  if (!mapper) {
    throw new Error(`Bug: mapper is not defined for "${inputTax}" -> "${outputTax}"`);
  }
  return mapper(input);
}
