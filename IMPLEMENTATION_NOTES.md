# Implementation Notes

## 1. Problem interpretation

The assessment asks for personalization of a single existing landing page, not generation of multiple pages. The implementation therefore treats the original HTML as the source of truth and places a small JavaScript enhancement layer over selected elements.

The visitor context is represented by query parameters such as `keyword`, `ad`, and `campaign`. Those parameters are selectors, not content sources.

## 2. Architecture

The implementation has six responsibilities:

1. **URL parsing** — `URLSearchParams` reads the current query string.
2. **Normalization** — case, surrounding whitespace, hyphens, and underscores are normalized.
3. **Variant detection** — exact allowlist matching selects `inventory`, `tools`, `hardware`, or `null`.
4. **Configuration** — `VARIANTS` stores all approved copy and image paths.
5. **DOM updates** — only `data-dynamic` targets are modified.
6. **Debug logging** — optional console output is controlled by `debug=true`.

The separation keeps policy-like content decisions away from DOM manipulation code.

## 3. Why DOM personalization?

The requirement is to preserve one landing page while adapting a small amount of content to visitor context. DOM personalization achieves this without maintaining multiple HTML documents.

It also allows the personalization layer to be removed: the original HTML continues to contain complete default copy and functional navigation.

## 4. Why configuration-driven variants?

A configuration object provides a single source of truth for approved personalization copy:

```text
VARIANTS
  ├── inventory
  ├── tools
  └── hardware
```

Without this structure, copy tends to become duplicated across conditional branches. Centralization also makes content review and future expansion easier.

## 5. URL normalization

Raw values are not trusted as display content. `normalizeValue()`:

- checks the value type
- converts to lowercase
- trims surrounding whitespace
- converts hyphens and underscores to spaces
- collapses repeated whitespace

Example:

```text
RFID-TOOL-TRACKING
        ↓
rfid tool tracking
```

The normalized value is then compared to known strings.

## 6. Keyword matching

Matching is intentionally exact after normalization. This avoids broad substring matching that could cause unintended variants.

For example, `stop losing tools` is an explicit approved ad phrase. A random phrase containing a similar word is not automatically interpreted as a tool-tracking intent.

The field priority is:

```text
keyword → ad → campaign
```

The first recognized field wins.

## 7. DOM safety

Only explicitly marked elements can change:

```text
[data-dynamic="headline"]
[data-dynamic="description"]
[data-dynamic="cta"]
[data-dynamic="benefit"]
[data-dynamic="use-case"]
[data-dynamic="hero-image"]
```

Each update performs a null check. A missing target therefore does not cause a fatal error.

No selector depends on element position or DOM nesting.

## 8. Security considerations

The URL is untrusted input.

The code never performs:

```js
element.innerHTML = keyword;
element.textContent = keyword;
element.src = keyword;
```

Instead, it performs:

```text
URL input
→ normalization
→ exact allowlist comparison
→ variant key
→ approved configuration
→ DOM
```

This means an attacker cannot use the query string as arbitrary page content through the personalization mechanism.

Image paths are stored in the static variant configuration, not constructed from query parameters.

## 9. Error handling

The page has a useful default state before JavaScript runs.

If JavaScript is disabled, the browser receives the complete default HTML.

If JavaScript runs but there is no recognized context, `applyVariant()` is not called.

If a dynamic element is missing, `updateElement()` returns `false` rather than throwing.

## 10. Testing approach

The test matrix combines:

- happy paths
- default behavior
- invalid/unknown inputs
- normalization
- priority
- debug behavior
- missing DOM elements
- JavaScript-disabled fallback
- basic injection-oriented inputs

The most important invariant is:

> Unrecognized input must not change the page.

## 11. Trade-offs

### Exact matching vs substring matching

Exact normalized matching is more predictable but requires more maintained keywords.

### Client-side vs server-side personalization

Client-side personalization is simple and appropriate for this proof of concept, but server-side personalization can be useful when SEO, initial-render performance, or server-controlled experiments become requirements.

### Static configuration vs remote configuration

Static configuration is easy to audit and has no network dependency. A production platform might eventually move approved content to a centrally managed source.

## 12. Limitations

This implementation does not determine intent using a machine-learning model. It does not integrate ad platforms, analytics, consent management, or backend services.

The query parameter itself is also not proof of a real ad impression; it is only a simulated context for the assessment.

## 13. Future improvements

If justified by production requirements:

- add analytics with consent-aware instrumentation
- introduce A/B test allocation
- centralize approved copy configuration
- add server-side rendering/personalization
- add campaign performance tracking
- expand classification only when a larger taxonomy makes deterministic rules difficult to maintain

## 14. Known failure cases

- Near-miss phrases (for example `tool-tracking-software`) are not matched, so the default page is shown. This is deliberate: no guessing.
- A brief flash of default content can appear before the deferred script runs.
- A conflicting `keyword` and `ad` resolves to `keyword`; the lower-priority signal is ignored.
- Personalized text is fixed copy; a phrase outside `MATCH_RULES` needs a code change.

## 15. My contribution

This repository should be submitted with an accurate personal-contribution statement. Before submission, replace the bullets below with the work you personally completed and any assistance/tools you used.

- Implemented: URL-context parsing, deterministic variant matching, DOM personalization, and defensive error handling.
- Designed: configuration-driven content and priority rules for keyword, ad, and campaign context.
- Tested: required scenarios, normalization, invalid input, allowlist behavior, and fallback handling using `tests/test-runner.js`.
- Tooling/assistance: disclose any IDE, AI assistant, libraries, or copied/adapted code used during development.

