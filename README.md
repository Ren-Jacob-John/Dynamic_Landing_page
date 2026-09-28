# Dynamic Landing Page Personalization

A GitHub-ready technical assessment project demonstrating deterministic, secure, configuration-driven DOM personalization for a single RFID product landing page.

## 1. Problem Understanding

A company may receive visitors from different advertising or search contexts. Creating a separate landing page for every context increases duplication and maintenance cost.

This project keeps **one canonical landing page** and uses URL parameters to select a small, predefined personalization variant. Only explicitly marked DOM elements change. Everything else remains the original page.

The approach is intentionally deterministic: URL input selects from approved content; it never becomes page content.

## 2. Objectives

- Build one responsive RFID B2B landing page.
- Preserve useful default HTML content when JavaScript is unavailable.
- Detect supported URL/search/ad context after page load.
- Normalize case, whitespace, hyphens, and underscores.
- Select exactly one of three primary variants: inventory, tools, or hardware.
- Update only 6 opted-in DOM elements.
- Avoid arbitrary URL content rendering.
- Handle unknown, empty, malformed, or unsupported context without personalization.
- Keep the implementation dependency-free and easy to remove.

## 3. Architecture

```text
Current URL
    |
    v
URLSearchParams
    |
    v
getUrlContext()
    |
    v
Normalization
(lowercase + trim + hyphen/underscore normalization)
    |
    v
detectVariant()
(keyword -> ad -> campaign)
    |
    +---- no recognized value ----> Keep original HTML
    |
    v
Approved VARIANTS configuration
    |
    v
applyVariant()
    |
    v
[data-dynamic] DOM elements only
```

The script is an enhancement layer. The base HTML remains meaningful and usable without it.

## 4. Technology Stack

- **HTML5** — semantic page structure, accessible navigation, links, sections, and fallback content.
- **CSS3** — responsive layout, typography, cards, visual hierarchy, and mobile behavior.
- **Vanilla JavaScript** — `URLSearchParams`, deterministic matching, and DOM updates without framework overhead.
- **No backend** — the assessment only requires client-side proof of concept behavior.
- **No AI/LLM** — deterministic rules are more predictable and auditable for a small fixed keyword taxonomy.

No package installation is required.

## 5. Project Structure

```text
dynamic-landing-page/
├── index.html
├── styles.css
├── dynamic-landing.js
├── README.md
├── IMPLEMENTATION_NOTES.md
├── tests/
│   ├── test-cases.md
│   └── test-runner.js
└── images/
    ├── rfid-default.jpg
    ├── rfid-inventory.jpg
    ├── rfid-tool-tracking.jpg
    └── rfid-reader.jpg
```

- `index.html` — the single canonical/base landing page and default content. The personalization layer is additive and does not require duplicate landing pages.
- `styles.css` — responsive B2B SaaS/RFID presentation.
- `dynamic-landing.js` — URL parsing, normalization, detection, configuration, and DOM updates.
- `tests/test-cases.md` — test matrix with recorded automated results and manual browser checks.
- `tests/test-runner.js` — dependency-free Node.js regression test runner.
- `IMPLEMENTATION_NOTES.md` — interview-oriented engineering explanation.
- `images/` — local placeholder/demo imagery.

## 6. Base Page vs Personalization Layer

`index.html` is the single base landing page used for the proof of concept. Its default copy and structure remain in the HTML. `dynamic-landing.js` is the small personalization layer added on top: it reads URL context and changes only the six marked `data-dynamic` elements at runtime. There are no duplicate landing pages or server-side variants. Removing the script leaves the base page usable.

For this self-contained assessment repository, the base page is included in the repository so the evaluator can run the project without access to an external website.

## 7. Supported URL Parameters

| Parameter | Purpose |
|---|---|
| `source` | Captures traffic source for debug/context visibility. It is not a personalization selector. |
| `campaign` | Third-priority personalization context. |
| `keyword` | Highest-priority personalization context. |
| `ad` | Second-priority personalization context. |
| `debug` | `true` enables console-only debug logging. Both the parameter name and value are case-insensitive (`debug=true`, `DEBUG=true`, `debug=TRUE`). |

### Priority

The selector priority is:

1. `keyword`
2. `ad`
3. `campaign`

The first recognized value wins.

Example:

