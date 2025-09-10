import { CategoryTaxonomies, detectTaxonomy, mapCategories } from '../src';

console.log(detectTaxonomy('1'));
console.log(mapCategories('IAB1-1', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2));
console.log(mapCategories('IAB24', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2));
