# Test Cases

## Test Matrix

| # | Input | Expected result | Status |
|---:|---|---|---|
| 1 | No parameters | Original page remains unchanged | ☐ |
| 2 | `?keyword=rfid-inventory-tracking` | Inventory variation | ☐ |
| 3 | `?keyword=rfid-tool-tracking` | Tool Tracking variation | ☐ |
| 4 | `?keyword=rfid-reader` | RFID Hardware variation | ☐ |
| 5 | `?ad=stop-losing-tools` | Tool Tracking variation | ☐ |
| 6 | `?keyword=hello-world` | Original page | ☐ |
| 7 | `?keyword=RFID-TOOL-TRACKING` | Tool Tracking variation | ☐ |
| 8 | `?keyword=RfId_ToOl_TrAcKiNg` | Tool Tracking variation | ☐ |
| 9 | `?keyword=` | Original page | ☐ |
| 10 | `?unknown=value` | Original page | ☐ |
| 11 | `?debug=true`, `?DEBUG=true`, `?debug=TRUE` | Original page + console debug output (parameter name and value are case-insensitive) | ☐ |
| 12 | `?keyword=rfid-tool-tracking&ad=rfid-reader&campaign=inventory` | Tool Tracking; keyword has priority | ☐ |
| 13 | JavaScript disabled | Original HTML remains usable | ☐ |
| 14 | Remove `[data-dynamic="headline"]` in DevTools | No fatal JS error; other targets can still update | ☐ |

## Additional normalization checks

These should map to the same variants:

```text
keyword=RFID-TOOL-TRACKING
keyword=rfid_tool_tracking
keyword= rfid-tool-tracking
keyword=rfid__tool__tracking
keyword=RFID_TOOL_TRACKING
```

## Additional safety checks

1. `?keyword=<script>alert(1)</script>` → no variant and no script execution.
2. `?keyword=../../images/rfid-tool-tracking.jpg` → no variant.
3. `?keyword=rfid-tool-tracking&debug=TRUE` → tool variant + console debug.
4. `?keyword=rfid-tool-tracking&campaign=<img src=x onerror=alert(1)>` → tool variant; injected value is never rendered.

## Reliability checks

1. Variant image fails to load → original image and alt text are restored.
2. Unexpected runtime error inside personalization → caught, one console warning, page stays in its original state.
3. `?keyword=tool-tracking-software` (near-miss) → no variant. Matching is exact against the allowlist by design.

## Manual browser procedure

1. Start a local static server.
2. Open the page with no query string.
3. Inspect the six `data-dynamic` elements.
4. Test each sample URL.
5. Compare unrelated sections before/after personalization.
6. Resize to desktop, tablet, and mobile widths.
7. Disable JavaScript in browser settings and reload.
8. Open DevTools Console and test debug mode.
9. Temporarily remove one dynamic target and reload to verify graceful handling.
10. Rename `images/rfid-reader.jpg`, open `?keyword=rfid-reader`, and confirm the default image is restored (no broken image icon).