```text
?keyword=rfid-tool-tracking&ad=rfid-reader
```

selects `tools` because `keyword` is checked before `ad`.

`source` is intentionally not used to infer a variant. It can be useful as metadata and is shown in debug mode.

## 7. Supported Variations

### Default

No recognized context:

- Headline: `RFID Solutions for Your Business`
- Description: `Improve visibility, automate operations, and make better decisions with reliable RFID solutions.`
- CTA: `Talk to Us`
- Benefit: `Improve Operational Visibility`
- Use case: `RFID Solutions for Modern Operations`
- Image: `images/rfid-default.jpg`

### Inventory

Recognized values include:

- `inventory`
- `inventory tracking`
- `stock`
- `warehouse`
- `warehouse tracking`
- `rfid inventory`
- `rfid inventory tracking`

Content:

- `Automate Inventory Tracking With RFID`
- `Improve inventory accuracy and gain better visibility across your warehouse and stock operations.`
- `Discuss Inventory Tracking`
- `Improve Inventory Accuracy`
- `RFID Inventory Management`

### Tool Tracking

Recognized values include:

- `tool`
- `tools`
- `tool tracking`
- `tool tracker`
- `equipment tracking`
- `lost tools`
- `industrial tools`
- `tracking industrial tools`
- `stop losing tools`
- `rfid tool tracking`

Content:

- `Track Every Tool With RFID`
- `Reduce lost equipment, improve tool visibility, and strengthen accountability across your operations.`
- `Discuss Tool Tracking`
- `Reduce Lost Equipment`
- `RFID Tool Tracking`

### RFID Hardware

Recognized values include:

- `reader`
- `readers`
- `rfid reader`
- `rfid readers`
- `hardware`
- `rfid hardware`
- `device`
- `devices`
- `deployment`

Content:

- `RFID Readers for Reliable Tracking`
- `Choose the right RFID readers and hardware for reliable tracking and deployment across your operation.`
- `Discuss RFID Hardware`
- `Reliable RFID Hardware`
- `RFID Reader Solutions`

## 8. Sample URLs

Because this is a static project, `/product` can be represented by `index.html` locally. For a local demo:

```text
index.html
index.html?source=google&keyword=rfid-inventory-tracking
index.html?source=google&keyword=rfid-tool-tracking
index.html?source=google&keyword=rfid-reader
index.html?source=meta&ad=stop-losing-tools
index.html?keyword=RFID-TOOL-TRACKING
index.html?keyword=random-unknown-value
index.html?debug=true
```

In deployment, the same JavaScript works on a `/product` route:

```text
/product
/product?source=google&keyword=rfid-inventory-tracking
```

## 9. DOM Elements Modified

Only these six opted-in elements are candidates for personalization:

```html
<h1 data-dynamic="headline">...</h1>
<p data-dynamic="description">...</p>
<a data-dynamic="cta">...</a>
<h3 data-dynamic="benefit">...</h3>
<h2 data-dynamic="use-case">...</h2>
<img data-dynamic="hero-image" ...>
```

The image's `alt` text is also swapped from the same approved configuration. No CSS positional selectors or hard-coded DOM traversal are used.

## 10. Security Considerations

- URL values are **never rendered directly**.
- Input is normalized and compared against a fixed allowlist.
- A recognized variant retrieves content from the `VARIANTS` configuration.
- Text changes use `textContent`.
- Images are selected only from predefined local paths.
- No URL value is used to construct an image path.
- Unknown values produce no personalization.
- `debug` only controls console logging and does not expose input in the page UI.

This follows the security flow:

```text
Untrusted URL
  -> normalize
  -> allowlist comparison
  -> known variant
  -> approved content
  -> DOM
```

## 11. Reliability and Failure Handling

- Missing dynamic elements are ignored safely.
- Unknown parameters do nothing.
- Empty parameters do nothing.
- Unsupported combinations do not trigger guesses.
- Missing JavaScript leaves the original HTML visible and usable.
- Local image paths are fixed in configuration.
- If a variant image fails to load, the original image and alt text are restored automatically.
- The whole personalization step runs inside a `try/catch`; on any unexpected error the page stays in its original state and one console warning is logged.
- The script is wrapped in an IIFE to avoid unnecessary global variables.
- The page does not depend on the personalization script for navigation or core content.
- Responsive CSS avoids fixed text containers and uses `object-fit` for images.

