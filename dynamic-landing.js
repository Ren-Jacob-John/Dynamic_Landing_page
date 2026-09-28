(() => {
  "use strict";

  const VARIANTS = Object.freeze({
    inventory: Object.freeze({
      headline: "Automate Inventory Tracking With RFID",
      description: "Improve inventory accuracy and gain better visibility across your warehouse and stock operations.",
      cta: "Discuss Inventory Tracking",
      benefit: "Improve Inventory Accuracy",
      useCase: "RFID Inventory Management",
      image: "images/rfid-inventory.jpg",
      imageAlt: "RFID inventory tracking across warehouse shelves and stock"
    }),
    tools: Object.freeze({
      headline: "Track Every Tool With RFID",
      description: "Reduce lost equipment, improve tool visibility, and strengthen accountability across your operations.",
      cta: "Discuss Tool Tracking",
      benefit: "Reduce Lost Equipment",
      useCase: "RFID Tool Tracking",
      image: "images/rfid-tool-tracking.jpg",
      imageAlt: "RFID-tagged industrial tools and equipment being tracked"
    }),
    hardware: Object.freeze({
      headline: "RFID Readers for Reliable Tracking",
      description: "Choose the right RFID readers and hardware for reliable tracking and deployment across your operation.",
      cta: "Discuss RFID Hardware",
      benefit: "Reliable RFID Hardware",
      useCase: "RFID Reader Solutions",
      image: "images/rfid-reader.jpg",
      imageAlt: "RFID reader hardware scanning tagged assets"
    })
  });

  const MATCH_RULES = Object.freeze({
    inventory: [
      "inventory",
      "inventory tracking",
      "stock",
      "warehouse",
      "warehouse tracking",
      "rfid inventory",
      "rfid inventory tracking"
    ],
    tools: [
      "tool",
      "tools",
      "tool tracking",
      "tool tracker",
      "equipment tracking",
      "lost tools",
      "industrial tools",
      "tracking industrial tools",
      "stop losing tools",
      "rfid tool tracking"
    ],
    hardware: [
      "reader",
      "readers",
      "rfid reader",
      "rfid readers",
      "hardware",
      "rfid hardware",
      "device",
      "devices",
      "deployment"
    ]
  });

  const PRIORITY = ["keyword", "ad", "campaign"];

  function normalizeValue(value) {
    if (typeof value !== "string") return "";
    return value
      .toLowerCase()
      .trim()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ");
  }

  // Parameter NAMES are matched case-insensitively (DEBUG=true and debug=true both work).
  // The first occurrence of a name wins, which keeps behavior deterministic.
  function readParam(params, name) {
    for (const [key, value] of params) {
      if (key.toLowerCase() === name) return value;
    }
    return null;
  }

  function getUrlContext(search = window.location.search) {
    const params = new URLSearchParams(search);
    return Object.freeze({
      source: normalizeValue(readParam(params, "source")),
      campaign: normalizeValue(readParam(params, "campaign")),
      keyword: normalizeValue(readParam(params, "keyword")),
      ad: normalizeValue(readParam(params, "ad")),
      debug: normalizeValue(readParam(params, "debug")) === "true"
    });
  }

  function detectVariant(context) {
    for (const field of PRIORITY) {
      const value = context[field];
      if (!value) continue;

      for (const [variantName, keywords] of Object.entries(MATCH_RULES)) {
        if (keywords.includes(value)) {
          return variantName;
        }
      }
    }
    return null;
  }

  // Text is always written with textContent. Values come from VARIANTS, never from the URL.
  function updateElement(selector, value) {
    const element = document.querySelector(selector);
    if (!element || typeof value !== "string") return false;
    element.textContent = value;
    return true;
  }

  // Swaps in an approved local image. If it fails to load, the original image is restored.
  function updateImage(selector, src, alt) {
    const image = document.querySelector(selector);
    if (!image || typeof src !== "string") return false;

    const originalSrc = image.getAttribute("src");
    const originalAlt = image.getAttribute("alt");
    image.addEventListener("error", () => {
      image.setAttribute("src", originalSrc);
      if (originalAlt !== null) image.setAttribute("alt", originalAlt);
    }, { once: true });

    image.setAttribute("src", src);
    if (typeof alt === "string") image.setAttribute("alt", alt);
    return true;
  }

  const NO_CHANGES = Object.freeze({
    headline: false, description: false, cta: false, benefit: false, useCase: false, image: false
  });

  function applyVariant(variantName) {
    const variant = VARIANTS[variantName];
    if (!variant) return NO_CHANGES;

    return Object.freeze({
      headline: updateElement('[data-dynamic="headline"]', variant.headline),
      description: updateElement('[data-dynamic="description"]', variant.description),
      cta: updateElement('[data-dynamic="cta"]', variant.cta),
      benefit: updateElement('[data-dynamic="benefit"]', variant.benefit),
      useCase: updateElement('[data-dynamic="use-case"]', variant.useCase),
      image: updateImage('[data-dynamic="hero-image"]', variant.image, variant.imageAlt)
    });
  }

  function debugLog(context, variantName, changes) {
    if (!context.debug) return;

    console.group("Dynamic Landing Page Debug");
    console.log("Source:", context.source || "");
    console.log("Campaign:", context.campaign || "");
    console.log("Keyword:", context.keyword || "");
    console.log("Ad:", context.ad || "");
    console.log("Detected Variant:", variantName || "none");
    console.log("Headline Changed:", changes.headline ? "Yes" : "No");
    console.log("CTA Changed:", changes.cta ? "Yes" : "No");
    console.groupEnd();
  }

  function init() {
    try {
      const context = getUrlContext();
      const variantName = detectVariant(context);
      const changes = variantName ? applyVariant(variantName) : NO_CHANGES;
      debugLog(context, variantName, changes);
    } catch (error) {
      // Personalization is an enhancement: on failure the original page simply stays as-is.
      console.warn("Dynamic landing personalization skipped:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
