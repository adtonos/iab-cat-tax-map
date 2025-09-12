import { CategoryTaxonomies, detectTaxonomy, mapCategory } from '../src';

console.log(detectTaxonomy('1'));
console.log(mapCategory('IAB1-1', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2));
console.log(mapCategory('IAB24', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2));
