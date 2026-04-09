// ════════════════════════════════════════════════════════════════
// EC12 Hospitality Manager — Apps Script Web App
// Version: v5
// ────────────────────────────────────────────────────────────────
// Deploy: Extensions → Apps Script → Deploy → New deployment
//         Type: Web app
//         Execute as: Me
//         Who has access: Anyone within [your org]  (or Anyone)
//
// After deploying, copy the web app URL and embed it in Google Sites:
//   Insert → Embed → paste URL → set height to 900px+
//
// The dashboard reads/writes to localStorage in the user's browser.
// Monday.com API calls go directly from the browser — not via Apps Script.
// ════════════════════════════════════════════════════════════════

function doGet(e) {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setTitle('EC12 — Hospitality Manager')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
