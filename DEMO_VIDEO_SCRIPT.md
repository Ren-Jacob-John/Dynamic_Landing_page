# Demo Video Script — 3–5 Minutes

## 0:00–0:30 — Introduction

**Screen:** Project folder and landing page.

**Say:**

“This project demonstrates dynamic landing-page personalization using the DOM. The problem is that a company may receive traffic from different search or advertising contexts, but maintaining separate landing pages for every context creates duplication. This implementation keeps one RFID landing page and changes only selected content based on approved URL context.”

## 0:30–1:00 — Original Page

**Screen:** Open the page with no query parameters.

**Say:**

“Here is the default page. The original headline is ‘RFID Solutions for Your Business’, with the default description, CTA, benefit, use-case heading, and hero image. This is the base HTML content, so the page remains usable even if JavaScript is disabled.”

## 1:00–1:30 — Inventory Variation

**Screen:** Navigate to:

```text
?source=google&keyword=rfid-inventory-tracking
```

**Say:**

“The keyword is normalized and recognized as the inventory variant. The script retrieves pre-approved inventory content from the configuration object and updates only the marked dynamic elements.”

Show the headline:

```text
Automate Inventory Tracking With RFID
```

## 1:30–2:00 — Tool Tracking Variation

**Screen:** Navigate to:

```text
?source=google&keyword=rfid-tool-tracking
```

**Say:**

“Now the same page selects the tool-tracking variant. No second HTML page is involved. The headline, description, CTA, benefit, use-case heading, and hero image are the only personalized targets.”

## 2:00–2:30 — RFID Hardware

**Screen:** Navigate to:

```text
?source=google&keyword=rfid-reader
```

**Say:**

“This recognized hardware keyword selects the RFID hardware configuration. The page structure remains identical.”

## 2:30–3:00 — Ad Parameter

**Screen:** Navigate to:

```text
?source=meta&ad=stop-losing-tools
```

**Say:**

“Personalization can also come from the ad parameter. Here, ‘stop-losing-tools’ is an explicitly approved tool-tracking phrase. This is only simulated ad context; there is no real ad-platform integration.”

## 3:00–3:30 — Unknown Context

**Screen:** Navigate to:

```text
?keyword=random-unknown-value
```

**Say:**

“Unknown context does not cause guessing. The page returns to the original content. This is an important reliability and security rule.”

## 3:30–4:00 — Debug Mode

**Screen:** Navigate to:

```text
?keyword=rfid-tool-tracking&debug=true
```

Open DevTools Console.

**Say:**

“Debug mode is console-only. It shows the source, campaign, keyword, ad value, detected variant, and whether key elements changed. It does not alter the visual page.”

## 4:00–5:00 — Architecture, Security, Trade-offs

**Screen:** Show `dynamic-landing.js` and README.

**Say:**

“The architecture is URLSearchParams, normalization, deterministic context detection, an approved configuration object, and safe DOM updates. Priority is keyword, then ad, then campaign.

The URL never becomes page content. Text uses textContent, and images come only from predefined local paths. Stable data-dynamic attributes identify the allowed targets.

I chose Vanilla JavaScript because this assessment is specifically about DOM manipulation and does not need a framework or backend. The main limitation is that keyword matching is rule-based and manually maintained. In production, analytics, experimentation, consent-aware tracking, centralized configuration, or server-side personalization could be added if the requirements justified them.”

## Add-on: parameter removal

In the 3:00–3:30 segment, after showing a variation, delete the query string, reload, and show the original headline "RFID Solutions for Your Business" returns. Optionally note that disabling JavaScript gives the same result.