## 12. Testing

See `tests/test-cases.md` for the full test matrix.

The project covers:

- default/no parameters
- all three variants
- ad-based tool context
- uppercase and mixed-case values
- hyphen and underscore normalization
- empty/unknown values
- invalid parameters
- debug mode
- multiple recognized contexts
- JavaScript-disabled fallback
- missing DOM element handling

## 13. Engineering Decisions

### Why Vanilla JavaScript?

The assignment is specifically about DOM manipulation and URL-context detection. A framework would add abstraction without improving the core demonstration.

### Why configuration-driven content?

All approved copy and image mappings live in one object. This reduces duplication and makes future variants easier to review.

### Why data attributes?

`data-dynamic` explicitly declares which elements are safe personalization targets. It is more maintainable than positional selectors.

### Why deterministic keyword matching?

The supported vocabulary is small and known. Exact normalized matching provides predictable behavior and makes test cases straightforward.

### Why no backend?

There is no requirement for server-side rendering, storage, authentication, or analytics. A backend would increase complexity without contributing to the assessment objective.

### Why no AI?

The task requires predefined variants. AI classification would make a small deterministic problem less predictable and harder to audit.

## 14. Limitations

- Matching is rule-based.
- Keywords must be manually defined.
- Advertising context is simulated through query parameters.
- No analytics or conversion attribution is implemented.
- No real Google, Meta, or LinkedIn integration exists.
- Personalization is client-side rather than server-side.
- Because the script is deferred, the default content can paint briefly before personalization applies (a possible brief content flash). Server-side personalization would avoid this.
- This proof of concept does not implement consent management because no tracking/analytics system is included.

## 15. Future Improvements

If the product requirements grow, possible extensions include:

- analytics and conversion tracking
- controlled A/B testing
- centrally managed configuration
- server-side personalization
- consent-aware personalization
- campaign performance reporting
- more sophisticated classification only if a larger, justified taxonomy requires it

These are intentionally not implemented in this assessment.

## 15a. How to Add a New Variation

Only `dynamic-landing.js` changes; the HTML stays untouched.

1. Add an entry to `VARIANTS` with `headline`, `description`, `cta`, `benefit`, `useCase`, `image`, and `imageAlt`. Use a local image path that exists in `images/`.
2. Add a matching entry to `MATCH_RULES` with the normalized phrases (lowercase, words separated by single spaces) that should select it. Hyphens and underscores in URLs are already converted to spaces.
3. Keep phrases specific. Exact matching means a short generic word can cause false positives.
4. Add a row to `tests/test-cases.md` and try the URL `?keyword=your-phrase`.

## 16. Setup

### Option 1 — VS Code Live Server

1. Open the project folder in VS Code.
2. Install/use the Live Server extension.
3. Open `index.html` with Live Server.
4. Add query parameters to the page URL.

### Option 2 — Python

From the project directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

### Option 3 — Node.js

No Node.js setup is required. There is intentionally no `package.json` because the project has no runtime dependency.

## 17. Demo Instructions

1. Open the base page with no query parameters.
2. Add `?keyword=rfid-inventory-tracking`.
3. Add `?keyword=rfid-tool-tracking`.
4. Add `?keyword=rfid-reader`.
5. Try `?source=meta&ad=stop-losing-tools`.
6. Try `?keyword=random-unknown-value`.
7. Try `?debug=true`.
8. Remove the query string and confirm the original content returns.

## Requirement Audit Summary

| Requirement | Implementation |
|---|---|
| Exactly one landing page | `index.html` only |
| HTML/CSS/Vanilla JS | Yes |
| Original default content | Present in base HTML |
| URLSearchParams | Used |
| Three primary variants | Inventory, tools, hardware |
| Deterministic detection | Exact normalized allowlist |
| Priority | keyword → ad → campaign |
| Stable selectors | `data-dynamic` |
| Limited DOM changes | Six explicit targets |
| Safe text updates | `textContent` |
| Safe images | Fixed configuration paths |
| Debug mode | `debug=true` |
| JS-disabled fallback | Base HTML remains usable |
| Responsive | Desktop/tablet/mobile CSS |
| No external dependencies | Yes |
| Documentation | README + implementation notes + demo script |
| Test documentation | 14 test cases |
