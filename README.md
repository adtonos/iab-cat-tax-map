# IAB Category Taxonomy Mapper

A comprehensive TypeScript library for working with Interactive Advertising Bureau (IAB) category taxonomies. This library provides robust functionality to detect, validate, and map categories across different versions of IAB taxonomies, including Content Categories, Ad Product Categories, and Audience Categories.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Taxonomies](#supported-taxonomies)
- [API Reference](#api-reference)
  - [detectTaxonomy](#detecttaxonomy)
  - [isValidTaxonomy](#isvalidtaxonomy)
  - [mapCategory](#mapcategories)
- [Architecture](#architecture)
- [Mapping Strategy](#mapping-strategy)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Limitations](#limitations)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Interactive Advertising Bureau (IAB) maintains several category taxonomies used for content and advertisement classification in digital advertising. Over time, these taxonomies have evolved through multiple versions, creating compatibility challenges when working with different systems that may use different taxonomy versions.

This library solves these challenges by providing:

- **Taxonomy Detection**: Automatically identify which taxonomy version(s) a category belongs to
- **Category Validation**: Verify if a category ID is valid within a specific taxonomy
- **Cross-Taxonomy Mapping**: Convert categories between different taxonomy versions
- **Comprehensive Coverage**: Support for all major IAB taxonomy versions

## Installation

```bash
npm install @adtonos/iab-cat-tax-map
```

```bash
yarn add @adtonos/iab-cat-tax-map
```

```bash
pnpm add @adtonos/iab-cat-tax-map
```

## Quick Start

```typescript
import { detectTaxonomy, isValidTaxonomy, mapCategory, CategoryTaxonomies } from '@adtonos/iab-cat-tax-map';

// Detect which taxonomies a category belongs to
const taxonomies = detectTaxonomy('IAB1');
console.log(taxonomies); // [1] - Content v1.0

// Validate a category against a specific taxonomy
const isValid = isValidTaxonomy('IAB1-1', CategoryTaxonomies.CONTENT_V2);
console.log(isValid); // false

// Map a category from one taxonomy to another
const mapped = mapCategory('IAB1-1', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2);
console.log(mapped); // '42'
```

## Supported Taxonomies

This library supports the following IAB category taxonomies, their assigned enum values directly correspond to [IAB OpenRTB spec](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list_categorytaxonomies):

### Content Categories
- **Content v1.0** (`CONTENT_V1` = 1): Original IAB Content Category taxonomy
- **Content v2.0** (`CONTENT_V2` = 2): Updated content categories with expanded classifications
- **Content v2.1** (`CONTENT_V2_1` = 5): Minor revision of v2.0
- **Content v2.2** (`CONTENT_V2_2` = 6): Further refinements to content categories
- **Content v3.0** (`CONTENT_V3` = 7): Major revision with category changes
- **Content v3.1** (`CONTENT_V3_1` = 9): Latest content category taxonomy

### Ad Product Categories
- **Ad Product v1.0** (`AD_PRODUCT_V1` = 3): Original product/service categories for advertising
- **Ad Product v2.0** (`AD_PRODUCT_V2` = 8): Updated product taxonomy

### Audience Categories
- **Audience v1.1** (`AUDIENCE_V1_1` = 4): Demographic and interest-based audience categories

## API Reference

### detectTaxonomy

Identifies which taxonomy versions a given category belongs to.

```typescript
function detectTaxonomy(category: string): CategoryTaxonomy[]
```

**Parameters:**
- `category` (string): The category ID to analyze

**Returns:**
- Array of `CategoryTaxonomy` values representing all taxonomies that contain this category

**Example:**
```typescript
const taxonomies = detectTaxonomy('IAB1-1');
// Returns: [1, 2, 5, 6, 7, 9] - found in multiple content taxonomies
```

### isValidTaxonomy

Validates whether a category exists in a specific taxonomy.

```typescript
function isValidTaxonomy(category: string, taxonomy: CategoryTaxonomy): boolean
```

**Parameters:**
- `category` (string): The category ID to validate
- `taxonomy` (CategoryTaxonomy): The taxonomy to check against

**Returns:**
- `true` if the category exists in the specified taxonomy, `false` otherwise

**Example:**
```typescript
const isValid = isValidTaxonomy('IAB1-1', CategoryTaxonomies.CONTENT_V3);
// Returns: false because 'IAB1-1' does not exist in Content v3.0 taxonomy
```

### mapCategory

Maps a category from one taxonomy to another.

```typescript
function mapCategory(
  input: string,
  inputTax: CategoryTaxonomy,
  outputTax: CategoryTaxonomy
): string | null
```

**Parameters:**
- `input` (string): The category ID to map
- `inputTax` (CategoryTaxonomy): Source taxonomy
- `outputTax` (CategoryTaxonomy): Target taxonomy

**Returns:**
- Mapped category ID as a string, or `null` if no mapping exists

**Example:**
```typescript
const mapped = mapCategory('IAB1', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2);
// Returns: '42'
const unappable = mapCategory('trash', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2);
// Returns: null
```

## Architecture

The library is built around a flexible mapping system that supports bidirectional conversions between taxonomies:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Content v1.0  │◄──►│   Content v2.0   │◄──►│   Content v2.1  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Ad Product    │    │   Content v3.0   │    │   Content v2.2  │
│      v2.0       │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

1. **Category Sets**: Pre-defined sets containing all valid categories for each taxonomy version
2. **Mapping Functions**: Specialized functions that handle conversion logic between specific taxonomy pairs
3. **Dynamic Mapper Generator**: Automatically creates mapping chains for indirect conversions
4. **Validation Layer**: Ensures category validity before attempting mappings

## Mapping Strategy

The library uses a sophisticated mapping strategy that handles both direct and indirect conversions:

### Direct Mappings
For taxonomy pairs with explicit mapping definitions:
- Content v1.0 ↔ Content v2.0
- Content v1.0 ↔ Ad Product v2.0

### Identity Mappings
For taxonomies that share identical category structures:
- Content v2.0 ↔ Content v2.1 ↔ Content v2.2

### Chain Mappings
For indirect conversions through intermediate taxonomies:
- Content v1.0 → Content v2.0 → Content v3.0

### Validation-Based Mappings
For taxonomies with overlapping but not identical category sets:
- Content v2.0 ↔ Content v3.0 (validates existence before mapping)
- Content v3.0 ↔ Content v3.1 (handles specific exclusions like "thriller" genre)

## Usage Examples

### Basic Category Detection and Validation

```typescript
import { detectTaxonomy, isValidTaxonomy, CategoryTaxonomies } from '@adtonos/iab-cat-tax-map';

// Check if a category exists across multiple taxonomies
const category = 'IAB12-3';
const possibleTaxonomies = detectTaxonomy(category);

for (const taxonomy of possibleTaxonomies) {
  console.log(`Category ${category} exists in taxonomy ${taxonomy}`);

  const isValid = isValidTaxonomy(category, taxonomy);
  console.log(`Validation result: ${isValid}`);
}
```

### Cross-Taxonomy Category Mapping

```typescript
import { mapCategory, CategoryTaxonomies } from '@adtonos/iab-cat-tax-map';

// Map from Content v1.0 to Content v2.0
const sourceCategory = 'IAB1-1';
const mappedCategory = mapCategory(
  sourceCategory,
  CategoryTaxonomies.CONTENT_V1,
  CategoryTaxonomies.CONTENT_V2
);

if (mappedCategory) {
  console.log(`${sourceCategory} maps to ${mappedCategory}`);
} else {
  console.log(`No mapping available for ${sourceCategory}`);
}
```

### Batch Category Processing

```typescript
import { detectTaxonomy, mapCategory, CategoryTaxonomies } from '@adtonos/iab-cat-tax-map';

const categories = ['IAB1', 'IAB2-1', 'IAB12-3', 'IAB20'];

const processCategoryBatch = (categories: string[]) => {
  return categories.map(category => {
    const taxonomies = detectTaxonomy(category);

    // Try to map to Content v3.0 if possible
    if (taxonomies.includes(CategoryTaxonomies.CONTENT_V1)) {
      const mapped = mapCategory(
        category,
        CategoryTaxonomies.CONTENT_V1,
        CategoryTaxonomies.CONTENT_V3
      );

      return {
        original: category,
        taxonomies,
        mappedToV3: mapped
      };
    }

    return {
      original: category,
      taxonomies,
      mappedToV3: null
    };
  });
};

const results = processCategoryBatch(categories);
console.log(results);
```

### Working with Ad Product Categories

```typescript
import { mapCategory, isValidTaxonomy, CategoryTaxonomies } from '@adtonos/iab-cat-tax-map';

const productCategory = 'IAB13-1';

// Verify category exists in Ad Product v2.0
if (isValidTaxonomy(productCategory, CategoryTaxonomies.AD_PRODUCT_V2)) {
  // Map to Content v1.0 for content targeting
  const contentCategory = mapCategory(
    productCategory,
    CategoryTaxonomies.AD_PRODUCT_V2,
    CategoryTaxonomies.CONTENT_V1
  );

  if (contentCategory) {
    console.log(`Product category ${productCategory} maps to content category ${contentCategory}`);
  }
}
```

## Error Handling

If only known and valid taxonomy is passed the functions should never throw it is so that they can be used in possibly high throughput situations.
That is why, one should handle non-happy paths of the functions:

```typescript
const taxonomies = detectTaxonomy('foo');
console.log(taxonomies); // [] - no known taxonomy contains "foo" as valid category

const mappedCategory = mapCategory('IAB24', CategoryTaxonomies.CONTENT_V1, CategoryTaxonomies.CONTENT_V2);
console.log(mappedCategory); // null - IAB24 is unmappable to Content Category v2.0
```

## Limitations

### Current Known Limitations

1. **Ad Product v1.0 Mappings**: Currently unmappable due to low-quality source data
   ```typescript
   // These mappings will always return null
   const result = mapCategory('category', CategoryTaxonomies.AD_PRODUCT_V1, CategoryTaxonomies.CONTENT_V1);
   // Returns: null
   ```

2. **Audience Category Isolation**: Audience categories cannot be mapped to/from other taxonomy types
   ```typescript
   // Audience categories are isolated
   const result = mapCategory('audienceCategory', CategoryTaxonomies.AUDIENCE_V1_1, CategoryTaxonomies.CONTENT_V1);
   // Returns: null
   ```

3. **Lossy Mappings**: Some mappings may be lossy due to taxonomy structural differences
   - Content v3.1 excludes the "thriller" genre (ID: 700) present in v3.0
   - Some categories present in newer taxonomies may not have equivalents in older versions

### Possible Improvements

Here are possible improvements in the future (in the order of the most likely to least likely):
- Fix Ad Product v1.0 mappings with higher quality source data
- Extend testing
- Add special functionalities to define custom taxonomies and mappings between other
- Implement fuzzy matching for similar categories across taxonomies

## Development

### Prerequisites

- Node.js 24.6.0+ (managed via Volta)
- TypeScript 5.9.2+

### Setup

```bash
# Clone the repository
git clone git@github.com:adtonos/iab-cat-tax-map.git
cd @adtonos/iab-cat-tax-map

# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```

### Project Structure

```
src/
├── index.ts              # Main exports
├── types.ts              # TypeScript definitions
├── detect-taxonomy.ts    # Taxonomy detection logic
├── is-valid-taxonomy.ts  # Category validation
├── map-categories.ts     # Core mapping functionality
├── maps/                 # Specific taxonomy mapping functions
│   ├── content10ToContent20.ts
│   ├── content10ToProduct20.ts
│   ├── content20ToContent10.ts
│   └── product20ToContent10.ts
└── sets/                 # Category sets for each taxonomy
    ├── content-10.ts
    ├── content-20.ts
    ├── content-21.ts
    ├── content-22.ts
    ├── content-30.ts
    ├── content-31.ts
    ├── ad-10.ts
    ├── ad-20.ts
    └── audience-11.ts
```

### Code Quality

The project uses several tools to maintain code quality:

- **TypeScript**: Static type checking
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit linting

### Testing

```bash
# Run all tests using native Node.js test runner
npm test
```

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Write tests** for any new functionality
3. **Ensure code quality** by running the linter and formatter
4. **Update documentation** for any API changes
5. **Submit a pull request** with a clear description of changes

### Adding New Taxonomy Support

To add support for a new taxonomy version:

1. Create a new category set in `src/sets/`
2. Add the taxonomy constant to `types.ts`
3. Update `detect-taxonomy.ts` and `is-valid-taxonomy.ts`
4. Create mapping functions in `src/maps/` if needed
5. Update `map-categories.ts` to include the new mappings

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Maintained by AdTonos**

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/adtonos/iab-cat-tax-map).
