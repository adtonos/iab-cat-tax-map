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

export function detectTaxonomy(category: string): CategoryTaxonomy[] {
  const possibleTaxonomies: CategoryTaxonomy[] = [];
  if (ContentCategories10.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.CONTENT_V1);
  }
  if (ContentCategories20.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.CONTENT_V2);
  }
  if (ContentCategories21.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.CONTENT_V2_1);
  }
  if (ContentCategories22.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.CONTENT_V2_2);
  }
  if (ContentCategories30.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.CONTENT_V3);
  }
  if (ContentCategories31.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.CONTENT_V3_1);
  }
  if (AudienceCategories11.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.AUDIENCE_V1_1);
  }
  if (AdCategories10.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.AD_PRODUCT_V1);
  }
  if (AdCategories20.has(category)) {
    possibleTaxonomies.push(CategoryTaxonomies.AD_PRODUCT_V2);
  }
  return possibleTaxonomies;
}
