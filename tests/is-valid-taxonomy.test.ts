import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { CategoryTaxonomies, isValidTaxonomy } from '../src';

describe('isValidTaxonomy', () => {
  describe('Content Categories V1', () => {
    test('should return true for valid Content V1 categories', () => {
      // Test common IAB content categories that should exist in V1
      assert.equal(isValidTaxonomy('IAB1', CategoryTaxonomies.CONTENT_V1), true);
      assert.equal(isValidTaxonomy('IAB1-1', CategoryTaxonomies.CONTENT_V1), true);
      assert.equal(isValidTaxonomy('IAB2', CategoryTaxonomies.CONTENT_V1), true);
    });

    test('should return false for invalid Content V1 categories', () => {
      assert.equal(isValidTaxonomy('INVALID', CategoryTaxonomies.CONTENT_V1), false);
      assert.equal(isValidTaxonomy('IAB999', CategoryTaxonomies.CONTENT_V1), false);
      assert.equal(isValidTaxonomy('', CategoryTaxonomies.CONTENT_V1), false);
    });
  });

  describe('Content Categories V2', () => {
    test('should return true for valid Content V2 categories', () => {
      assert.equal(isValidTaxonomy('1', CategoryTaxonomies.CONTENT_V2), true);
      assert.equal(isValidTaxonomy('11', CategoryTaxonomies.CONTENT_V2), true);
      assert.equal(isValidTaxonomy('111', CategoryTaxonomies.CONTENT_V2), true);
    });

    test('should return false for invalid Content V2 categories', () => {
      assert.equal(isValidTaxonomy('INVALID', CategoryTaxonomies.CONTENT_V2), false);
      assert.equal(isValidTaxonomy('IAB999', CategoryTaxonomies.CONTENT_V2), false);
    });
  });

  describe('Content Categories V2.1', () => {
    test('should return true for valid Content V2.1 categories', () => {
      assert.equal(isValidTaxonomy('1', CategoryTaxonomies.CONTENT_V2_1), true);
      assert.equal(isValidTaxonomy('11', CategoryTaxonomies.CONTENT_V2_1), true);
    });

    test('should return false for invalid Content V2.1 categories', () => {
      assert.equal(isValidTaxonomy('INVALID', CategoryTaxonomies.CONTENT_V2_1), false);
    });
  });

  describe('Content Categories V2.2', () => {
    test('should return true for valid Content V2.2 categories', () => {
      assert.equal(isValidTaxonomy('12', CategoryTaxonomies.CONTENT_V2_2), true);
      assert.equal(isValidTaxonomy('12', CategoryTaxonomies.CONTENT_V2_2), true);
    });

    test('should return false for invalid Content V2.2 categories', () => {
      assert.equal(isValidTaxonomy('IAB1', CategoryTaxonomies.CONTENT_V2_2), false);
    });
  });

  describe('Content Categories V3', () => {
    test('should return true for valid Content V3 categories', () => {
      assert.equal(isValidTaxonomy('12', CategoryTaxonomies.CONTENT_V3), true);
      assert.equal(isValidTaxonomy('12', CategoryTaxonomies.CONTENT_V3), true);
    });

    test('should return false for invalid Content V3 categories', () => {
      assert.equal(isValidTaxonomy('IAB2', CategoryTaxonomies.CONTENT_V3), false);
    });
    test('should return true for thriller genre (700) which was added in V3.1', () => {
      assert.equal(isValidTaxonomy('700', CategoryTaxonomies.CONTENT_V3), false);
    });
  });

  describe('Content Categories V3.1', () => {
    test('should return true for valid Content V3.1 categories', () => {
      assert.equal(isValidTaxonomy('12', CategoryTaxonomies.CONTENT_V3_1), true);
      assert.equal(isValidTaxonomy('12', CategoryTaxonomies.CONTENT_V3_1), true);
    });

    test('should return false for invalid Content V3.1 categories', () => {
      assert.equal(isValidTaxonomy('INVALID', CategoryTaxonomies.CONTENT_V3_1), false);
    });

    test('should return true for thriller genre (700) which was added in V3.1', () => {
      assert.equal(isValidTaxonomy('700', CategoryTaxonomies.CONTENT_V3_1), true);
    });
  });

  describe('Ad Product Categories V1', () => {
    test('should return true for valid Ad Product V1 categories', () => {
      assert.equal(isValidTaxonomy('190', CategoryTaxonomies.AD_PRODUCT_V1), true);
      assert.equal(isValidTaxonomy('120', CategoryTaxonomies.AD_PRODUCT_V1), true);
    });

    test('should return false for invalid Ad Product V1 categories', () => {
      assert.equal(isValidTaxonomy('INVALID', CategoryTaxonomies.AD_PRODUCT_V1), false);
      assert.equal(isValidTaxonomy('IAB9', CategoryTaxonomies.AD_PRODUCT_V1), false);
    });
  });

  describe('Ad Product Categories V2', () => {
    test('should return true for valid Ad Product V2 categories', () => {
      assert.equal(isValidTaxonomy('1010', CategoryTaxonomies.AD_PRODUCT_V2), true);
      assert.equal(isValidTaxonomy('1200', CategoryTaxonomies.AD_PRODUCT_V2), true);
    });

    test('should return false for invalid Ad Product V2 categories', () => {
      assert.equal(isValidTaxonomy('IAB1', CategoryTaxonomies.AD_PRODUCT_V2), false);
    });
  });

  describe('Audience Categories V1.1', () => {
    test('should return true for valid Audience V1.1 categories', () => {
      assert.equal(isValidTaxonomy('190', CategoryTaxonomies.AUDIENCE_V1_1), true);
      assert.equal(isValidTaxonomy('260', CategoryTaxonomies.AUDIENCE_V1_1), true);
    });

    test('should return false for invalid Audience V1.1 categories', () => {
      assert.equal(isValidTaxonomy('1680', CategoryTaxonomies.AUDIENCE_V1_1), false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty strings', () => {
      assert.equal(isValidTaxonomy('', CategoryTaxonomies.CONTENT_V1), false);
      assert.equal(isValidTaxonomy('', CategoryTaxonomies.AD_PRODUCT_V2), false);
      assert.equal(isValidTaxonomy('', CategoryTaxonomies.AUDIENCE_V1_1), false);
    });

    test('should handle whitespace strings', () => {
      assert.equal(isValidTaxonomy(' ', CategoryTaxonomies.CONTENT_V1), false);
      assert.equal(isValidTaxonomy('\t', CategoryTaxonomies.CONTENT_V2), false);
      assert.equal(isValidTaxonomy('\n', CategoryTaxonomies.CONTENT_V3), false);
    });

    test('should handle numeric strings', () => {
      assert.equal(isValidTaxonomy('123', CategoryTaxonomies.CONTENT_V1), false);
      assert.equal(isValidTaxonomy('0', CategoryTaxonomies.CONTENT_V2), false);
    });

    test('should be case sensitive', () => {
      // Assuming categories are case-sensitive
      assert.equal(isValidTaxonomy('iab1', CategoryTaxonomies.CONTENT_V1), false);
      assert.equal(isValidTaxonomy('Iab1', CategoryTaxonomies.CONTENT_V1), false);
    });
  });
});
