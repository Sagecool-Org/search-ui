---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/guides-conditional-facets.html
applies_to:
  stack:
  serverless:
---

# Conditional Facets [guides-conditional-facets]

Search UI has the ability to conditionally show facets based on the filters selected. This is useful for showing facets that are only relevant to certain filters.

To use, add a `conditionalFacets` property to the configuration object. This property is a map of facet field names and a function to determine whether or not the facet should be shown.

```js
{
  conditionalFacets: {
    'category': ({ filters }) => {
      return filters.some(filter => filter.field === 'category' && filter.value === 'books');
    }
  }
}
```

## Examples [guides-conditional-facets-examples]

### Filter Not Selected Example [guides-conditional-facets-filter-not-selected-example]

Returns true if the filter is not selected.

Example below is do not show the category facet if a category filter has been applied.

```javascript
  function FilterNotSelected(fieldName: string, value?: string) {
    return ({ filters }) => {
      return !filters.some(
        (f) => f.field === fieldName && (!value || f.values.includes(value))
      );
    };
  }

// configuration

  conditionalFacets: {
    'category': FilterNotSelected('category')
  }
```

Can also be scoped to a particular value of a filter.

```javascript
  conditionalFacets: {
    'category': FilterNotSelected('category', 'books')
  }
```

### Filter Is Selected [guides-conditional-facets-filter-is-selected]

Returns true if the filter is selected.

Example below is show the shoe size facet if the shoes category filter has been applied.

```javascript
function FilterIsSelected(fieldName: string, value?: string) {
  return ({ filters }) => {
    return filters.some(
      (f) => f.field === fieldName && (!value || f.values.includes(value))
    );
  };
}

  conditionalFacets: {
    'shoe_size': FilterIsSelected('category', 'Shoes')
  }
```
