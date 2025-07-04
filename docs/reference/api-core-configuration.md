---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/api-core-configuration.html
applies_to:
  stack:
  serverless:
---

# Configuration [api-core-configuration]

Search UI uses a configuration object to tailor search to your needs. It consists of three parts:

- Search query
- Autocomplete query
- Event hooks

See below for details on each part.

See [React API](/reference/api-react-search-provider.md) page for more information on how to use the configuration with the SearchProvider.

## Search Query (QueryConfig) [api-core-configuration-search-query-queryconfig]

This is the configuration for the main search query. Some of these configuration options are not supported by some connectors. Each connector will document the options that are not supported.

```js
searchQuery: {
  filters: [{ field: "world_heritage_site", values: ["true"] }],
  facets: {
    states: { type: "value", size: 30 },
  }
  fuzziness: true,
  disjunctiveFacets: ["states"], // Array of field names to use for disjunctive searches
  disjunctiveFacetsAnalyticsTags: ["Ignore"],
  conditionalFacets: {},
  search_fields: {
    title: {},
    description: {}
  },
  result_fields: {
    title: {
      snippet: {
        size: 100,
        fallback: true
      }
    },
    nps_link: {
      raw: {}
    }
  }
}
```

### Filters (Global Filters) [api-core-configuration-filters-global-filters]

Using Query Config, it is possible to create "Global" filters. "Global filters" are filters that are added to every query. The user has no control over whether or not this filter is added or removed, it doesn’t show up in the query string, and is completely transparent to the user. It is applied IN ADDITION to filters which the user applies.

```js
filters: [
  // value filter example
  { field: "world_heritage_site", values: ["true"] },
  // Range filter example
  {
    field: "acres",
    values: [
      {
        from: 0,
        to: 1000,
        name: "Small"
      }
    ]
  }
];
```

### Facets [api-core-configuration-facets]

Tells Search UI to fetch facet data that can be used with Facet Components.

```js
  facets: {
    // example of a value facet
    states: { type: "value", size: 30 },

    // example of a numeric range facet
    acres: {
      type: "range",
      ranges: [
        { from: -1, name: "Any" },
        { from: 0, to: 1000, name: "Small" },
        { from: 1001, to: 100000, name: "Medium" },
        { from: 100001, name: "Large" },
      ],
    },

    // example of a date range facet
    date_established: {
      type: "range",
      ranges: [
        {
          from: "1950-10-05T14:48:00.000Z",
          name: "Within the last 50 years",
        },
        {
          from: "1900-10-05T14:48:00.000Z",
          to: "1950-10-05T14:48:00.000Z",
          name: "50 - 100 years ago",
        },
        {
          to: "1920-10-05T14:48:00.000Z",
          name: "More than 100 years ago",
        },
      ],

      // example of a geo location range facet
      location: {
        // center location to base ranges off of
        center: "37.7749, -122.4194",
        type: "range",
        unit: "mi",
        ranges: [
          { from: 0, to: 100, name: "Nearby" },
          { from: 100, to: 500, name: "A longer drive" },
          { from: 500, name: "Perhaps fly?" },
        ],
      },
    }
  }
```

#### Disjunctive Faceting [api-core-configuration-disjunctive-faceting]

"Disjunctive" facets are facets that do not change when a selection is made. Meaning, all available options will remain as selectable options even after a selection is made.

Configured in the searchQuery.disjunctiveFacets array. An array of field names. Every field listed here must have been configured in the facets field first. It denotes that a facet should be considered disjunctive. When returning counts for disjunctive facets, the counts will be returned as if no filter is applied on this field, even if one is applied.

##### disjunctiveFacetsAnalyticsTags [api-core-configuration-disjunctivefacetsanalyticstags]

Used in conjunction with the disjunctiveFacets parameter. Adding disjunctiveFacets can cause additional API requests to be made to your API, which can create deceiving analytics. These queries will be tagged with "Facet-Only" by default. This field lets you specify a different tag for these.

