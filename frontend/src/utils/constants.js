// =============================================================================
//  FinSight — Constants & Utilities
//  Theme: Midnight Aurora
// =============================================================================

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const DEMOS = {
  "Healthy SME":   {companyName:"TechVentures Pvt Ltd",industry:"Technology",revenue:"5000000",prevRevenue:"4200000",netProfit:"750000",totalAssets:"8000000",totalLiabilities:"2400000",currentAssets:"3200000",currentLiabilities:"1500000",inventory:"400000",operatingExpenses:"3800000"},
  "Struggling Co": {companyName:"OldTrade Industries",industry:"Retail",revenue:"2000000",prevRevenue:"2400000",netProfit:"-80000",totalAssets:"5000000",totalLiabilities:"3800000",currentAssets:"900000",currentLiabilities:"1100000",inventory:"300000",operatingExpenses:"1900000"},
  "Growth Stage":  {companyName:"NovaSpark Solutions",industry:"Technology",revenue:"8500000",prevRevenue:"5000000",netProfit:"420000",totalAssets:"12000000",totalLiabilities:"5500000",currentAssets:"4800000",currentLiabilities:"2200000",inventory:"600000",operatingExpenses:"7200000"},
};

export const EMPTY_FORM = {
  companyName:"", industry:"General",
  revenue:"", prevRevenue:"", netProfit:"",
  totalAssets:"", totalLiabilities:"",
  currentAssets:"", currentLiabilities:"",
  inventory:"", operatingExpenses:"",
};

export const LOADING_STEPS = [
  "PARSING FINANCIAL DATA...",
  "COMPUTING ALTMAN Z-SCORE...",
  "RUNNING SCORING ENGINE...",
  "COMPUTING SHAP ATTRIBUTIONS...",
  "CALLING GROQ AI...",
  "BUILDING FORECAST TRAJECTORY...",
];

export const INDUSTRIES = [
  "Technology","Manufacturing","Retail","Healthcare",
  "Finance","Real Estate","Education","General",
];

export const BENCH_LABELS = {
  currentRatio:    "Current Ratio",
  quickRatio:      "Quick Ratio",
  debtRatio:       "Debt Ratio",
  netProfitMargin: "Net Margin",
  revenueGrowth:   "Revenue Growth",
  assetTurnover:   "Asset Turnover",
};

export const QUICK_QUESTIONS = [
  "Why is my score this?",
  "How to reduce debt?",
  "Is my growth healthy?",
  "What's my biggest risk?",
];

// ── Color helpers — Midnight Aurora palette ──────────────────────────────────
export const gradeCol = g =>
  g==="A" ? "#00d4c8" :   // Electric Teal — excellent
  g==="B" ? "#a78bfa" :   // Violet — good
  g==="C" ? "#fbbf24" :   // Amber — caution
            "#fb7185";    // Rose — danger

export const barCol = s =>
  s>=75 ? "#00d4c8" :     // Teal
  s>=50 ? "#a78bfa" :     // Violet
  s>=30 ? "#fbbf24" :     // Amber
          "#fb7185";      // Rose

export const typeCol = t =>
  t==="good" ? "#34d399" :   // Mint
  t==="warn" ? "#fbbf24" :   // Amber
               "#fb7185";    // Rose

// ── Recharts tooltip style — LIGHT TEXT on DARK bg ──────────────────────────
// FIX: always specify color explicitly, never rely on inheritance
export const TOOLTIP_STYLE = {
  background:   "rgba(6,11,20,0.97)",
  border:       "1px solid rgba(0,212,200,0.22)",
  borderRadius: 10,
  fontFamily:   "'JetBrains Mono', monospace",
  fontSize:     11,
  color:        "#e8f4f8",   // ← explicit white — fixes black text bug
  boxShadow:    "0 8px 32px rgba(0,0,0,0.7)",
};

// ── Chart axis tick — explicitly light ────────────────────────────────────
// FIX: fill must be light color, NOT relying on CSS var (SVG ignores CSS color)
export const TICK_STYLE = {
  fill:       "#5e8a9f",   // ← explicit hex, not var() — SVG ignores CSS vars
  fontSize:   10,
  fontFamily: "'JetBrains Mono', monospace",
};
