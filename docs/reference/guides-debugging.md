---
mapped_pages:
  - https://www.elastic.co/guide/en/search-ui/current/guides-debugging.html
applies_to:
  stack:
  serverless:
---

# Debugging [guides-debugging]

There is a `debug` flag available on the configuration for `SearchDriver` and `SearchProvider`.

```jsx
<SearchProvider config={
  debug: true
  //...
}>
```

Setting this to `true` will make the `searchUI` object available globally on window. This will allow you to programmatically execute actions in the browser console which can be helpful for debugging.

```js
window.searchUI.addFilter("states", "California", "all");
```

This will also log actions and state updates as they occur to the console in the following form:

```txt
Search UI: Action {Action Name} {Action Parameters}
Search UI: State Update {State to update} {Full State after update}
```
