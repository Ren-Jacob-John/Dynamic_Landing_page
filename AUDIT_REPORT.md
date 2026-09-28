# Implementation Audit Report

## Result

**PASS after fixes.** The project was re-audited against the assignment. A behavior harness (Node `vm` with a stubbed DOM) exercised 16 URL cases plus missing-element and image-failure scenarios.

## Defects found and fixed

| # | Finding | Fix |
|---|---|---|
| 1 | `?DEBUG=true` (uppercase parameter **name**) did not enable debug mode; only the value was case-insensitive. The assignment explicitly requires `DEBUG=true`. | `readParam()` matches parameter names case-insensitively. |
| 2 | No fallback if a variant image failed to load (broken image icon). | `updateImage()` restores the original `src`/`alt` on `error`. |
| 3 | Hero `alt` text kept describing the default image after a swap. | Approved `imageAlt` strings added to the variant config. |
| 4 | `updateElement` accepted an arbitrary property name. | Text path is `textContent` only; image path is a separate function using `setAttribute`. |
| 5 | Personalization was not wrapped in error handling. | `init()` uses `try/catch`; failure leaves the original page. |
| 6 | Minor: unescaped `&` in HTML, no focus styles, no intrinsic image size, no reduced-motion rule. | Fixed in `index.html` and `styles.css`. |

## Verified behavior

- No params, unknown, empty, invalid, and near-miss keywords leave the default page unchanged.
- Inventory, tools, and hardware keywords map correctly, including uppercase, mixed case, `_`, `-`, and `+` separators.
- `ad=stop-losing-tools` selects tools. Priority is keyword, then ad, then campaign.
- `debug=true`, `DEBUG=true`, `Debug=TRUE` all log to the console only.
- Missing DOM target: no exception, remaining targets still update.

## Not verified here

- Visual/responsive rendering and JavaScript-disabled behavior were not checked in a real browser; follow `tests/test-cases.md` for those.

## Notes

- Matching is exact against the allowlist by design, so near-misses like `tool-tracking-software` do nothing.
- The assignment uses `/product`; this static repo uses `index.html`. The script reads `window.location.search`, so it is path-independent.
- Deferred script execution means the default content can paint briefly before personalization applies. This is inherent to client-side DOM personalization and is documented as a limitation.
