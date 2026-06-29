import { AdCategories10 } from './sets/ad-10';
import { AdCategories20 } from './sets/ad-20';
import { AudienceCategories11 } from './sets/audience-11';
import { ContentCategories10 } from './sets/content-10';
import { ContentCategories20 } from './sets/content-20';
import { ContentCategories21 } from './sets/content-21';
import { ContentCategories22 } from './sets/content-22';
import { ContentCategories30 } from './sets/content-30';
import { ContentCategories31 } from './sets/content-31';
import { CategoryTaxonomies, CategoryTaxonomy } from './types';

// @returns true if value is valid in given taxonomy
export function isValidTaxonomy(category: string, tax: CategoryTaxonomy): boolean {
  switch (tax) {
    case CategoryTaxonomies.CONTENT_V1:
      return ContentCategories10.has(category);
    case CategoryTaxonomies.CONTENT_V2:
      return ContentCategories20.has(category);
    case CategoryTaxonomies.CONTENT_V2_1:
      return ContentCategories21.has(category);
    case CategoryTaxonomies.CONTENT_V2_2:
      return ContentCategories22.has(category);
    case CategoryTaxonomies.CONTENT_V3:
      return ContentCategories30.has(category);
    case CategoryTaxonomies.AD_PRODUCT_V1:
      return AdCategories10.has(category);
    case CategoryTaxonomies.AD_PRODUCT_V2:
      return AdCategories20.has(category);
    case CategoryTaxonomies.AUDIENCE_V1_1:
      return AudienceCategories11.has(category);
    case CategoryTaxonomies.CONTENT_V3_1:
      return ContentCategories31.has(category);
    case CategoryTaxonomies.APPLE_V1:
      return false; // @TODO
  }
}
