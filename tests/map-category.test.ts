import { describe, it } from 'node:test';
import { CategoryTaxonomies, CategoryTaxonomy } from '../src/types';
import { mapCategory } from '../src/map-category';
import assert from 'node:assert/strict';

describe('mapCategory', () => {
  it('should cover all possible taxonomy combination', () => {
    // @TODO this might need rework at one point
    // lets ignore mapping to apple from different stuff than v1
    // cause we dont need that for now as we always use only v2.2
    // as input
    for (const taxFrom of Object.values(CategoryTaxonomies).filter((x) => x !== CategoryTaxonomies.APPLE_V1)) {
      for (const taxTo of Object.values(CategoryTaxonomies).filter((x) => x !== CategoryTaxonomies.APPLE_V1)) {
        // if mapper is not defined it will throw
        mapCategory('foo', taxFrom, taxTo);
      }
    }

    mapCategory('foo', CategoryTaxonomies.APPLE_V1, CategoryTaxonomies.CONTENT_V2_2);
  });

  it('should map between taxonomies if possible', () => {
    const inputs: [string, CategoryTaxonomy, CategoryTaxonomy, string | null][] = [
      ['1', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V1, 'IAB2'], // Automotive -> Automotive
      ['32', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V1, 'IAB2-1'], // Auto Parts -> Auto Parts
      ['42', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V1, 'IAB1-1'], // Books and Literature -> Books & Literature
      ['603', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V1, 'IAB19-1'], // 3-D Graphics -> 3-D Graphics

      // Content Taxonomy v1 to v2.1 mappings
      ['IAB2', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2_1, '1'], // Automotive mapping to v2.1
      ['IAB1-1', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2_1, '42'], // Books mapping to v2.1
      ['IAB19', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2_1, '596'], // Technology & Computing

      // Content Taxonomy v2 to v2.1 mappings (should be mostly 1:1)
      ['1', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V2_1, '1'], // Automotive
      ['42', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V2_1, '42'], // Books and Literature
      ['596', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V2_1, '596'], // Technology & Computing

      // Content Taxonomy v2.1 to v2.2 (minor version updates)
      ['1', CategoryTaxonomies.CONTENT_V2_1, CategoryTaxonomies.CONTENT_V2_2, '1'], // Automotive
      ['596', CategoryTaxonomies.CONTENT_V2_1, CategoryTaxonomies.CONTENT_V2_2, '596'], // Technology & Computing

      // Content Taxonomy v3 mappings (latest version)
      ['1', CategoryTaxonomies.CONTENT_V2_2, CategoryTaxonomies.CONTENT_V3, '1'], // Automotive
      ['596', CategoryTaxonomies.CONTENT_V2_2, CategoryTaxonomies.CONTENT_V3, '596'], // Technology & Computing

      // Content Taxonomy v3 to v3.1 (current latest)
      ['1', CategoryTaxonomies.CONTENT_V3, CategoryTaxonomies.CONTENT_V3_1, '1'], // Automotive
      ['596', CategoryTaxonomies.CONTENT_V3, CategoryTaxonomies.CONTENT_V3_1, '596'], // Technology & Computing

      // Ad Product Taxonomy mappings (separate taxonomy system)
      ['190', CategoryTaxonomies.AD_PRODUCT_V1, CategoryTaxonomies.AD_PRODUCT_V2, null], // Consumer Electronics
      ['109', CategoryTaxonomies.AD_PRODUCT_V1, CategoryTaxonomies.AD_PRODUCT_V2, null], // Automotive services
      ['648', CategoryTaxonomies.AD_PRODUCT_V1, CategoryTaxonomies.AD_PRODUCT_V2, null], // Food & Beverage services

      // Cross-taxonomy mappings (Content to Ad Product)
      ['IAB2', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.AD_PRODUCT_V2, '1551'], // Automotive content to vehicles
      ['IAB8', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.AD_PRODUCT_V2, '1355'], // Food content to food and beverage services ads
      ['IAB19', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.AD_PRODUCT_V2, '1097'], // consumer electronics

      // Audience Taxonomy mappings
      [
        'demographic_age_18_24',
        CategoryTaxonomies.AUDIENCE_V1_1,
        CategoryTaxonomies.AUDIENCE_V1_1,
        'demographic_age_18_24',
      ], // Same version mapping
      ['demographic_age_18_24', CategoryTaxonomies.AUDIENCE_V1_1, CategoryTaxonomies.AD_PRODUCT_V2, null], // something else ends up being null

      // Unmappable categories (should return null)
      ['IAB25', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, null], // Non-Standard Content (deprecated)
      ['IAB26', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, null], // Illegal Content (deprecated)
      ['invalid_category', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, null], // Invalid category
      ['IAB999', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, null], // Non-existent category

      // Edge cases - same taxonomy version (should return same value)
      ['IAB2', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V1, 'IAB2'], // Same version mapping
      ['1', CategoryTaxonomies.CONTENT_V2, CategoryTaxonomies.CONTENT_V2, '1'], // Same version mapping
      ['596', CategoryTaxonomies.CONTENT_V3_1, CategoryTaxonomies.CONTENT_V3_1, '596'], // Same version mapping

      // Complex hierarchical mappings (tier 2 and 3 categories)
      ['IAB2-20', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, '4'], // Sedan -> Sedan
      ['IAB19-5', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, '633'], // Cameras & Camcorders -> Cameras and Camcorders
      ['IAB7-1', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, '225'], // Exercise -> Fitness and Exercise
      ['IAB17-12', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2, '484'], // Football -> American Football
    ];
    for (const [inputString, inputTax, outputTax, expectedOutput] of inputs) {
      assert.strictEqual(
        mapCategory(inputString, inputTax, outputTax),
        expectedOutput,
        `Failed to convert from ${inputTax} to ${outputTax} category "${inputString}"`
      );
    }
  });

  it('unknown taxonomy results in runtime error', () => {
    assert.throws(() => mapCategory('foo', 14 as CategoryTaxonomy, 2));
    assert.throws(() => mapCategory('foo', 2, 14 as CategoryTaxonomy));
  });
});
