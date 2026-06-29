import { strict as assert } from 'node:assert';
import { test, describe } from 'node:test';
import { isValidTaxonomy, detectTaxonomy, CategoryTaxonomies } from '../src';

describe('detectTaxonomy', () => {
  describe('Multi-taxonomy categories', () => {
    test('should detect categories present in multiple content taxonomies', () => {
      // Common categories that likely exist across multiple content taxonomies
      const taxonomies = detectTaxonomy('12');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');
      assert.ok(taxonomies.length >= 1, 'Should find the taxonomies');

      // Check if it includes expected content taxonomies
      if (taxonomies.includes(CategoryTaxonomies.CONTENT_V2)) {
        assert.ok(
          taxonomies.includes(CategoryTaxonomies.CONTENT_V2_1),
          'If in V2, should also be in V2_1 based on mapping logic'
        );
      }
    });

    test('should detect subcategories in multiple taxonomies', () => {
      const taxonomies = detectTaxonomy('IAB1-1');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');
      assert.ok(taxonomies.length === 1, 'Should return valid array');
      assert.strictEqual(taxonomies[0], CategoryTaxonomies.CONTENT_V1);
    });
  });

  describe('Single taxonomy categories', () => {
    test('should detect audience-specific categories', () => {
      const taxonomies = detectTaxonomy('1679');
      assert.ok(taxonomies.length > 0);
      // If this category exists, it should only be in audience taxonomy
      const hasAudience = taxonomies.includes(CategoryTaxonomies.AUDIENCE_V1_1);
      assert.ok(hasAudience);
    });

    test('should detect apple categories', () => {
      const taxonomies = detectTaxonomy('Comedy');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');

      const isValidTaxonomy = taxonomies.some((tax) => tax === CategoryTaxonomies.APPLE_V2);

      assert.ok(isValidTaxonomy);

      assert.ok(taxonomies.length > 0, 'Should detect at least one taxonomy');
    });
  });
  describe('Single taxonomy categories', () => {
    test('should detect audience-specific categories', () => {
      const taxonomies = detectTaxonomy('1679');
      assert.ok(taxonomies.length > 0);
      // If this category exists, it should only be in audience taxonomy
      const hasAudience = taxonomies.includes(CategoryTaxonomies.AUDIENCE_V1_1);
      assert.ok(hasAudience);
    });

    test('should detect ad product specific categories', () => {
      const taxonomies = detectTaxonomy('190');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');

      // Check if detected in ad product taxonomies
      const hasAdProduct = taxonomies.some((tax) => tax === CategoryTaxonomies.AD_PRODUCT_V1);

      assert.ok(hasAdProduct);

      assert.ok(taxonomies.length > 0, 'Should detect at least one taxonomy');
    });
  });

  describe('Invalid categories', () => {
    test('should return empty array for completely invalid categories', () => {
      const taxonomies = detectTaxonomy('COMPLETELY_INVALID');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');
      assert.equal(taxonomies.length, 0, 'Should return empty array for invalid category');
    });

    test('should return empty array for empty string', () => {
      const taxonomies = detectTaxonomy('');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');
      assert.equal(taxonomies.length, 0, 'Should return empty array for empty string');
    });

    test('should return empty array for numeric strings that are not valid', () => {
      const taxonomies = detectTaxonomy('999999');
      assert.ok(Array.isArray(taxonomies), 'Should return an array');
      assert.equal(taxonomies.length, 0, 'Should return empty array for invalid numeric string');
    });
  });

  describe('Edge cases', () => {
    test('should handle whitespace-only strings', () => {
      assert.deepEqual(detectTaxonomy(' '), []);
      assert.deepEqual(detectTaxonomy('\t'), []);
      assert.deepEqual(detectTaxonomy('\n'), []);
      assert.deepEqual(detectTaxonomy('  '), []);
    });

    test('should handle special characters', () => {
      assert.deepEqual(detectTaxonomy('IAB1@'), []);
      assert.deepEqual(detectTaxonomy('IAB1#'), []);
      assert.deepEqual(detectTaxonomy('IAB1$'), []);
    });

    test('should handle very long strings', () => {
      const longString = 'IAB1' + 'x'.repeat(1000);
      const taxonomies = detectTaxonomy(longString);
      assert.ok(Array.isArray(taxonomies), 'Should return an array');
      assert.equal(taxonomies.length, 0, 'Should not find taxonomies for very long invalid strings');
    });

    test('should return unique taxonomy IDs only', () => {
      // Test with a category that might exist in multiple taxonomies
      const taxonomies = detectTaxonomy('12');
      const uniqueTaxonomies = [...new Set(taxonomies)];
      assert.deepEqual(taxonomies, uniqueTaxonomies, 'Should not return duplicate taxonomy IDs');
    });
  });

  describe('Consistency with isValidTaxonomy', () => {
    test('categories detected by detectTaxonomy should be valid in those taxonomies', () => {
      const testCategories = ['IAB1', 'IAB1-1', 'IAB2', 'IAB13', 'IAB25', '12'];

      for (const category of testCategories) {
        const detectedTaxonomies = detectTaxonomy(category);

        for (const taxonomy of detectedTaxonomies) {
          assert.equal(
            isValidTaxonomy(category, taxonomy),
            true,
            `Category ${category} detected in taxonomy ${taxonomy} should be valid when checked with isValidTaxonomy`
          );
        }
      }
    });

    test('categories not detected should not be valid in any taxonomy', () => {
      const invalidCategory = 'DEFINITELY_INVALID_CATEGORY';
      const detectedTaxonomies = detectTaxonomy(invalidCategory);

      assert.equal(detectedTaxonomies.length, 0, 'Should not detect any taxonomies for invalid category');

      // Check that it's invalid in all taxonomies
      for (const taxonomy of Object.values(CategoryTaxonomies)) {
        assert.equal(
          isValidTaxonomy(invalidCategory, taxonomy),
          false,
          `Invalid category should not be valid in taxonomy ${taxonomy}`
        );
      }
    });
  });

  describe('Return value validation', () => {
    test('should always return an array', () => {
      const testCases = ['IAB1', 'INVALID', '', ' ', '123', 'IAB1-1'];

      for (const testCase of testCases) {
        const result = detectTaxonomy(testCase);
        assert.ok(Array.isArray(result), `detectTaxonomy('${testCase}') should return an array`);
      }
    });

    test('should return only valid CategoryTaxonomy values', () => {
      const validTaxonomyValues = Object.values(CategoryTaxonomies);
      const testCategories = ['IAB1', 'IAB2', 'IAB13', 'IAB25'];

      for (const category of testCategories) {
        const taxonomies = detectTaxonomy(category);

        for (const taxonomy of taxonomies) {
          assert.ok(
            validTaxonomyValues.includes(taxonomy),
            `Detected taxonomy ${taxonomy} for category ${category} should be a valid CategoryTaxonomy value`
          );
        }
      }
    });
  });
});
