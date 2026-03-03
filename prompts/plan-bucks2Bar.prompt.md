## Plan: Bucks2Bar — Tabbed Budget Tracker

Bootstrap 5 (CDN) handles layout and tabs; Chart.js (CDN) renders the bar chart. The existing index.html shell and script.js stub are both replaced in-place — no new files needed.

---

**Steps**

1. **Update index.html `<head>`**
   - Change `<title>` to `Bucks2Bar`
   - Add Bootstrap 5 CSS CDN link
   - Add Chart.js CDN `<script>` (before closing `</body>`)
   - Add Bootstrap 5 JS bundle CDN link (needed for tab switching)

2. **Build the Bootstrap tab shell in `<body>`**
   - A centered `container` with an `h1` ("Bucks2Bar") and Bootstrap `nav-tabs` with two tabs: `Data` and `Chart`
   - Two corresponding `tab-pane` divs inside a `tab-content` div

3. **Build the Data tab pane**
   - A `<table>` (or Bootstrap grid) with columns: **Month**, **Income (£)**, **Expenses (£)**
   - 12 rows for Jan–Dec; each income/expense cell contains a `<input type="number" min="0" step="0.01">` with IDs like `income-jan`, `expense-jan`, etc.
   - An **"Update Chart"** `<button class="btn btn-primary">` below the table — clicking this fires the chart render logic in `script.js`

4. **Build the Chart tab pane**
   - A `<canvas id="budgetChart">` sized appropriately (e.g. `width` constrained by its container)

5. **Rewrite script.js**
   - Remove the old `getAllLabels` / `window.onload` stub entirely
   - Define a `months` array `['Jan','Feb',...,'Dec']` and matching input ID suffixes
   - `getChartData()` — reads all 12 income and 12 expense inputs, returns `{ incomes[], expenses[] }`
   - `renderChart(incomes, expenses)` — creates/updates a Chart.js grouped bar chart on `#budgetChart` with two datasets ("Income" in green, "Expenses" in red), using `months` as labels
     - Stores the Chart instance in a module-level variable; calls `.destroy()` before re-creating to avoid canvas reuse errors
   - Attach a `click` listener to the "Update Chart" button that calls `getChartData()` then `renderChart()`

---

**Verification**
- Open index.html in a browser (no server needed — all CDN)
- Enter values in the Data tab, click "Update Chart", switch to Chart tab — grouped bars for each month should match inputs
- Updating values and clicking the button again should refresh the chart cleanly

**Decisions**
- Bootstrap 5 over Tailwind/Bulma: built-in tab JS, form-control styles, and grid with no build step
- Chart.js over ApexCharts/D3: minimal setup for a grouped bar chart from a CDN `<script>` tag
- Chart update on button click (per user preference) rather than on tab-switch
- Input IDs use pattern `income-jan` / `expense-jan` for predictable iteration in JS
