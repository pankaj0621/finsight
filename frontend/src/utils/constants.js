// =============================================================================
//  FinSight — Constants & Utilities
// =============================================================================

export const API_BASE = import.meta.env.VITE_API_URL || "https://finsight-backend-f0pq.onrender.com";

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

// Color helpers
export const gradeCol = g =>
  g==="A" ? "#f59e0b" :
  g==="B" ? "#06b6d4" :
  g==="C" ? "#f97316" : "#f43f5e";

export const barCol = s =>
  s>=75 ? "#f59e0b" :
  s>=50 ? "#06b6d4" :
  s>=30 ? "#f97316" : "#f43f5e";

export const typeCol = t =>
  t==="good" ? "#10b981" :
  t==="warn" ? "#f97316" : "#f43f5e";

// Tooltip style for all Recharts charts — fixes black text bug
export const TOOLTIP_STYLE = {
  background:   "rgba(16,18,26,0.98)",
  border:       "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  fontFamily:   "Fira Code, monospace",
  fontSize:     11,
  color:        "#e2e8f0",
};

// Chart axis tick style
export const TICK_STYLE = {
  fill:       "#475569",
  fontSize:   10,
  fontFamily: "Fira Code, monospace",
};