Example, use ignore as a tag on all disjunctive API calls:

```js
disjunctiveFacetsAnalyticsTags: ["ignore"];
```

#### Conditional Faceting [api-core-configuration-conditional-faceting]

See [Conditional Faceting](/reference/guides-conditional-facets.md) for more information.

### search_fields [api-core-configuration-search_fields]

Fields which should be searched with search term.

```js
search_fields: {
  title: {
    weight: 10,
  },
  description: {},
  tags: {
    weight: 5,
  }
}
```

Apply Weights to each search field.

Engine level Weight settings will be applied is none are provided.

Query time Weights take precedence over Engine level values.

All fields specified within the search relevance section will be used for searching if not specified.

### Fuzziness [api-core-configuration-fuzziness]

::::{important}
**Supported only by the [Elasticsearch Connector](/reference/api-connectors-elasticsearch.md#api-connectors-elasticsearch-fuzziness).**
This setting has no effect in other connectors.
::::

**Type:** `boolean`
**Default:** `false`

`fuzziness` enables typo tolerance in search results by allowing small differences between the user’s search term and indexed terms. This makes search more forgiving to mistakes or misspellings.

When set to `true`, the connector automatically applies typo-tolerant matching based on the edit distance between terms. For example, the following types of variations are considered:

- **Character substitution**: "**b**ox" → "**f**ox"
- **Character removal**: "**b**lack" → "lack"
- **Character insertion**: "sic" → "sic**k**"
- **Character transposition**: "**ac**t" → "**ca**t"

### result_fields [api-core-configuration-result_fields]

Select from two ways to render text field values:

- **Raw**: An exact representation of the value within a field. And it is exact! It is not HTML escaped.
- **Snippet**: A snippet is an HTML escaped representation of the value within a field, where query matches are captured in `<em>` tags.

A raw field defaults to the full field with no character limit outside of max document size. A custom range must be at least 20 characters.

A snippet field defaults to 100 characters. A custom range must be between 20-1000 characters.

Only text fields provide these two options.

#### Raw [api-core-configuration-raw]

```js
result_fields: {
  title: {
    raw: {}
  },
  description: {
    raw: {
      size: 50
    }
  }
}
```

| field  | description                                                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size` | Number - Optional. Length of the return value. Only can be used on text fields. Must be at least 20; defaults to the entire text field. If given for a different field type other than text, it will be silently ignored. |

#### Snippet (Highlighting) [api-core-configuration-snippet-highlighting]

Requests a snippet of a text field.

The query match will be wrapped in `<em></em>` tags, for highlighting, if a match exists.

Use escaped quotations to highlight only on exact, case insensitive matches.

Matches are HTML escaped prior to inserting `<em></em>` tags. Fallbacks are also HTML escaped.

If requesting a snippet on a non-text field, the snippet field will be null.

If there is no match for your query, the snippet field will be null.

Snippets on an array value will return the first match or null. There is no fallback support.

On synonyms: If a search finds a synonym for a query, the synonym will not be highlighted.

For example, if "path" and "trail" are synonyms and a query is done for "path", the term "trail" will not be highlighted.

```js
result_fields: {
  title: {
    snippet: {
      size: 100,
      fallback: true
    }
  },
  description: {
    raw: {
      size: 50
    }
  }
}
```

| field      | description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| `size`     | Character length of the snippet returned. Must be at least 20; defaults to 100. |
| `fallback` | If true, fallback to the raw field if no match is found.                        |

## Autocomplete Query [api-core-configuration-autocomplete-query]

This is the configuration that provide relevant query suggestions for incomplete queries. Some of these configuration options are not supported by some connectors. Each connector will document the options that are not supported.

```js
autocompleteQuery: {
  // performs a prefix search on the query
  results: {
    fuzziness: true, // enables typo tolerance in autocomplete results
    resultsPerPage: 5, // number of results to display. Default is 5.
    result_fields: {
      // Add snippet highlighting within autocomplete suggestions
      title: { snippet: { size: 100, fallback: true }},
      nps_link: { raw: {} }
    }
  },
  // performs a query to suggest for values that partially match the incomplete query
  suggestions: {
    types: {
      // Limit query to only suggest based on "title" field
      documents: {  fields: ["title"] }
    },
    // Limit the number of suggestions returned from the server
    size: 4
  }
}
```

### Results [api-core-configuration-results]

`results` will perform autocomplete on the query being typed. This will give back results that are relevant to the query before the user has typed any additional characters.

```js
results: {
  resultsPerPage: 5,
  fuzziness: true, // enables typo tolerance in autocomplete results
  result_fields: {
    title: { snippet: { size: 100, fallback: true }},
    nps_link: { raw: {} }
  }
},
```

| field           | description                                                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filters`       | Optional. List of filters. Use same configuration as [filters](#api-core-configuration-filters-global-filters)                                                                                                     |
| `resultPerPage` | Optional. Number type. Number of results suggested                                                                                                                                                                 |
| `fuzziness`     | Optional. Boolean. When set to `true`, enables typo tolerance in autocomplete results. Only supported by the **Elasticsearch Connector**. Use same configuration as [fuzziness](#api-core-configuration-fuzziness) |
| `result_fields` | Optional. To specify the fields for each result hit. Use same configuration as [result fields](#api-core-configuration-result_fields)                                                                              |
| `search_fields` | Optional. Fields which should be searched for autocomplete. Use same configuration as [search fields](#api-core-configuration-search_fields)                                                                       |

### Suggestions [api-core-configuration-suggestions]

Suggestions Query configuration for Search UI largely follows the same API as the [App Search Search API](https://www.elastic.co/guide/en/app-search/current/query-suggestion.html).

```json
{
  "types": {
    "documents": {
      "fields": ["title", "states"]
    }
  },
  "size": 4
}
```

| option  | type    | required? | source                                                                                       |
| ------- | ------- | --------- | -------------------------------------------------------------------------------------------- |
| `types` | Object  | required  | Object, keyed by "type" of query suggestion, with configuration for that type of suggestion. |
| `size`  | Integer | optional  | Number of suggestions to return.                                                             |

### Result Suggestions [api-core-configuration-result-suggestions]

::::{important}
**Supported only by the Elasticsearch-connector.**

::::

A different index can be used for the suggestions. Some examples:

- Popular queries index from analytics
- Brands index from product data
- Categories index from product data

Below we are using the `popular_queries` index and performing a prefix match search on the `query.suggest` field. One thing to note, make sure the api-key has access to the index.

See [Example retrieving suggestions from another index](/reference/api-react-components-search-box.md) for more information.

```js
autocompleteQuery: {
  suggestions: {
    popularQueries: {
      search_fields: {
        "query.suggest": {} // fields used to query
      },
      result_fields: {
        query: { // fields used for display
          raw: {}
        }
      },
      index: "popular_queries",
      queryType: "results"
    }
  }
}
```

## Event Hooks [api-core-configuration-event-hooks]

Search UI exposes a number of event hooks which need handlers to be implemented in order for Search UI to function properly.

The easiest way to provide handlers for these events is via an out-of-the-box "Connector", which provides pre-built handlers, which can then be configured for your particular use case.

While we do provide out-of-the-box Connectors, it is also possible to implement these handlers directly, override Connector methods, or provide "middleware" to Connectors in order to further customize how Search UI interacts with your services.

#### Event Handlers [api-core-configuration-event-handlers]

| method                      | params                                                                               | return                                                                       | description                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onResultClick`             | `props` - Object                                                                     |                                                                              | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result on a result page.           |
|                             | - `query` - String                                                                   |                                                                              | The query used to generate the current results.                                                                                                     |
|                             | - `documentId` - String                                                              |                                                                              | The id of the result that a user clicked.                                                                                                           |
|                             | - `requestId` - String                                                               |                                                                              | A unique id that ties the click to a particular search request.                                                                                     |
|                             | - `tags` - Array[String]                                                             |                                                                              | Tags used for analytics.                                                                                                                            |
| `onSearch`                  | `state` - [Request State](/reference/api-core-state.md#api-core-state-request-state) | [Response State](/reference/api-core-state.md#api-core-state-response-state) |                                                                                                                                                     |
|                             | `queryConfig` - [Query Config](#api-core-configuration-search-query-queryconfig)     |                                                                              |                                                                                                                                                     |
| `onAutocompleteResultClick` | `props` - Object                                                                     |                                                                              | This method logs a click-through event to your APIs analytics service. This is triggered when a user clicks on a result in an autocomplete dropdown |
|                             | - `query` - String                                                                   |                                                                              | The query used to generate the current results.                                                                                                     |
|                             | - `documentId` - String                                                              |                                                                              | The id of the result that a user clicked.                                                                                                           |
|                             | - `requestId` - String                                                               |                                                                              | A unique id that ties the click to a particular search request.                                                                                     |
|                             | - `tags` - Array[String]                                                             |                                                                              | Tags used for analytics.                                                                                                                            |
| `onAutocomplete`            | `state` - [Request State](/reference/api-core-state.md#api-core-state-request-state) | [Response State](/reference/api-core-state.md#api-core-state-response-state) |                                                                                                                                                     |
|                             | `queryConfig` - Object                                                               |                                                                              |                                                                                                                                                     |
|                             | - `results` - [Query Config](#api-core-configuration-search-query-queryconfig)       |                                                                              | If this is set, results should be returned for autocomplete.                                                                                        |
|                             | - `suggestions` - [Suggestions Query Config](#api-core-configuration-suggestions)    |                                                                              | If this is set, query suggestions should be returned for autocomplete.                                                                              |

Explicitly providing a Handler will override the Handler provided by the Connector.

```jsx
<SearchProvider
  config={{
    apiConnector: connector,
    onSearch: async (requestState, queryConfig) => {
      const queryForOtherService = transformSearchUIStateToQuery(
        requestState,
        queryConfig
      );
      const otherServiceResponse =
        await callSomeOtherService(queryForOtherService);
      return transformOtherServiceResponseToSearchUIState(otherServiceResponse);
    }
  }}
/>
```

### Using middleware in Connector Handlers [api-core-configuration-using-middleware-in-connector-handlers]

Handler implementations can also be used as middleware for Connectors by leveraging the `next` function.

```jsx
<SearchProvider
  config={{
    apiConnector: connector,
    onSearch: (requestState, queryConfig, next) => {
      const updatedState = someStateTransformation(requestState);
      return next(updatedState, queryConfig);
    }
  }}
/>
```

### Routing Options [api-core-configuration-routing-options]

Search UI provides a number of options for how to customise how state is serialised onto the URL. Within the config there is a `routingOptions` object which can be used to override the serialisation and parsing of the url to state.

Below is an example of how to use the `routingOptions` object to customise the url to be more SEO friendly.

This will result in the url pattern being like `https://example.com/search/california,alaska?query=shoes`

```js
const routingOptions = {
  readUrl: () => {
    return asPath;
  },
  writeUrl: (url, { replaceUrl }) => {
    const method = router[replaceUrl ? "replace" : "push"];
    method(url);
  },
  stateToUrl: (state) => {
    const statesFilter = state.filters.find(
      (filter) => filter.field === "states"
    );
    const states = statesFilter ? statesFilter.values.join(",") : "all";
    return `/search/${states}?query=${state.searchTerm}`;
  },
  urlToState: (url) => {
    const match = url.match(/\/search\/(\w+)\?query=(\w+)/);
    if (!match) return {};
    return {
      searchTerm: match[2],
      filters: [{ field: "states", values: [match[1].split(",")], type: "any" }]
    };
  }
};

const config = {
  // search UI config
  routingOptions: routingOptions
};
```
