# Copilot Instructions — Bucks2Bar

## Project Overview
**Bucks2Bar** is a single-page, no-build budget tracker. Users enter monthly income and expenses, then view a grouped bar chart. All dependencies are loaded from CDN — there is no package manager, bundler, or server.

## Architecture
- **[index.html](../index.html)** — entire UI: Bootstrap 5 tab shell (Data tab + Chart tab), 12-row input table, action buttons
- **[script.js](../script.js)** — all JS logic: reading inputs, creating/updating Chart.js instance, downloading chart as PNG
- **[prompts/plan-bucks2Bar.prompt.md](../prompts/plan-bucks2Bar.prompt.md)** — VS Code `.prompt.md` file capturing design decisions; use this pattern for future planning prompts

## CDN Dependencies (load order matters)
```html
<!-- Bootstrap CSS in <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

<!-- Before </body> — Bootstrap JS must come before Chart.js and script.js -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
<script src="script.js"></script>
```

## Key Conventions

## UI Elements
All buttons must be a pink color

### Input ID Pattern
Month inputs follow a strict naming convention iterated via `MONTH_KEYS`:
```js
// IDs: income-jan, expense-jan, income-feb, expense-feb, ..., income-dec, expense-dec
const MONTH_KEYS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
document.getElementById(`income-${key}`)
```

### Chart Lifecycle
Always call `.destroy()` before recreating the chart to prevent canvas reuse errors:
```js
if (budgetChart) { budgetChart.destroy(); }
budgetChart = new Chart(ctx, { ... });
```

### Tab Switching (Bootstrap 5)
Use Bootstrap's JS API; do not manually toggle classes:
```js
bootstrap.Tab.getOrCreateInstance(document.getElementById('chart-tab')).show();
```

### Chart Download
Uses `chart.toBase64Image('image/png', 1)` and a synthetic anchor `click()` — no server-side processing.

## Running the App
Open `index.html` directly in a browser — no server needed. All assets are CDN-sourced.

## Currency
All monetary values are in **GBP (£)**. Y-axis ticks and dataset labels use `£` prefix.

## Prompts Workflow
Store AI planning/prompt files in `prompts/` as `.prompt.md` files. These are reusable VS Code prompt files that capture architectural decisions and can be re-invoked via Copilot Chat.
