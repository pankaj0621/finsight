// =============================================================================
//  FinSight — Main React Component
//  Connects to the FastAPI backend for AI analysis and document extraction.
// =============================================================================

import { useState, useEffect, useRef } from "react";
import { toPng } from 'html-to-image';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ReferenceLine, Area, AreaChart, CartesianGrid, Line,
} from "recharts";

// Base URL of the FastAPI backend — reads from VITE_API_URL in .env
const API_BASE = import.meta.env.VITE_API_URL || "https://finsight-backend-f0pq.onrender.com";

// =============================================================================
// Fonts & Global CSS (injected via <style> tag)
// =============================================================================
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');`;

const styles = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --surface2: #18181f; --surface3: #1e1e28;
    --border: #2a2a35; --border2: #3a3a48;
    --accent: #c8f542; --accent2: #42f5c8; --accent3: #a78bfa;
    --danger: #f54242; --warning: #f5a742;
    --text: #e8e8f0; --muted: #6b6b80;
    --font-display: 'DM Serif Display', serif;
    --font-mono: 'DM Mono', monospace;
    --font-body: 'Outfit', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  .app { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.4;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  }
  .glow-orb { position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
  .glow-1 { width:600px;height:600px;background:rgba(200,245,66,0.04);top:-200px;right:-100px; }
  .glow-2 { width:400px;height:400px;background:rgba(66,245,200,0.03);bottom:100px;left:-100px; }
  .glow-3 { width:300px;height:300px;background:rgba(167,139,250,0.03);top:50%;left:40%; }
  .container { max-width:1150px;margin:0 auto;padding:0 24px;position:relative;z-index:1; }

  /* --- Header --- */
  .header { padding:40px 0 20px;border-bottom:1px solid var(--border);display:flex;align-items:flex-end;justify-content:space-between; }
  .logo { display:flex;align-items:center;gap:14px; }
  .logo-icon { width:44px;height:44px;background:var(--accent);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-weight:500;color:#0a0a0f;font-size:18px; }
  .logo-text h1 { font-family:var(--font-display);font-size:26px;color:var(--text);line-height:1; }
  .logo-text p { font-size:12px;color:var(--muted);font-family:var(--font-mono);margin-top:3px;letter-spacing:0.08em; }
  .api-status { font-family:var(--font-mono);font-size:11px;padding:5px 10px;border-radius:4px;letter-spacing:0.1em; }
  .api-ok  { color:var(--accent);border:1px solid rgba(200,245,66,0.3); }
  .api-err { color:var(--danger);border:1px solid rgba(245,66,66,0.3); }

  /* --- Hero section --- */
  .hero { padding:60px 0 40px; }
  .hero h2 { font-family:var(--font-display);font-size:clamp(34px,5vw,56px);line-height:1.1;color:var(--text);max-width:700px; }
  .hero h2 em { color:var(--accent);font-style:italic; }
  .hero p { margin-top:16px;color:var(--muted);font-size:16px;max-width:520px;line-height:1.7; }

  /* --- Input mode tabs --- */
  .tabs { display:flex;gap:4px;margin:40px 0 32px;border-bottom:1px solid var(--border);flex-wrap:wrap; }
  .tab { padding:10px 20px;font-family:var(--font-mono);font-size:13px;color:var(--muted);cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.2s;letter-spacing:0.05em; }
  .tab:hover { color:var(--text); }
  .tab.active { color:var(--accent);border-bottom-color:var(--accent); }

  /* --- Document upload zone --- */
  .upload-zone { border:2px dashed var(--border2);border-radius:16px;padding:60px 40px;text-align:center;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden;background:var(--surface); }
  .upload-zone:hover,.upload-zone.drag-over { border-color:rgba(200,245,66,0.5);background:rgba(200,245,66,0.03); }
  .upload-icon { font-size:48px;margin-bottom:16px; }
  .upload-zone h3 { font-family:var(--font-display);font-size:22px;margin-bottom:8px; }
  .upload-zone p { color:var(--muted);font-size:14px; }
  .upload-zone input[type="file"] { position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%; }
  .upload-progress { margin-top:24px; }
  .upload-bar { height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:8px; }
  .upload-bar-fill { height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:2px;transition:width 0.3s; }
  .upload-status { font-family:var(--font-mono);font-size:12px;color:var(--muted); }

  /* Extracted data preview card */
  .extracted-preview { background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-top:20px;text-align:left; }
  .extracted-preview h4 { font-family:var(--font-mono);font-size:11px;color:var(--accent2);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px; }
  .extracted-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
  .extracted-item { display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px; }
  .extracted-item:last-child { border-bottom:none; }
  .extracted-key { color:var(--muted);font-family:var(--font-mono);font-size:11px; }
  .extracted-val { color:var(--accent);font-family:var(--font-mono);font-size:12px;font-weight:500; }

  /* --- Form fields --- */
  .form-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
  @media(max-width:600px){.form-grid{grid-template-columns:1fr;}}
  .form-section { margin-bottom:32px; }
  .section-label { font-family:var(--font-mono);font-size:11px;color:var(--accent2);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:8px; }
  .section-label::after { content:'';flex:1;height:1px;background:var(--border); }
  .field { display:flex;flex-direction:column;gap:6px; }
  .field label { font-size:12px;color:var(--muted);font-family:var(--font-mono);letter-spacing:0.05em; }
  .field input,.field select { background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:8px;font-family:var(--font-mono);font-size:14px;transition:border-color 0.2s,box-shadow 0.2s;outline:none; }
  .field input:focus,.field select:focus { border-color:rgba(200,245,66,0.5);box-shadow:0 0 0 3px rgba(200,245,66,0.07); }
  .field input::placeholder { color:var(--muted);opacity:0.5; }
  .field select option { background:var(--surface2); }

  /* Multi-year tabs */
  .year-tabs { display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap; }
  .year-tab { padding:6px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;font-family:var(--font-mono);font-size:12px;color:var(--muted);cursor:pointer;transition:all 0.2s; }
  .year-tab.active { border-color:var(--accent);color:var(--accent);background:rgba(200,245,66,0.07); }
  .add-year-btn { padding:6px 14px;background:none;border:1px dashed var(--border2);border-radius:6px;font-family:var(--font-mono);font-size:12px;color:var(--muted);cursor:pointer;transition:all 0.2s; }
  .add-year-btn:hover { border-color:var(--accent2);color:var(--accent2); }

  /* Primary action button */
  .btn-analyze { width:100%;padding:16px;background:var(--accent);color:#0a0a0f;border:none;border-radius:10px;font-family:var(--font-mono);font-size:14px;font-weight:500;cursor:pointer;letter-spacing:0.08em;transition:all 0.2s;margin-top:8px; }
  .btn-analyze:hover { background:#d4f760;transform:translateY(-1px);box-shadow:0 8px 30px rgba(200,245,66,0.25); }
  .btn-analyze:disabled { opacity:0.5;cursor:not-allowed;transform:none; }

  /* Demo preset buttons */
  .demo-row { display:flex;gap:10px;margin-bottom:28px;flex-wrap:wrap; }
  .demo-btn { padding:7px 14px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);border-radius:6px;font-family:var(--font-mono);font-size:12px;cursor:pointer;transition:all 0.2s; }
  .demo-btn:hover { border-color:var(--accent2);color:var(--accent2); }

  /* Error message banner */
  .error-banner { background:rgba(245,66,66,0.1);border:1px solid rgba(245,66,66,0.3);border-radius:10px;padding:16px 20px;margin-bottom:20px;font-family:var(--font-mono);font-size:13px;color:var(--danger); }

  /* --- Results section --- */
  .results { animation:fadeUp 0.5s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }

  /* Score hero card
     BUG FIX: added flex-wrap so ring + text stack on mobile instead of overflowing */
  .score-hero { background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:36px;display:flex;align-items:center;gap:40px;flex-wrap:wrap;margin-bottom:24px;position:relative;overflow:hidden; }
  .score-hero::before { content:'';position:absolute;top:0;left:0;right:0;height:2px; }
  .score-hero.grade-A::before { background:linear-gradient(90deg,var(--accent),transparent); }
  .score-hero.grade-B::before { background:linear-gradient(90deg,var(--accent2),transparent); }
  .score-hero.grade-C::before { background:linear-gradient(90deg,var(--warning),transparent); }
  .score-hero.grade-D::before { background:linear-gradient(90deg,var(--danger),transparent); }

  /* Animated SVG score ring */
  .score-ring { flex-shrink:0;width:120px;height:120px;position:relative;display:flex;align-items:center;justify-content:center; }
  .score-ring svg { position:absolute;inset:0;transform:rotate(-90deg); }
  .score-ring-track { fill:none;stroke:var(--border);stroke-width:8; }
  .score-ring-fill { fill:none;stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset 1s ease; }
  .score-num { font-family:var(--font-display);font-size:38px;color:var(--text);line-height:1;position:relative;z-index:1; }
  .score-num span { font-size:14px;color:var(--muted);font-family:var(--font-mono); }
  .score-info h3 { font-family:var(--font-display);font-size:24px;margin-bottom:6px; }
  .grade-badge { display:inline-block;padding:3px 12px;border-radius:4px;font-family:var(--font-mono);font-size:12px;font-weight:500;margin-bottom:12px;letter-spacing:0.08em; }
  .grade-A .grade-badge { background:rgba(200,245,66,0.15);color:var(--accent); }
  .grade-B .grade-badge { background:rgba(66,245,200,0.15);color:var(--accent2); }
  .grade-C .grade-badge { background:rgba(245,167,66,0.15);color:var(--warning); }
  .grade-D .grade-badge { background:rgba(245,66,66,0.15);color:var(--danger); }
  .score-summary { color:var(--muted);font-size:14px;line-height:1.7;max-width:380px; }

  /* Altman Z-Score banner */
  .zscore-banner { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin-bottom:24px;display:flex;align-items:center;gap:24px;flex-wrap:wrap; }
  .zscore-val { font-family:var(--font-display);font-size:36px; }
  .zscore-label { font-family:var(--font-mono);font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px; }
  .zscore-zone { font-family:var(--font-mono);font-size:13px;font-weight:500; }
  .zscore-bar-wrap { flex:1;min-width:200px; }
  .zscore-bar { height:8px;background:var(--border);border-radius:4px;overflow:hidden; }
  .zscore-bar-fill { height:100%;border-radius:4px;transition:width 1.2s ease; }
  .zscore-markers { display:flex;justify-content:space-between;margin-top:6px;font-family:var(--font-mono);font-size:10px;color:var(--muted); }

  /* Key metric cards */
  .metrics-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:24px; }
  .metric-card { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;transition:border-color 0.2s; }
  .metric-card:hover { border-color:rgba(200,245,66,0.2); }
  .metric-card-label { font-family:var(--font-mono);font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px; }
  .metric-card-value { font-family:var(--font-display);font-size:28px;margin-bottom:4px; }
  .metric-card-sub { font-size:12px;color:var(--muted); }
  .metric-bar { height:3px;background:var(--border);border-radius:2px;margin-top:14px;overflow:hidden; }
  .metric-bar-fill { height:100%;border-radius:2px;transition:width 1s ease; }
  .good{color:var(--accent);}.ok{color:var(--accent2);}.warn{color:var(--warning);}.bad{color:var(--danger);}

  /* Chart cards */
  .charts-row { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px; }
  @media(max-width:700px){.charts-row{grid-template-columns:1fr;}}
  .chart-card { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px; }
  .chart-card h4 { font-family:var(--font-mono);font-size:12px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:20px; }
  .chart-full { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:24px; }
  .chart-full h4 { font-family:var(--font-mono);font-size:12px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px; }
  .chart-full > p { font-size:13px;color:var(--muted);margin-bottom:20px; }

  /* SHAP attribution chart */
  .shap-section { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:24px; }
  .shap-section h4 { font-family:var(--font-mono);font-size:12px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px; }
  .shap-subtitle { font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.6; }
  .shap-row { display:flex;align-items:center;gap:12px;margin-bottom:12px; }
  .shap-label { font-family:var(--font-mono);font-size:12px;color:var(--text);width:130px;flex-shrink:0;text-align:right; }
  .shap-bar-area { flex:1;display:flex;align-items:center;position:relative;height:24px; }
  .shap-zero { position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--border2); }
  .shap-impact { font-family:var(--font-mono);font-size:12px;width:56px;flex-shrink:0; }
  .shap-legend { display:flex;gap:20px;margin-top:16px;padding-top:14px;border-top:1px solid var(--border); }
  .shap-legend-item { display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:11px;color:var(--muted); }
  .shap-legend-dot { width:10px;height:10px;border-radius:2px; }

  /* AI insight list */
  .insights { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:24px; }
  .insights h4 { font-family:var(--font-mono);font-size:12px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px; }
  .insight-item { display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);align-items:flex-start; }
  .insight-item:last-child { border-bottom:none;padding-bottom:0; }
  .insight-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px; }
  .insight-item h5 { font-size:14px;font-weight:500;margin-bottom:3px; }
  .insight-item p { font-size:13px;color:var(--muted);line-height:1.6; }

  /* Risk / investment cards */
  .risk-row { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px; }
  @media(max-width:600px){.risk-row{grid-template-columns:1fr;}}
  .risk-card { background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px; }
  .risk-card h4 { font-family:var(--font-mono);font-size:11px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px; }
  .risk-level { font-family:var(--font-display);font-size:22px;margin-bottom:6px; }
  .risk-desc { font-size:13px;color:var(--muted);line-height:1.6; }

  /* Back button & loading */
  .action-buttons { display:flex; gap:16px; align-items:center; margin-bottom:28px; flex-wrap:wrap; }
  .back-btn { display:flex;align-items:center;gap:8px;background:none;border:1px solid var(--border);color:var(--muted);padding:9px 16px;border-radius:8px;font-family:var(--font-mono);font-size:13px;cursor:pointer;transition:all 0.2s; }
  .back-btn:hover { border-color:var(--text);color:var(--text); }
  .download-btn { display:flex;align-items:center;gap:8px;background:var(--accent);color:#0a0a0f;padding:9px 16px;border-radius:8px;font-family:var(--font-mono);font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all 0.2s; }
  .download-btn:hover { background:#d4f760; transform:translateY(-1px); }
  .download-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  
  .loading-state { text-align:center;padding:80px 0; }
  .spinner { width:48px;height:48px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 20px; }
  @keyframes spin { to{transform:rotate(360deg);} }
  .loading-state > p { font-family:var(--font-mono);font-size:13px;color:var(--muted);letter-spacing:0.08em; }
  .loading-steps { margin-top:24px;display:flex;flex-direction:column;gap:8px;align-items:center; }
  .loading-step { font-family:var(--font-mono);font-size:11px;color:var(--border2);letter-spacing:0.06em;transition:color 0.5s; }
  .loading-step.active { color:var(--accent2); }
  .loading-step.done   { color:var(--accent); }

  /* "Powered by Groq" badge */
  .ai-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(66,245,200,0.08);border:1px solid rgba(66,245,200,0.25);border-radius:20px;padding:4px 12px;font-family:var(--font-mono);font-size:11px;color:var(--accent2);letter-spacing:0.06em;margin-bottom:20px; }
  .ai-dot { width:6px;height:6px;border-radius:50%;background:var(--accent2);animation:pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.3;} }

  .forecast-note { font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:12px; }
  .forecast-note span { color:var(--warning); }
