'use strict';

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const projectRoot = require('path').resolve(__dirname, '..');
const script = fs.readFileSync(require('path').join(projectRoot, 'dynamic-landing.js'), 'utf8');

function runCase(query) {
  const values = {
    headline: 'RFID Solutions for Your Business',
    description: 'Improve visibility and automate operations using RFID.',
    cta: 'Talk to Us',
    benefit: 'Real-time asset visibility',
    useCase: 'Track inventory, tools, and equipment',
    heroImage: '/images/rfid-default.jpg',
    heroAlt: 'RFID tracking solution'
  };
  const listeners = {};
  const elements = {};
  const selectors = {
    '[data-dynamic="headline"]': ['headline', 'text'],
    '[data-dynamic="description"]': ['description', 'text'],
    '[data-dynamic="cta"]': ['cta', 'text'],
    '[data-dynamic="benefit"]': ['benefit', 'text'],
    '[data-dynamic="use-case"]': ['useCase', 'text'],
    '[data-dynamic="hero-image"]': ['heroImage', 'image']
  };
  for (const [selector, [key, type]] of Object.entries(selectors)) {
    elements[selector] = {
      textContent: values[key],
      getAttribute: name => name === 'src' ? values.heroImage : name === 'alt' ? values.heroAlt : null,
      setAttribute: (name, value) => { if (name === 'src') values.heroImage = value; if (name === 'alt') values.heroAlt = value; },
      addEventListener: (name, fn) => { listeners[name] = fn; }
    };
  }
  const logs = [];
  const context = {
    window: { location: { search: query } },
    URLSearchParams,
    document: {
      readyState: 'complete',
      querySelector: selector => elements[selector] || null,
      addEventListener: () => {}
    },
    console: {
      group: () => {}, groupEnd: () => {},
      log: (...args) => logs.push(args),
      warn: (...args) => logs.push(args)
    }
  };
  vm.runInNewContext(script, context);
  for (const [selector, [key]] of Object.entries(selectors)) {
    if (elements[selector].textContent !== undefined && key !== 'heroImage') values[key] = elements[selector].textContent;
  }
  return { values, logs };
}

const tests = [
  ['', 'RFID Solutions for Your Business'],
  ['?keyword=rfid-inventory-tracking', 'Automate Inventory Tracking With RFID'],
  ['?keyword=rfid-tool-tracking', 'Track Every Tool With RFID'],
  ['?keyword=rfid-reader', 'RFID Readers for Reliable Tracking'],
  ['?ad=stop-losing-tools', 'Track Every Tool With RFID'],
  ['?keyword=hello-world', 'RFID Solutions for Your Business'],
  ['?keyword=RFID-TOOL-TRACKING', 'Track Every Tool With RFID'],
  ['?keyword=RfId_ToOl_TrAcKiNg', 'Track Every Tool With RFID'],
  ['?keyword=', 'RFID Solutions for Your Business'],
  ['?unknown=value', 'RFID Solutions for Your Business'],
  ['?keyword=rfid-tool-tracking&ad=rfid-reader&campaign=inventory', 'Track Every Tool With RFID'],
  ['?keyword=<script>alert(1)</script>', 'RFID Solutions for Your Business'],
  ['?keyword=../../images/rfid-tool-tracking.jpg', 'RFID Solutions for Your Business'],
  ['?keyword=rfid-tool-tracking&debug=TRUE', 'Track Every Tool With RFID'],
  ['?campaign=rfid-inventory', 'Automate Inventory Tracking With RFID'],
  ['?campaign=stop-losing-tools', 'Track Every Tool With RFID'],
  ['?campaign=rfid-reader', 'RFID Readers for Reliable Tracking']
];

for (const [query, expected] of tests) {
  const result = runCase(query);
  assert.strictEqual(result.values.headline, expected, query || '(no query)');
}

console.log(`PASS: ${tests.length}/${tests.length} automated personalization tests`);