`;

// =============================================================================
// Demo Presets
// =============================================================================
const DEMOS = {
  "Healthy SME": {
    companyName:"TechVentures Pvt Ltd", industry:"Technology",
    revenue:"5000000", prevRevenue:"4200000", netProfit:"750000",
    totalAssets:"8000000", totalLiabilities:"2400000",
    currentAssets:"3200000", currentLiabilities:"1500000",
    inventory:"400000", operatingExpenses:"3800000",
  },
  "Struggling Co": {
    companyName:"OldTrade Industries", industry:"Retail",
    revenue:"2000000", prevRevenue:"2400000", netProfit:"-80000",
    totalAssets:"5000000", totalLiabilities:"3800000",
    currentAssets:"900000", currentLiabilities:"1100000",
    inventory:"300000", operatingExpenses:"1900000",
  },
  "Growth Stage": {
    companyName:"NovaSpark Solutions", industry:"Technology",
    revenue:"8500000", prevRevenue:"5000000", netProfit:"420000",
    totalAssets:"12000000", totalLiabilities:"5500000",
    currentAssets:"4800000", currentLiabilities:"2200000",
    inventory:"600000", operatingExpenses:"7200000",
  },
};

const EMPTY_FORM = {
  companyName:"", industry:"General",
  revenue:"", prevRevenue:"", netProfit:"",
  totalAssets:"", totalLiabilities:"",
  currentAssets:"", currentLiabilities:"", inventory:"", operatingExpenses:"",
};

// BUG FIX: loading step labels now match the actual AI engine (Groq, not Gemini)
const LOADING_STEPS = [
  "PARSING FINANCIAL DATA...",
  "COMPUTING ALTMAN Z-SCORE...",
  "RUNNING SCORING ENGINE...",
  "COMPUTING SHAP ATTRIBUTIONS...",
  "CALLING GROQ AI...",
  "BUILDING FORECAST TRAJECTORY...",
];

// =============================================================================
// Main Component
// =============================================================================
export default function FinSight() {
  const [view,        setView]        = useState("form");
  const [inputMode,   setInputMode]   = useState("manual");
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [yearlyData,  setYearlyData]  = useState([{
    year:"2024", revenue:"", netProfit:"", totalAssets:"", totalLiabilities:"",
    currentAssets:"", currentLiabilities:"1", inventory:"", operatingExpenses:"",
  }]);
  const [activeYear,  setActiveYear]  = useState(0);
  const [result,      setResult]      = useState(null);
  const [animScore,   setAnimScore]   = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [uploadState, setUploadState] = useState({ status:"idle", progress:0, extracted:null });
  const [isDragOver,  setIsDragOver]  = useState(false);
  const [apiStatus,   setApiStatus]   = useState("checking");
  const [error,       setError]       = useState("");

  // Refs for PDF Generation
  const radarRef = useRef(null);
  const barRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // Check backend availability on mount
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.ok ? setApiStatus("ok") : setApiStatus("err"))
      .catch(() => setApiStatus("err"));
  }, []);

  const set          = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setYearField = (idx, k, v) => setYearlyData(prev => prev.map((y, i) => i === idx ? { ...y, [k]: v } : y));

  const addYear = () => {
    const last = yearlyData[yearlyData.length - 1];
    // BUG FIX: capture new index BEFORE setState since yearlyData.length
    // reflects the current length, which is exactly the index of the new item.
    const newIndex = yearlyData.length;
    setYearlyData(prev => [...prev, {
      year: String((parseInt(last.year) || 2024) + 1),
      revenue:"", netProfit:"", totalAssets:"", totalLiabilities:"",
      currentAssets:"", currentLiabilities:"1", inventory:"", operatingExpenses:"",
    }]);
    setActiveYear(newIndex);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadState({ status:"processing", progress:10, extracted:null });
    const tick = setInterval(() => setUploadState(p => ({ ...p, progress: Math.min(88, p.progress + 14) })), 200);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch(`${API_BASE}/api/extract-document`, { method:"POST", body:fd });
      const data = await res.json();
      clearInterval(tick);
      if (!res.ok) throw new Error(data.detail || "Extraction failed");
      setUploadState({ status:"done", progress:100, extracted: data.data });
      setForm(f => ({ ...f, ...data.data }));
    } catch (e) {
      clearInterval(tick);
      setUploadState({ status:"error", progress:0, extracted:null });
      setError(`Document extraction failed: ${e.message}`);
    }
  };

  const analyze = async () => {
    setError("");
    setView("loading");
    setLoadingStep(0);

    // BUG FIX: interval fires every 1200ms (not 800ms) so the steps pace
    // themselves more realistically against typical Groq response times (~3-5s).
    const stepInterval = setInterval(
      () => setLoadingStep(p => Math.min(LOADING_STEPS.length - 1, p + 1)),
      1200
    );

    const activeForm =
      inputMode === "upload" && uploadState.extracted
        ? { ...form, ...uploadState.extracted }
        : inputMode === "multiyear"
        ? { ...form, ...yearlyData[yearlyData.length - 1] }
        : form;

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          financialData: {
            companyName:        activeForm.companyName || "SME Company",
            industry:           activeForm.industry || "General",
            revenue:            parseFloat(activeForm.revenue) || 0,
            prevRevenue:        parseFloat(activeForm.prevRevenue) || null,
            netProfit:          parseFloat(activeForm.netProfit) || 0,
            totalAssets:        parseFloat(activeForm.totalAssets) || 0,
            totalLiabilities:   parseFloat(activeForm.totalLiabilities) || 0,
            currentAssets:      parseFloat(activeForm.currentAssets) || 0,
            currentLiabilities: parseFloat(activeForm.currentLiabilities) || 1,
            inventory:          parseFloat(activeForm.inventory) || 0,
            operatingExpenses:  parseFloat(activeForm.operatingExpenses) || null,
          },
          yearlyData: yearlyData
            .filter(y => y.revenue)
            .map(y => ({
              year: y.year,
              revenue:            parseFloat(y.revenue) || 0,
              netProfit:          parseFloat(y.netProfit) || 0,
              totalAssets:        parseFloat(y.totalAssets) || 0,
              totalLiabilities:   parseFloat(y.totalLiabilities) || 0,
              currentAssets:      parseFloat(y.currentAssets) || 0,
              currentLiabilities: parseFloat(y.currentLiabilities) || 1,
              inventory:          parseFloat(y.inventory) || 0,
              operatingExpenses:  parseFloat(y.operatingExpenses) || 0,
            })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      clearInterval(stepInterval);
      setResult(data);
      setAnimScore(0);
      setTimeout(() => setView("result"), 300);
    } catch (e) {
      clearInterval(stepInterval);
      setError(`Analysis failed: ${e.message}. Make sure the backend is running on port 8000.`);
      setView("form");
    }
  };

  // ===========================================================================
  // Download PDF Function
  // ===========================================================================
  const downloadPDF = async () => {
    if (!result) return;
    setDownloading(true);

    try {
      let radarBase64 = null;
      let barBase64 = null;

      // Ensure html-to-image is installed: npm install html-to-image
      if (radarRef.current) {
        radarBase64 = await toPng(radarRef.current, { backgroundColor: '#111118' });
      }
      if (barRef.current) {
        barBase64 = await toPng(barRef.current, { backgroundColor: '#111118' });
      }

      const activeForm =
        inputMode === "upload" && uploadState.extracted
          ? { ...form, ...uploadState.extracted }
          : inputMode === "multiyear"
          ? { ...form, ...yearlyData[yearlyData.length - 1] }
          : form;

      const response = await fetch(`${API_BASE}/api/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: result,
          formData: {
            companyName: activeForm.companyName || "SME Company",
            industry: activeForm.industry || "General",
          },
          charts: {
            radar: radarBase64,
            bar: barBase64
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF on server");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FinSight_Report_${activeForm.companyName || "SME"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("PDF generation error:", e);
      alert(`Failed to download PDF report: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Animate the score ring counter after results load
  useEffect(() => {
    if (view === "result" && result) {
      let s = 0;
      const end  = result.totalScore;
      const step = () => { s += 2; setAnimScore(Math.min(s, end)); if (s < end) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }, [view, result]);

  const circumference = 2 * Math.PI * 52;
  const dashOffset    = result ? circumference - (animScore / 100) * circumference : circumference;

  const radarData = result
    ? Object.entries(result.scores).map(([k, v]) => ({
        subject: k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
        value: v, fullMark: 100,
      }))
    : [];

  const barData = result ? [
    { name:"Liquidity",  score: result.scores.liquidity },
    { name:"Quick",      score: result.scores.quickRatio },
    { name:"Debt",       score: result.scores.debtHealth },
    { name:"Profit",     score: result.scores.profitability },
    { name:"Growth",     score: result.scores.growth },
    { name:"Efficiency", score: result.scores.efficiency },
  ] : [];

  const getBarColor = s => s >= 75 ? "#c8f542" : s >= 50 ? "#42f5c8" : s >= 30 ? "#f5a742" : "#f54242";
  const typeColor   = t => t === "good" ? "#c8f542" : t === "warn" ? "#f5a742" : "#f54242";
  const maxShap     = result ? Math.max(...(result.shapValues || []).map(s => Math.abs(s.contribution)), 1) : 1;

  const canAnalyze =
    inputMode === "upload"    ? uploadState.status === "done" :
    inputMode === "multiyear" ? yearlyData.some(y => y.revenue) :
                                !!form.revenue && !!form.totalAssets;

  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="noise" />
        <div className="glow-orb glow-1" />
        <div className="glow-orb glow-2" />
        <div className="glow-orb glow-3" />

        <div className="container">

          {/* ── Header ── */}
          <header className="header">
            <div className="logo">
              <div className="logo-icon">FS</div>
              <div className="logo-text">
                <h1>FinSight</h1>
                <p>SME FINANCIAL ANALYTICS</p>
              </div>
            </div>
            <span className={`api-status ${apiStatus === "ok" ? "api-ok" : "api-err"}`}>
              {apiStatus === "ok"   ? "● BACKEND CONNECTED" :
               apiStatus === "err" ? "● BACKEND OFFLINE"   : "● CHECKING..."}
            </span>
          </header>

          {/* ── Hero ── */}
          {view !== "result" && (
            <div className="hero">
              {/* BUG FIX: hero text updated to match actual AI engine (Groq) */}
              <h2>AI-Powered Financial Health <em>Scoring</em> for SMEs</h2>
              <p>
                Groq LLaMA-powered analysis with Altman Z-Score bankruptcy detection,
                SHAP explainability, real document OCR, and 12-month trajectory forecasting.
              </p>
            </div>
          )}

          {error && <div className="error-banner">⚠ {error}</div>}

          {/* ================================================================
              FORM VIEW
          ================================================================ */}
          {view === "form" && (
            <>
              <div className="tabs">
                <button className={`tab ${inputMode==="manual"    ? "active":""}`} onClick={()=>setInputMode("manual")}>MANUAL ENTRY</button>
                <button className={`tab ${inputMode==="upload"    ? "active":""}`} onClick={()=>setInputMode("upload")}>UPLOAD DOCUMENT</button>
                <button className={`tab ${inputMode==="multiyear" ? "active":""}`} onClick={()=>setInputMode("multiyear")}>MULTI-YEAR</button>
              </div>

              <div className="demo-row">
                <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--muted)",alignSelf:"center"}}>Try demo:</span>
                {Object.keys(DEMOS).map(k => (
                  <button key={k} className="demo-btn" onClick={()=>{ setForm(DEMOS[k]); setInputMode("manual"); }}>{k}</button>
                ))}
              </div>

              {/* ── Upload Mode ── */}
              {inputMode === "upload" && (
                <div style={{marginBottom:32}}>
                  <div
                    className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files[0]); }}
                  >
                    <input type="file" accept=".pdf,.xlsx,.xls,.csv"
                      onChange={e => handleFileUpload(e.target.files[0])} />
                    <div className="upload-icon">📄</div>
                    <h3>Drop your Balance Sheet or P&L Statement</h3>
                    <p>
                      Supported: PDF (text-based or scanned), Excel (.xlsx/.xls), CSV<br />
                      Text extracted via PyMuPDF / Tesseract OCR / pandas, then parsed by Groq AI.
                    </p>
                    {uploadState.status !== "idle" && (
                      <div className="upload-progress">
                        <div className="upload-bar">
                          <div className="upload-bar-fill" style={{width: uploadState.progress + "%"}} />
                        </div>
                        <div className="upload-status">
                          {uploadState.status === "processing" && `EXTRACTING... ${uploadState.progress}%`}
                          {uploadState.status === "done"       && `✓ EXTRACTION COMPLETE — ${uploadState.extracted?.fieldsExtracted} fields (${uploadState.extracted?.confidence}% confidence)`}
                          {uploadState.status === "error"      && "✗ EXTRACTION FAILED — see error above or use manual entry"}
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadState.extracted && (
                    <div className="extracted-preview">
                      <h4>Extracted Data — Review Before Analyzing</h4>
                      <div className="extracted-grid">
                        {[
                          ["Company",           uploadState.extracted.companyName],
                          ["Revenue",           "₹" + Number(uploadState.extracted.revenue).toLocaleString()],
                          ["Net Profit",        "₹" + Number(uploadState.extracted.netProfit).toLocaleString()],
                          ["Total Assets",      "₹" + Number(uploadState.extracted.totalAssets).toLocaleString()],
                          ["Total Liabilities", "₹" + Number(uploadState.extracted.totalLiabilities).toLocaleString()],
                          ["Current Assets",    "₹" + Number(uploadState.extracted.currentAssets).toLocaleString()],
                          ["Current Liab.",     "₹" + Number(uploadState.extracted.currentLiabilities).toLocaleString()],
                          ["Op. Expenses",      "₹" + Number(uploadState.extracted.operatingExpenses).toLocaleString()],
                        ].map(([k, v]) => (
                          <div className="extracted-item" key={k}>
                            <span className="extracted-key">{k}</span>
                            <span className="extracted-val">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Manual Entry Mode ── */}
              {inputMode === "manual" && (
                <>
                  <div className="form-section">
                    <div className="section-label">Company Info</div>
                    <div className="form-grid">
                      <div className="field">
                        <label>COMPANY NAME</label>
                        <input placeholder="e.g. Acme Pvt Ltd" value={form.companyName} onChange={e=>set("companyName",e.target.value)} />
                      </div>
                      <div className="field">
                        <label>INDUSTRY SECTOR</label>
                        <select value={form.industry} onChange={e=>set("industry",e.target.value)}>
                          {["General","Technology","Manufacturing","Retail","Healthcare","Construction","Finance","Agriculture"].map(i=><option key={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="section-label">Income Statement (₹)</div>
                    <div className="form-grid">
                      <div className="field"><label>TOTAL REVENUE (CURRENT YEAR)</label><input type="number" placeholder="5000000" value={form.revenue}          onChange={e=>set("revenue",e.target.value)} /></div>
                      <div className="field"><label>TOTAL REVENUE (PREVIOUS YEAR)</label><input type="number" placeholder="4200000" value={form.prevRevenue}      onChange={e=>set("prevRevenue",e.target.value)} /></div>
                      <div className="field"><label>NET PROFIT / LOSS</label>            <input type="number" placeholder="750000"  value={form.netProfit}         onChange={e=>set("netProfit",e.target.value)} /></div>
                      <div className="field"><label>OPERATING EXPENSES</label>           <input type="number" placeholder="3800000" value={form.operatingExpenses} onChange={e=>set("operatingExpenses",e.target.value)} /></div>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="section-label">Balance Sheet (₹)</div>
                    <div className="form-grid">
                      <div className="field"><label>TOTAL ASSETS</label>       <input type="number" placeholder="8000000" value={form.totalAssets}       onChange={e=>set("totalAssets",e.target.value)} /></div>
                      <div className="field"><label>TOTAL LIABILITIES</label>  <input type="number" placeholder="2400000" value={form.totalLiabilities}  onChange={e=>set("totalLiabilities",e.target.value)} /></div>
                      <div className="field"><label>CURRENT ASSETS</label>     <input type="number" placeholder="3200000" value={form.currentAssets}     onChange={e=>set("currentAssets",e.target.value)} /></div>
                      <div className="field"><label>CURRENT LIABILITIES</label><input type="number" placeholder="1500000" value={form.currentLiabilities} onChange={e=>set("currentLiabilities",e.target.value)} /></div>
                      <div className="field"><label>INVENTORY VALUE</label>    <input type="number" placeholder="400000"  value={form.inventory}          onChange={e=>set("inventory",e.target.value)} /></div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Multi-Year Mode ── */}
              {inputMode === "multiyear" && (
                <>
                  <p style={{color:"var(--muted)",fontSize:14,marginBottom:16,lineHeight:1.7}}>
                    Enter data for multiple fiscal years. The AI will reconstruct historical scores
                    and project the financial health trajectory for the next 8 quarters.
                  </p>
                  <div className="year-tabs">
                    {yearlyData.map((y, i) => (
                      <button key={i} className={`year-tab ${activeYear===i?"active":""}`} onClick={()=>setActiveYear(i)}>FY {y.year}</button>
                    ))}
                    {yearlyData.length < 4 && (
                      <button className="add-year-btn" onClick={addYear}>+ Add Year</button>
                    )}
                  </div>
                  <div className="form-section">
                    <div className="section-label">FY {yearlyData[activeYear]?.year} — Financial Data</div>
                    <div className="form-grid">
                      <div className="field"><label>FISCAL YEAR</label>         <input type="number" value={yearlyData[activeYear]?.year}               onChange={e=>setYearField(activeYear,"year",e.target.value)} /></div>
                      <div className="field"><label>TOTAL REVENUE</label>       <input type="number" value={yearlyData[activeYear]?.revenue}            onChange={e=>setYearField(activeYear,"revenue",e.target.value)} /></div>
                      <div className="field"><label>NET PROFIT / LOSS</label>   <input type="number" value={yearlyData[activeYear]?.netProfit}          onChange={e=>setYearField(activeYear,"netProfit",e.target.value)} /></div>
                      <div className="field"><label>TOTAL ASSETS</label>        <input type="number" value={yearlyData[activeYear]?.totalAssets}        onChange={e=>setYearField(activeYear,"totalAssets",e.target.value)} /></div>
                      <div className="field"><label>TOTAL LIABILITIES</label>   <input type="number" value={yearlyData[activeYear]?.totalLiabilities}   onChange={e=>setYearField(activeYear,"totalLiabilities",e.target.value)} /></div>
                      <div className="field"><label>CURRENT ASSETS</label>      <input type="number" value={yearlyData[activeYear]?.currentAssets}      onChange={e=>setYearField(activeYear,"currentAssets",e.target.value)} /></div>
                      <div className="field"><label>CURRENT LIABILITIES</label> <input type="number" value={yearlyData[activeYear]?.currentLiabilities} onChange={e=>setYearField(activeYear,"currentLiabilities",e.target.value)} /></div>
                      <div className="field"><label>OPERATING EXPENSES</label>  <input type="number" value={yearlyData[activeYear]?.operatingExpenses}  onChange={e=>setYearField(activeYear,"operatingExpenses",e.target.value)} /></div>
                    </div>
                  </div>
                </>
              )}

              <button className="btn-analyze" onClick={analyze} disabled={!canAnalyze || apiStatus === "err"}>
                {apiStatus === "err" ? "BACKEND OFFLINE — START SERVER FIRST" : "ANALYZE WITH GROQ AI →"}
              </button>
              <div style={{height:60}} />
            </>
          )}

          {/* ================================================================
              LOADING VIEW
          ================================================================ */}
          {view === "loading" && (
            <div className="loading-state">
              <div className="spinner" />
              <p>GROQ AI ANALYSIS IN PROGRESS</p>
              <div className="loading-steps">
                {LOADING_STEPS.map((s, i) => (
                  <div key={i} className={`loading-step ${i < loadingStep ? "done" : i === loadingStep ? "active" : ""}`}>
                    {i < loadingStep ? "✓ " : i === loadingStep ? "→ " : "  "}{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              RESULTS VIEW
          ================================================================ */}
          {view === "result" && result && (
            <div className="results">
              
              <div className="action-buttons">
                <button className="back-btn" onClick={() => setView("form")}>← BACK TO FORM</button>
                <button className="download-btn" onClick={downloadPDF} disabled={downloading}>
                  {downloading ? "GENERATING PDF..." : "📥 DOWNLOAD PDF REPORT"}
                </button>
              </div>

              {/* BUG FIX: badge now says "Groq" not "Gemini" */}
              <div className="ai-badge"><div className="ai-dot" /> POWERED BY GROQ LLAMA 3.3 70B</div>

              {/* Score hero */}
              <div className={`score-hero grade-${result.grade}`}>
                <div className="score-ring">
                  <svg viewBox="0 0 120 120" width="120" height="120">
                    <circle className="score-ring-track" cx="60" cy="60" r="52" />
                    {/* BUG FIX: key prop now uses index "ring-track" / "ring-fill"
                        instead of cx coordinate which can collide */}
                    <circle key="ring-fill" className="score-ring-fill" cx="60" cy="60" r="52"
                      stroke={result.grade==="A"?"#c8f542":result.grade==="B"?"#42f5c8":result.grade==="C"?"#f5a742":"#f54242"}
                      strokeDasharray={circumference} strokeDashoffset={dashOffset} />
                  </svg>
                  <div className="score-num">{animScore}<span>/100</span></div>
                </div>
                <div className="score-info">
                  <h3>{form.companyName || "Company Analysis"}</h3>
                  <div className="grade-badge">GRADE {result.grade} · {result.riskLevel}</div>
                  <p className="score-summary">{result.summary}</p>
                </div>
              </div>

              {/* Altman Z-Score */}
              <div className="zscore-banner">
                <div>
                  <div className="zscore-label">ALTMAN Z'-SCORE</div>
                  <div className="zscore-val" style={{color:result.altman.zoneColor}}>{result.altman.Z}</div>
                  <div className="zscore-zone" style={{color:result.altman.zoneColor}}>{result.altman.zone}</div>
                </div>
                <div className="zscore-bar-wrap">
                  <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",marginBottom:8}}>
                    BANKRUPTCY PROBABILITY SPECTRUM
                  </div>
                  <div className="zscore-bar">
                    <div className="zscore-bar-fill"
                      style={{width:result.altman.percent+"%",background:"linear-gradient(90deg,#f54242,#f5a742,#c8f542)"}} />
                  </div>
                  <div className="zscore-markers">
                    <span style={{color:"#f54242"}}>Distress &lt;1.23</span>
                    <span style={{color:"#f5a742"}}>Grey 1.23–2.9</span>
                    <span style={{color:"#c8f542"}}>Safe &gt;2.9</span>
                  </div>
                  {result.bankruptcyRisk && (
                    <p style={{fontSize:12,color:"var(--muted)",marginTop:10,lineHeight:1.6}}>{result.bankruptcyRisk}</p>
                  )}
                </div>
              </div>

              {/* Key metric cards */}
              <div className="metrics-grid">
                {[
                  { label:"Current Ratio",  value:result.metrics.currentRatio,    sub:"Liquidity",    bar:result.scores.liquidity },
                  { label:"Quick Ratio",    value:result.metrics.quickRatio,      sub:"Acid Test",    bar:result.scores.quickRatio },
                  { label:"Debt Ratio",     value:result.metrics.debtRatio,       sub:"Leverage",     bar:result.scores.debtHealth },
                  { label:"Net Margin",     value:result.metrics.netProfitMargin, sub:"Profitability",bar:result.scores.profitability },
                  { label:"Revenue Growth", value:result.metrics.revenueGrowth,   sub:"YoY Change",   bar:result.scores.growth },
                  { label:"Asset Turnover", value:result.metrics.assetTurnover,   sub:"Efficiency",   bar:result.scores.efficiency },
                ].map((m, i) => (
                  <div className="metric-card" key={i}>
                    <div className="metric-card-label">{m.label}</div>
                    <div className={`metric-card-value ${m.bar>=75?"good":m.bar>=50?"ok":m.bar>=30?"warn":"bad"}`}>{m.value}</div>
                    <div className="metric-card-sub">{m.sub}</div>
                    <div className="metric-bar">
                      <div className="metric-bar-fill" style={{width:m.bar+"%",background:getBarColor(m.bar)}} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Radar + Bar charts (Refs attached for PDF Image capture) */}
              <div className="charts-row">
                <div className="chart-card" ref={radarRef}>
                  <h4>Score Breakdown — Radar</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2a2a35" />
                      <PolarAngleAxis dataKey="subject" tick={{fill:"#6b6b80",fontSize:11,fontFamily:"DM Mono"}} />
                      <Radar dataKey="value" stroke="#c8f542" fill="#c8f542" fillOpacity={0.12} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-card" ref={barRef}>
                  <h4>Component Scores — Bar</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} barSize={28}>
                      <XAxis dataKey="name" tick={{fill:"#6b6b80",fontSize:11,fontFamily:"DM Mono"}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,100]} tick={{fill:"#6b6b80",fontSize:11,fontFamily:"DM Mono"}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{background:"#18181f",border:"1px solid #2a2a35",borderRadius:8,fontFamily:"DM Mono",fontSize:12}} cursor={{fill:"rgba(255,255,255,0.03)"}} />
                      <Bar dataKey="score" radius={[4,4,0,0]}>
                        {barData.map((e, i) => <Cell key={i} fill={getBarColor(e.score)} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SHAP attribution */}
              <div className="shap-section">
                <h4>SHAP Feature Attribution — Score Drivers</h4>
                <p className="shap-subtitle">
                  Score = {result.totalScore}/100. Each bar shows how much a factor
                  added (+) or reduced (−) the total score relative to a neutral baseline of 50 pts.
                </p>
                {(result.shapValues || []).map((sv, i) => {
                  const isPos = sv.contribution >= 0;
                  const bw    = Math.abs(sv.contribution) / maxShap * 46;
                  return (
                    <div className="shap-row" key={i}>
                      <div className="shap-label">{sv.label}</div>
                      <div className="shap-bar-area">
                        <div className="shap-zero" />
                        {isPos
                          ? <div style={{position:"absolute",left:"50%"}}>
                              <div style={{width:bw+"%",height:18,borderRadius:3,background:"#c8f542",opacity:0.85}} />
                            </div>
                          : <div style={{position:"absolute",right:"50%",display:"flex",justifyContent:"flex-end"}}>
                              <div style={{width:bw+"%",height:18,borderRadius:3,background:"#f54242",opacity:0.8}} />
                            </div>
                        }
                      </div>
                      <div className="shap-impact" style={{color:isPos?"#c8f542":"#f54242"}}>
                        {isPos ? "+" : ""}{sv.contribution} pts
                      </div>
                    </div>
                  );
                })}
                <div className="shap-legend">
                  <div className="shap-legend-item"><div className="shap-legend-dot" style={{background:"#c8f542"}} /> Positive contribution</div>
                  <div className="shap-legend-item"><div className="shap-legend-dot" style={{background:"#f54242"}} /> Negative contribution</div>
                </div>
              </div>

              {/* 12-month forecast */}
              {result.forecastData && result.forecastData.length > 0 && (
                <div className="chart-full">
                  <h4>Financial Health Score — 12-Month Trajectory Forecast</h4>
                  {/* BUG FIX: label says "Groq-projected" not "Gemini-projected" */}
                  <p>Historical data points + Groq-projected quarterly scores. Confidence bands widen over time to reflect uncertainty.</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={result.forecastData} margin={{top:10,right:10,left:-20,bottom:0}}>
                      <defs>
                        <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#f5a742" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#f5a742" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#2a2a35" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="period" tick={{fill:"#6b6b80",fontSize:10,fontFamily:"DM Mono"}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,100]} tick={{fill:"#6b6b80",fontSize:10,fontFamily:"DM Mono"}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{background:"#18181f",border:"1px solid #2a2a35",borderRadius:8,fontFamily:"DM Mono",fontSize:12}} />
                      <ReferenceLine y={65} stroke="#42f5c8" strokeDasharray="4 4" strokeOpacity={0.4} />
                      <ReferenceLine y={45} stroke="#f54242" strokeDasharray="4 4" strokeOpacity={0.3} />
                      <Area type="monotone" dataKey="confidence_hi" stroke="none" fill="url(#confGrad)" />
                      <Area type="monotone" dataKey="confidence_lo" stroke="none" fill="transparent" />
                      <Line type="monotone" dataKey="score" stroke="#c8f542" strokeWidth={2.5}
                        dot={(props) => {
                          // BUG FIX: key now uses stable index-based string, not cx coordinate
                          const { cx, cy, payload, index } = props;
                          return payload.type === "forecast"
                            ? <circle key={`dot-${index}`} cx={cx} cy={cy} r={3} fill="#f5a742" stroke="#0a0a0f" strokeWidth={1.5} />
                            : <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#c8f542" stroke="#0a0a0f" strokeWidth={1.5} />;
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="forecast-note">
                    ● Historical &nbsp;·&nbsp; <span>● Groq AI Forecasted</span> &nbsp;·&nbsp; Shaded area = confidence band
                  </p>
                </div>
              )}

              {/* Risk & Investment */}
              <div className="risk-row">
                <div className="risk-card">
                  <h4>Bankruptcy Risk Assessment</h4>
                  <div className={`risk-level ${result.grade==="A"?"good":result.grade==="B"?"ok":result.grade==="C"?"warn":"bad"}`}>
                    {result.riskLevel}
                  </div>
                  <p className="risk-desc">
                    {result.bankruptcyRisk || "See Altman Z-Score above for bankruptcy probability details."}
                  </p>
                </div>
                <div className="risk-card">
                  <h4>Investment Attractiveness</h4>
                  <div className={`risk-level ${result.investScore>=70?"good":result.investScore>=50?"ok":"warn"}`}>
                    {result.investScore}/100
                  </div>
                  <p className="risk-desc">
                    {result.investmentVerdict ||
                      (result.investScore >= 75 ? "Strong investment case with solid fundamentals." :
                       result.investScore >= 55 ? "Moderate potential. Due diligence recommended." :
                                                  "Weak profile. Significant risks outweigh returns.")}
                  </p>
                </div>
              </div>

              {/* BUG FIX: heading says "Groq AI Insights" not "Gemini AI Insights" */}
              <div className="insights">
                <h4>Groq AI Insights — Explainable Analysis</h4>
                {(result.insights || []).map((ins, i) => (
                  <div className="insight-item" key={i}>
                    <div className="insight-dot" style={{background:typeColor(ins.type)}} />
                    <div>
                      <h5 style={{color:typeColor(ins.type)}}>{ins.title}</h5>
                      <p>{ins.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{height:60}} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}