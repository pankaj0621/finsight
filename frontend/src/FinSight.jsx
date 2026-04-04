import { useState, useEffect, useRef } from "react";
import { toPng } from 'html-to-image';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ReferenceLine, Area, AreaChart, CartesianGrid, Line,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "https://finsight-backend-f0pq.onrender.com";

// =============================================================================
// Fonts & Global CSS
// =============================================================================
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`;

const styles = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy-950: #020818;
    --navy-900: #050f2e;
    --navy-800: #0a1a4a;
    --navy-700: #0f2566;
    --navy-600: #1a3580;
    --navy-500: #2547a0;
    --navy-400: #3a63c4;
    --gold-500: #c9a84c;
    --gold-400: #d4b86a;
    --gold-300: #e0cc90;
    --gold-200: #edd9a3;
    --gold-100: #f7efd6;
    --shadow-neu-out: 6px 6px 14px rgba(2,8,24,0.8), -4px -4px 10px rgba(30,60,120,0.25);
    --shadow-neu-in: inset 4px 4px 10px rgba(2,8,24,0.8), inset -3px -3px 8px rgba(30,60,120,0.2);
    --shadow-neu-hover: 8px 8px 20px rgba(2,8,24,0.9), -5px -5px 14px rgba(30,60,120,0.3), 0 0 20px rgba(201,168,76,0.15);
    --text: #e8eaf6;
    --muted: #7986cb;
    --font-display: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  body { background: var(--navy-900); color: var(--text); font-family: var(--font-body); }

  .app { min-height: 100vh; background: var(--navy-900); position: relative; overflow-x: hidden; }

  /* Background pattern */
  .app::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle at 20% 20%, rgba(201,168,76,0.04) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(37,71,160,0.08) 0%, transparent 50%);
  }

  .container { max-width: 1200px; margin: 0 auto; padding: 0 28px; position: relative; z-index: 1; }

  /* ── Header ── */
  .header {
    padding: 36px 0 24px;
    border-bottom: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: space-between;
  }
  .logo { display: flex; align-items: center; gap: 16px; }
  .logo-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, var(--gold-500), var(--gold-300));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-weight: 500; color: var(--navy-900); font-size: 20px;
    box-shadow: var(--shadow-neu-out);
  }
  .logo-text h1 { font-family: var(--font-display); font-size: 28px; color: var(--text); line-height: 1; }
  .logo-text p { font-size: 11px; color: var(--gold-500); font-family: var(--font-mono); margin-top: 4px; letter-spacing: 0.15em; }
  .api-status { font-family: var(--font-mono); font-size: 11px; padding: 6px 14px; border-radius: 20px; letter-spacing: 0.1em; }
  .api-ok  { color: #4ade80; border: 1px solid rgba(74,222,128,0.3); background: rgba(74,222,128,0.08); }
  .api-err { color: #f87171; border: 1px solid rgba(248,113,113,0.3); background: rgba(248,113,113,0.08); }

  /* ── Hero ── */
  .hero { padding: 56px 0 36px; }
  .hero h2 { font-family: var(--font-display); font-size: clamp(32px,4.5vw,52px); line-height: 1.15; color: var(--text); max-width: 680px; }
  .hero h2 em { color: var(--gold-400); font-style: italic; }
  .hero p { margin-top: 16px; color: var(--muted); font-size: 15px; max-width: 500px; line-height: 1.8; }

  /* ── Mode Tabs ── */
  .mode-tabs { display: flex; gap: 6px; margin: 36px 0 28px; }
  .mode-tab {
    padding: 11px 24px; font-family: var(--font-mono); font-size: 12px;
    color: var(--muted); cursor: pointer; border: none;
    background: var(--navy-800); border-radius: 10px;
    box-shadow: var(--shadow-neu-out); transition: all 0.25s; letter-spacing: 0.06em;
  }
  .mode-tab:hover { color: var(--gold-400); }
  .mode-tab.active {
    background: linear-gradient(135deg, var(--navy-700), var(--navy-800));
    color: var(--gold-400); box-shadow: var(--shadow-neu-in);
    border-bottom: 2px solid var(--gold-500);
  }

  /* ── Neu Card ── */
  .neu-card {
    background: var(--navy-800); border-radius: 20px;
    box-shadow: var(--shadow-neu-out); padding: 28px; margin-bottom: 20px;
    border: 1px solid rgba(201,168,76,0.08);
    transition: box-shadow 0.3s;
  }
  .neu-card:hover { box-shadow: var(--shadow-neu-hover); }

  /* ── Section Label ── */
  .section-label {
    font-family: var(--font-mono); font-size: 11px; color: var(--gold-500);
    letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(201,168,76,0.3), transparent); }

  /* ── Form Fields ── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width:640px){ .form-grid { grid-template-columns: 1fr; } }
  .field { display: flex; flex-direction: column; gap: 7px; }
  .field label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); letter-spacing: 0.07em; text-transform: uppercase; }
  .field input, .field select {
    background: var(--navy-900); border: 1px solid rgba(201,168,76,0.15);
    color: var(--text); padding: 11px 15px; border-radius: 10px;
    font-family: var(--font-mono); font-size: 13px;
    box-shadow: var(--shadow-neu-in); transition: all 0.2s; outline: none;
  }
  .field input:focus, .field select:focus {
    border-color: rgba(201,168,76,0.5);
    box-shadow: var(--shadow-neu-in), 0 0 0 3px rgba(201,168,76,0.08);
  }
  .field input::placeholder { color: var(--muted); opacity: 0.4; }
  .field select option { background: var(--navy-800); }

  /* ── Comparison layout ── */
  .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(max-width:768px){ .comparison-grid { grid-template-columns: 1fr; } }
  .company-form-card {
    background: var(--navy-800); border-radius: 20px;
    box-shadow: var(--shadow-neu-out); padding: 24px;
    border: 1px solid rgba(201,168,76,0.1);
  }
  .company-label {
    font-family: var(--font-display); font-size: 18px;
    margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
  }
  .company-label span {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono); font-size: 13px; font-weight: 600;
    box-shadow: var(--shadow-neu-out);
  }
  .c1-dot { background: linear-gradient(135deg, var(--gold-500), var(--gold-300)); color: var(--navy-900); }
  .c2-dot { background: linear-gradient(135deg, #60a5fa, #93c5fd); color: var(--navy-900); }

  /* ── Demo buttons ── */
  .demo-row { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .demo-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .demo-btn {
    padding: 7px 16px; background: var(--navy-800); border: 1px solid rgba(201,168,76,0.2);
    color: var(--muted); border-radius: 8px; font-family: var(--font-mono); font-size: 11px;
    cursor: pointer; box-shadow: var(--shadow-neu-out); transition: all 0.2s; letter-spacing: 0.04em;
  }
  .demo-btn:hover { color: var(--gold-400); border-color: rgba(201,168,76,0.5); box-shadow: var(--shadow-neu-hover); }

  /* ── Analyze Button ── */
  .btn-analyze {
    width: 100%; padding: 16px; margin-top: 10px;
    background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
    color: var(--navy-900); border: none; border-radius: 12px;
    font-family: var(--font-mono); font-size: 14px; font-weight: 600;
    cursor: pointer; letter-spacing: 0.1em;
    box-shadow: 4px 4px 12px rgba(2,8,24,0.6), -2px -2px 8px rgba(201,168,76,0.15);
    transition: all 0.25s;
  }
  .btn-analyze:hover {
    background: linear-gradient(135deg, var(--gold-400), var(--gold-300));
    transform: translateY(-2px);
    box-shadow: 6px 8px 20px rgba(2,8,24,0.7), -2px -2px 10px rgba(201,168,76,0.2), 0 0 30px rgba(201,168,76,0.2);
  }
  .btn-analyze:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Error ── */
  .error-banner {
    background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.3);
    border-radius: 12px; padding: 14px 20px; margin-bottom: 20px;
    font-family: var(--font-mono); font-size: 13px; color: #f87171;
  }

  /* ── Loading ── */
  .loading-state { text-align: center; padding: 80px 0; }
  .spinner-gold {
    width: 56px; height: 56px; margin: 0 auto 24px;
    border: 3px solid rgba(201,168,76,0.15);
    border-top-color: var(--gold-500); border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-state p { font-family: var(--font-mono); font-size: 13px; color: var(--muted); letter-spacing: 0.1em; }
  .loading-steps { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; align-items: center; }
  .loading-step { font-family: var(--font-mono); font-size: 11px; color: var(--navy-600); letter-spacing: 0.07em; transition: color 0.4s; }
  .loading-step.active { color: var(--gold-400); }
  .loading-step.done { color: #4ade80; }

  /* ── Results ── */
  .results { animation: fadeUp 0.5s ease; }
  @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }

  /* ── Action buttons ── */
  .action-row { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .back-btn {
    display: flex; align-items: center; gap: 8px;
    background: var(--navy-800); border: 1px solid rgba(201,168,76,0.2);
    color: var(--muted); padding: 10px 18px; border-radius: 10px;
    font-family: var(--font-mono); font-size: 12px; cursor: pointer;
    box-shadow: var(--shadow-neu-out); transition: all 0.2s; letter-spacing: 0.05em;
  }
  .back-btn:hover { color: var(--gold-400); border-color: rgba(201,168,76,0.5); }
  .download-btn {
    display: flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
    color: var(--navy-900); padding: 10px 20px; border-radius: 10px;
    font-family: var(--font-mono); font-size: 12px; font-weight: 600;
    cursor: pointer; border: none;
    box-shadow: 3px 3px 10px rgba(2,8,24,0.5);
    transition: all 0.2s; letter-spacing: 0.06em;
  }
  .download-btn:hover { transform: translateY(-1px); box-shadow: 4px 6px 16px rgba(2,8,24,0.6), 0 0 20px rgba(201,168,76,0.2); }
  .download-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Speedometer ── */
  .gauge-wrap { display: flex; flex-direction: column; align-items: center; }
  .gauge-score { font-family: var(--font-display); font-size: 42px; color: var(--text); line-height: 1; margin-top: -8px; }
  .gauge-score span { font-size: 16px; color: var(--muted); font-family: var(--font-mono); }
  .gauge-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; margin-top: 4px; }

  /* ── Score Hero ── */
  .score-hero {
    display: grid; grid-template-columns: auto 1fr; gap: 36px; align-items: center;
  }
  @media(max-width:600px){ .score-hero { grid-template-columns: 1fr; } }
  .score-info h3 { font-family: var(--font-display); font-size: 26px; margin-bottom: 8px; }
  .grade-badge {
    display: inline-block; padding: 4px 14px; border-radius: 6px;
    font-family: var(--font-mono); font-size: 12px; font-weight: 600;
    margin-bottom: 12px; letter-spacing: 0.1em;
    box-shadow: var(--shadow-neu-out);
  }
  .grade-A { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
  .grade-B { background: rgba(201,168,76,0.12); color: var(--gold-400); border: 1px solid rgba(201,168,76,0.3); }
  .grade-C { background: rgba(251,146,60,0.12); color: #fb923c; border: 1px solid rgba(251,146,60,0.3); }
  .grade-D { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
  .score-summary { color: var(--muted); font-size: 14px; line-height: 1.8; max-width: 420px; }

  /* ── Metrics Grid ── */
  .metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 16px; margin-bottom: 20px; }
  .metric-card {
    background: var(--navy-800); border-radius: 16px;
    box-shadow: var(--shadow-neu-out); padding: 20px;
    border: 1px solid rgba(201,168,76,0.06);
    transition: all 0.3s; cursor: default; position: relative; overflow: hidden;
  }
  .metric-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold-500), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .metric-card:hover { box-shadow: var(--shadow-neu-hover); transform: translateY(-3px); }
  .metric-card:hover::before { opacity: 1; }
  .metric-label { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; }
  .metric-value { font-family: var(--font-display); font-size: 30px; margin-bottom: 4px; line-height: 1; }
  .metric-sub { font-size: 11px; color: var(--muted); margin-bottom: 14px; }
  .metric-progress { height: 4px; background: var(--navy-900); border-radius: 2px; overflow: hidden; box-shadow: var(--shadow-neu-in); }
  .metric-progress-fill { height: 100%; border-radius: 2px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .col-gold { color: var(--gold-400); }
  .col-green { color: #4ade80; }
  .col-orange { color: #fb923c; }
  .col-red { color: #f87171; }
  .col-blue { color: #60a5fa; }

  /* ── Chart cards ── */
  .chart-card {
    background: var(--navy-800); border-radius: 18px;
    box-shadow: var(--shadow-neu-out); padding: 24px;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .chart-card h4 {
    font-family: var(--font-mono); font-size: 11px; color: var(--gold-500);
    letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 20px;
  }
  .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  @media(max-width:700px){ .charts-row { grid-template-columns: 1fr; } }
  .chart-full {
    background: var(--navy-800); border-radius: 18px;
    box-shadow: var(--shadow-neu-out); padding: 24px; margin-bottom: 20px;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .chart-full h4 { font-family: var(--font-mono); font-size: 11px; color: var(--gold-500); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; }
  .chart-full > p { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.6; }

  /* ── Timeline progress bars ── */
  .timeline { display: flex; flex-direction: column; gap: 14px; }
  .timeline-row { display: flex; align-items: center; gap: 14px; }
  .timeline-label { font-family: var(--font-mono); font-size: 12px; color: var(--text); width: 130px; flex-shrink: 0; text-align: right; }
  .timeline-track { flex: 1; height: 10px; background: var(--navy-900); border-radius: 5px; overflow: hidden; box-shadow: var(--shadow-neu-in); }
  .timeline-fill { height: 100%; border-radius: 5px; transition: width 1.4s cubic-bezier(0.4,0,0.2,1); }
  .timeline-val { font-family: var(--font-mono); font-size: 12px; width: 52px; flex-shrink: 0; text-align: right; }

  /* ── SHAP ── */
  .shap-section {
    background: var(--navy-800); border-radius: 18px;
    box-shadow: var(--shadow-neu-out); padding: 24px; margin-bottom: 20px;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .shap-section h4 { font-family: var(--font-mono); font-size: 11px; color: var(--gold-500); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; }
  .shap-subtitle { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.6; }
  .shap-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .shap-label { font-family: var(--font-mono); font-size: 12px; color: var(--text); width: 130px; flex-shrink: 0; text-align: right; }
  .shap-bar-area { flex: 1; display: flex; align-items: center; position: relative; height: 22px; }
  .shap-zero { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(201,168,76,0.2); }
  .shap-impact { font-family: var(--font-mono); font-size: 12px; width: 60px; flex-shrink: 0; text-align: right; }

  /* ── Risk & Investment ── */
  .risk-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  @media(max-width:600px){ .risk-row { grid-template-columns: 1fr; } }
  .risk-card {
    background: var(--navy-800); border-radius: 16px;
    box-shadow: var(--shadow-neu-out); padding: 22px;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .risk-card h4 { font-family: var(--font-mono); font-size: 11px; color: var(--gold-500); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; }
  .risk-level { font-family: var(--font-display); font-size: 22px; margin-bottom: 8px; }
  .risk-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }

  /* ── Altman Z ── */
  .zscore-banner {
    background: var(--navy-800); border-radius: 16px;
    box-shadow: var(--shadow-neu-out); padding: 22px 26px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 28px; flex-wrap: wrap;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .zscore-val { font-family: var(--font-display); font-size: 40px; }
  .zscore-label { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
  .zscore-zone { font-family: var(--font-mono); font-size: 13px; font-weight: 500; }
  .zscore-bar-wrap { flex: 1; min-width: 200px; }
  .zscore-track { height: 10px; background: var(--navy-900); border-radius: 5px; overflow: hidden; box-shadow: var(--shadow-neu-in); }
  .zscore-fill { height: 100%; border-radius: 5px; transition: width 1.2s ease; }
  .zscore-markers { display: flex; justify-content: space-between; margin-top: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--muted); }

  /* ── Insights ── */
  .insights {
    background: var(--navy-800); border-radius: 18px;
    box-shadow: var(--shadow-neu-out); padding: 24px; margin-bottom: 20px;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .insights h4 { font-family: var(--font-mono); font-size: 11px; color: var(--gold-500); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 18px; }
  .insight-item { display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(201,168,76,0.07); align-items: flex-start; }
  .insight-item:last-child { border-bottom: none; padding-bottom: 0; }
  .insight-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; box-shadow: 0 0 8px currentColor; }
  .insight-item h5 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
  .insight-item p { font-size: 13px; color: var(--muted); line-height: 1.7; }

  /* ── Comparison Results ── */
  .compare-header {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;
  }
  .compare-score-card {
    background: var(--navy-800); border-radius: 18px;
    box-shadow: var(--shadow-neu-out); padding: 24px; text-align: center;
    border: 1px solid rgba(201,168,76,0.1);
  }
  .compare-company-name { font-family: var(--font-display); font-size: 20px; margin-bottom: 16px; }
  .compare-metrics-table {
    background: var(--navy-800); border-radius: 18px;
    box-shadow: var(--shadow-neu-out); padding: 24px; margin-bottom: 20px;
    border: 1px solid rgba(201,168,76,0.07);
  }
  .compare-metrics-table h4 { font-family: var(--font-mono); font-size: 11px; color: var(--gold-500); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 18px; }
  .compare-row {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid rgba(201,168,76,0.07);
    align-items: center; font-size: 13px;
  }
  .compare-row:last-child { border-bottom: none; }
  .compare-row-header { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
  .compare-metric-name { color: var(--muted); font-family: var(--font-mono); font-size: 12px; }
  .compare-val { font-family: var(--font-mono); font-size: 13px; font-weight: 500; text-align: center; }
  .winner-badge {
    font-family: var(--font-mono); font-size: 10px; padding: 2px 8px; border-radius: 4px;
    background: rgba(201,168,76,0.15); color: var(--gold-400); letter-spacing: 0.06em;
  }

  /* ── AI badge ── */
  .ai-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25);
    border-radius: 20px; padding: 4px 14px;
    font-family: var(--font-mono); font-size: 11px; color: var(--gold-400);
    letter-spacing: 0.07em; margin-bottom: 20px;
  }
  .ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold-500); animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.3;} }

  .forecast-note { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 12px; }
  .forecast-note span { color: #fb923c; }
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
    companyName:"OldTrade Industries", industry:"Manufacturing",
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
  companyName:"", industry:"Technology",
  revenue:"", prevRevenue:"", netProfit:"",
  totalAssets:"", totalLiabilities:"",
  currentAssets:"", currentLiabilities:"", inventory:"", operatingExpenses:"",
};

const LOADING_STEPS = [
  "PARSING FINANCIAL DATA...",
  "COMPUTING ALTMAN Z-SCORE...",
  "RUNNING SCORING ENGINE...",
  "COMPUTING SHAP ATTRIBUTIONS...",
  "CALLING GROQ AI...",
  "BUILDING FORECAST TRAJECTORY...",
];

// =============================================================================
// Animated Counter Hook
// =============================================================================
function useCounter(target, duration = 1200, active = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target, active]);
  return val;
}

// =============================================================================
// Speedometer Component
// =============================================================================
function Speedometer({ score, grade, active }) {
  const animScore = useCounter(score, 1400, active);
  const angle = -135 + (animScore / 100) * 270;
  const gradeColor = grade === "A" ? "#4ade80" : grade === "B" ? "#c9a84c" : grade === "C" ? "#fb923c" : "#f87171";

  return (
    <div className="gauge-wrap">
      <svg width="200" height="130" viewBox="0 0 200 130">
        {/* Background arc */}
        <path d="M 20 110 A 80 80 0 1 1 180 110" fill="none" stroke="rgba(10,26,74,0.8)" strokeWidth="14" strokeLinecap="round"/>
        {/* Color zones */}
        <path d="M 20 110 A 80 80 0 0 1 56 38" fill="none" stroke="#f87171" strokeWidth="14" strokeLinecap="round" opacity="0.4"/>
        <path d="M 56 38 A 80 80 0 0 1 100 20" fill="none" stroke="#fb923c" strokeWidth="14" strokeLinecap="round" opacity="0.4"/>
        <path d="M 100 20 A 80 80 0 0 1 144 38" fill="none" stroke="#c9a84c" strokeWidth="14" strokeLinecap="round" opacity="0.4"/>
        <path d="M 144 38 A 80 80 0 0 1 180 110" fill="none" stroke="#4ade80" strokeWidth="14" strokeLinecap="round" opacity="0.4"/>
        {/* Active fill arc */}
        <path
          d="M 20 110 A 80 80 0 1 1 180 110"
          fill="none" stroke={gradeColor} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(animScore / 100) * 251.2} 251.2`}
          opacity="0.9"
        />
        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 110)`}>
          <line x1="100" y1="110" x2="100" y2="40" stroke={gradeColor} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="100" cy="110" r="5" fill={gradeColor}/>
          <circle cx="100" cy="110" r="3" fill="var(--navy-900)"/>
        </g>
        {/* Labels */}
        <text x="18" y="128" fill="var(--muted)" fontSize="9" fontFamily="JetBrains Mono">0</text>
        <text x="90" y="16" fill="var(--muted)" fontSize="9" fontFamily="JetBrains Mono">50</text>
        <text x="176" y="128" fill="var(--muted)" fontSize="9" fontFamily="JetBrains Mono">100</text>
      </svg>
      <div className="gauge-score">{animScore}<span>/100</span></div>
      <div className="gauge-label">HEALTH SCORE</div>
    </div>
  );
}

// =============================================================================
// Single Company Form
// =============================================================================
function CompanyForm({ form, setForm, label, dotClass, demos }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="company-form-card">
      <div className="company-label">
        <span className={dotClass}>{label === "Company A" ? "A" : "B"}</span>
        {label}
      </div>
      {demos && (
        <div className="demo-row" style={{marginBottom:16}}>
          <span className="demo-label">Demo:</span>
          {Object.keys(DEMOS).map(k => (
            <button key={k} className="demo-btn" onClick={() => setForm(DEMOS[k])}>{k}</button>
          ))}
        </div>
      )}
      <div className="form-grid" style={{gap:12}}>
        <div className="field" style={{gridColumn:"1/-1"}}>
          <label>Company Name</label>
          <input placeholder="e.g. Acme Pvt Ltd" value={form.companyName} onChange={e => set("companyName", e.target.value)}/>
        </div>
        <div className="field" style={{gridColumn:"1/-1"}}>
          <label>Industry</label>
          <select value={form.industry} onChange={e => set("industry", e.target.value)}>
            {["Technology","Manufacturing","Retail","Healthcare","Finance","Real Estate","Education","Other"].map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="field"><label>Revenue (Current)</label><input type="number" placeholder="5000000" value={form.revenue} onChange={e => set("revenue", e.target.value)}/></div>
        <div className="field"><label>Revenue (Previous)</label><input type="number" placeholder="4200000" value={form.prevRevenue} onChange={e => set("prevRevenue", e.target.value)}/></div>
        <div className="field"><label>Net Profit / Loss</label><input type="number" placeholder="750000" value={form.netProfit} onChange={e => set("netProfit", e.target.value)}/></div>
        <div className="field"><label>Operating Expenses</label><input type="number" placeholder="3800000" value={form.operatingExpenses} onChange={e => set("operatingExpenses", e.target.value)}/></div>
        <div className="field"><label>Total Assets</label><input type="number" placeholder="8000000" value={form.totalAssets} onChange={e => set("totalAssets", e.target.value)}/></div>
        <div className="field"><label>Total Liabilities</label><input type="number" placeholder="2400000" value={form.totalLiabilities} onChange={e => set("totalLiabilities", e.target.value)}/></div>
        <div className="field"><label>Current Assets</label><input type="number" placeholder="3200000" value={form.currentAssets} onChange={e => set("currentAssets", e.target.value)}/></div>
        <div className="field"><label>Current Liabilities</label><input type="number" placeholder="1500000" value={form.currentLiabilities} onChange={e => set("currentLiabilities", e.target.value)}/></div>
        <div className="field" style={{gridColumn:"1/-1"}}><label>Inventory</label><input type="number" placeholder="400000" value={form.inventory} onChange={e => set("inventory", e.target.value)}/></div>
      </div>
    </div>
  );
}

// =============================================================================
// Single Result View
// =============================================================================
function SingleResult({ result, companyName, active, radarRef, barRef }) {
  const grade = result.grade;
  const gradeColor = grade === "A" ? "#4ade80" : grade === "B" ? "#c9a84c" : grade === "C" ? "#fb923c" : "#f87171";
  const typeColor = t => t === "good" ? "#4ade80" : t === "warn" ? "#fb923c" : "#f87171";
  const getBarColor = s => s >= 75 ? "#4ade80" : s >= 50 ? "#c9a84c" : s >= 30 ? "#fb923c" : "#f87171";
  const maxShap = Math.max(...(result.shapValues || []).map(s => Math.abs(s.contribution)), 1);

  const radarData = Object.entries(result.scores).map(([k, v]) => ({
    subject: k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
    value: v, fullMark: 100,
  }));

  const barData = [
    { name:"Liquidity",  score: result.scores.liquidity },
    { name:"Quick",      score: result.scores.quickRatio },
    { name:"Debt",       score: result.scores.debtHealth },
    { name:"Profit",     score: result.scores.profitability },
    { name:"Growth",     score: result.scores.growth },
    { name:"Efficiency", score: result.scores.efficiency },
  ];

  return (
    <>
      {/* Score Hero */}
      <div className="neu-card">
        <div className="score-hero">
          <Speedometer score={result.totalScore} grade={grade} active={active} />
          <div className="score-info">
            <h3>{companyName || "Company"}</h3>
            <div className={`grade-badge grade-${grade}`}>GRADE {grade} &nbsp;·&nbsp; {result.riskLevel}</div>
            <p className="score-summary">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        {[
          { label:"Current Ratio",    value:result.metrics.currentRatio, score:result.scores.liquidity,     sub:"Liquidity" },
          { label:"Quick Ratio",      value:result.metrics.quickRatio,   score:result.scores.quickRatio,    sub:"Acid Test" },
          { label:"Debt Ratio",       value:result.metrics.debtRatio,    score:result.scores.debtHealth,    sub:"Leverage" },
          { label:"Net Margin",       value:result.metrics.netProfitMargin, score:result.scores.profitability, sub:"Profitability" },
          { label:"Revenue Growth",   value:result.metrics.revenueGrowth, score:result.scores.growth,       sub:"YoY Change" },
          { label:"Asset Turnover",   value:result.metrics.assetTurnover, score:result.scores.efficiency,   sub:"Efficiency" },
        ].map((m,i) => {
          const col = m.score >= 75 ? "col-green" : m.score >= 50 ? "col-gold" : m.score >= 30 ? "col-orange" : "col-red";
          return (
            <div className="metric-card" key={i}>
              <div className="metric-label">{m.label}</div>
              <div className={`metric-value ${col}`}>{m.value}</div>
              <div className="metric-sub">{m.sub}</div>
              <div className="metric-progress">
                <div className="metric-progress-fill" style={{width: m.score+"%", background: getBarColor(m.score)}}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline — Component Scores */}
      <div className="neu-card">
        <div className="section-label">Score Timeline</div>
        <div className="timeline">
          {barData.map((b,i) => (
            <div className="timeline-row" key={i}>
              <div className="timeline-label">{b.name}</div>
              <div className="timeline-track">
                <div className="timeline-fill" style={{width: b.score+"%", background: getBarColor(b.score)}}/>
              </div>
              <div className="timeline-val" style={{color: getBarColor(b.score)}}>{b.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card" ref={radarRef}>
          <h4>Score Breakdown — Radar</h4>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(201,168,76,0.15)"/>
              <PolarAngleAxis dataKey="subject" tick={{fill:"#7986cb",fontSize:11,fontFamily:"JetBrains Mono"}}/>
              <Radar dataKey="value" stroke={gradeColor} fill={gradeColor} fillOpacity={0.1} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card" ref={barRef}>
          <h4>Component Scores — Bar</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={26}>
              <XAxis dataKey="name" tick={{fill:"#7986cb",fontSize:10,fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"#7986cb",fontSize:10,fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--navy-800)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontFamily:"JetBrains Mono",fontSize:12}}/>
              <Bar dataKey="score" radius={[5,5,0,0]}>
                {barData.map((e,i) => <Cell key={i} fill={getBarColor(e.score)}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Altman Z */}
      <div className="zscore-banner">
        <div>
          <div className="zscore-label">Altman Z-Score</div>
          <div className="zscore-val" style={{color: result.altman.zoneColor || gradeColor}}>{result.altman.Z}</div>
          <div className="zscore-zone" style={{color: result.altman.zoneColor}}>{result.altman.zone}</div>
        </div>
        <div className="zscore-bar-wrap">
          <div className="zscore-track">
            <div className="zscore-fill" style={{width: result.altman.percent+"%", background: result.altman.zoneColor}}/>
          </div>
          <div className="zscore-markers"><span>Distress</span><span>Grey Zone</span><span>Safe</span></div>
        </div>
        <div style={{flex:1,minWidth:200}}>
          <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.7}}>{result.bankruptcyRisk}</p>
        </div>
      </div>

      {/* SHAP */}
      <div className="shap-section">
        <h4>SHAP Explainability — Score Drivers</h4>
        <p className="shap-subtitle">Score = {result.totalScore}/100. Each bar shows factor contribution relative to neutral baseline of 50 pts.</p>
        {(result.shapValues || []).map((sv,i) => {
          const isPos = sv.contribution >= 0;
          const bw = Math.abs(sv.contribution) / maxShap * 46;
          return (
            <div className="shap-row" key={i}>
              <div className="shap-label">{sv.label}</div>
              <div className="shap-bar-area">
                <div className="shap-zero"/>
                {isPos
                  ? <div style={{position:"absolute",left:"50%"}}><div style={{width:bw+"%",height:16,borderRadius:4,background:"#4ade80",opacity:0.85}}/></div>
                  : <div style={{position:"absolute",right:"50%",display:"flex",justifyContent:"flex-end"}}><div style={{width:bw+"%",height:16,borderRadius:4,background:"#f87171",opacity:0.8}}/></div>
                }
              </div>
              <div className="shap-impact" style={{color:isPos?"#4ade80":"#f87171"}}>{isPos?"+":""}{sv.contribution} pts</div>
            </div>
          );
        })}
      </div>

      {/* Risk & Investment */}
      <div className="risk-row">
        <div className="risk-card">
          <h4>Bankruptcy Risk</h4>
          <div className={`risk-level ${grade==="A"?"col-green":grade==="B"?"col-gold":grade==="C"?"col-orange":"col-red"}`}>{result.riskLevel}</div>
          <p className="risk-desc">{result.bankruptcyRisk || "See Altman Z-Score above for details."}</p>
        </div>
        <div className="risk-card">
          <h4>Investment Attractiveness</h4>
          <div className={`risk-level ${result.investScore>=70?"col-green":result.investScore>=50?"col-gold":"col-orange"}`}>{result.investScore}/100</div>
          <p className="risk-desc">{result.investmentVerdict || "Analysis based on computed financial metrics."}</p>
        </div>
      </div>

      {/* Forecast */}
      {result.forecastData && result.forecastData.length > 0 && (
        <div className="chart-full">
          <h4>12-Month Health Score Forecast</h4>
          <p>Historical data + Groq AI-projected quarterly scores with confidence bands.</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={result.forecastData} margin={{top:10,right:10,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(201,168,76,0.08)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="period" tick={{fill:"#7986cb",fontSize:10,fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"#7986cb",fontSize:10,fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--navy-800)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontFamily:"JetBrains Mono",fontSize:12}}/>
              <ReferenceLine y={65} stroke="#c9a84c" strokeDasharray="4 4" strokeOpacity={0.4}/>
              <ReferenceLine y={45} stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.3}/>
              <Area type="monotone" dataKey="confidence_hi" stroke="none" fill="url(#confGrad)"/>
              <Area type="monotone" dataKey="confidence_lo" stroke="none" fill="transparent"/>
              <Line type="monotone" dataKey="score" stroke={gradeColor} strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  return payload.type === "forecast"
                    ? <circle key={`d-${index}`} cx={cx} cy={cy} r={3} fill="#fb923c" stroke="var(--navy-900)" strokeWidth={1.5}/>
                    : <circle key={`d-${index}`} cx={cx} cy={cy} r={4} fill={gradeColor} stroke="var(--navy-900)" strokeWidth={1.5}/>;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="forecast-note">● Historical &nbsp;·&nbsp; <span>● AI Forecasted</span> &nbsp;·&nbsp; Shaded = confidence band</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="insights">
        <div className="ai-badge"><div className="ai-dot"/> GROQ LLAMA 3.3 70B · LIVE ANALYSIS</div>
        <h4>AI Strategic Insights</h4>
        {(result.insights || []).map((ins,i) => (
          <div className="insight-item" key={i}>
            <div className="insight-dot" style={{background: typeColor(ins.type), color: typeColor(ins.type)}}/>
            <div>
              <h5 style={{color: typeColor(ins.type)}}>{ins.title}</h5>
              <p>{ins.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// =============================================================================
// Comparison Result View
// =============================================================================
function CompareResult({ r1, r2, form1, form2, active }) {
  const gradeColor = g => g === "A" ? "#4ade80" : g === "B" ? "#c9a84c" : g === "C" ? "#fb923c" : "#f87171";
  const getBarColor = s => s >= 75 ? "#4ade80" : s >= 50 ? "#c9a84c" : s >= 30 ? "#fb923c" : "#f87171";

  const metricRows = [
    { label:"Health Score", v1: r1.totalScore+"/100", v2: r2.totalScore+"/100", raw1: r1.totalScore, raw2: r2.totalScore },
    { label:"Grade",        v1: r1.grade,             v2: r2.grade,             raw1: ["D","C","B","A"].indexOf(r1.grade), raw2: ["D","C","B","A"].indexOf(r2.grade) },
    { label:"Current Ratio",v1: r1.metrics.currentRatio, v2: r2.metrics.currentRatio, raw1: parseFloat(r1.metrics.currentRatio), raw2: parseFloat(r2.metrics.currentRatio) },
    { label:"Quick Ratio",  v1: r1.metrics.quickRatio,   v2: r2.metrics.quickRatio,   raw1: parseFloat(r1.metrics.quickRatio),   raw2: parseFloat(r2.metrics.quickRatio) },
    { label:"Debt Ratio",   v1: r1.metrics.debtRatio,    v2: r2.metrics.debtRatio,    raw1: -parseFloat(r1.metrics.debtRatio),  raw2: -parseFloat(r2.metrics.debtRatio) },
    { label:"Net Margin",   v1: r1.metrics.netProfitMargin, v2: r2.metrics.netProfitMargin, raw1: parseFloat(r1.metrics.netProfitMargin), raw2: parseFloat(r2.metrics.netProfitMargin) },
    { label:"Revenue Growth",v1: r1.metrics.revenueGrowth,  v2: r2.metrics.revenueGrowth,  raw1: parseFloat(r1.metrics.revenueGrowth),  raw2: parseFloat(r2.metrics.revenueGrowth) },
    { label:"Invest Score", v1: r1.investScore+"/100", v2: r2.investScore+"/100", raw1: r1.investScore, raw2: r2.investScore },
  ];

  const radarCompare = Object.entries(r1.scores).map(([k,v]) => ({
    subject: k.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase()),
    company1: v,
    company2: r2.scores[k],
  }));

  return (
    <>
      {/* Score cards side by side */}
      <div className="compare-header">
        {[{r:r1,f:form1,dot:"c1-dot"},{r:r2,f:form2,dot:"c2-dot"}].map(({r,f,dot},i) => (
          <div className="compare-score-card" key={i}>
            <div className="compare-company-name" style={{color: dot==="c1-dot"?gradeColor(r.grade):"#60a5fa"}}>
              {f.companyName || `Company ${i===0?"A":"B"}`}
            </div>
            <Speedometer score={r.totalScore} grade={r.grade} active={active}/>
            <div style={{marginTop:12}}>
              <div className={`grade-badge grade-${r.grade}`}>GRADE {r.grade} · {r.riskLevel}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-side radar */}
      <div className="charts-row">
        <div className="chart-card">
          <h4>Radar Comparison</h4>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarCompare}>
              <PolarGrid stroke="rgba(201,168,76,0.15)"/>
              <PolarAngleAxis dataKey="subject" tick={{fill:"#7986cb",fontSize:10,fontFamily:"JetBrains Mono"}}/>
              <Radar name={form1.companyName||"Company A"} dataKey="company1" stroke="#c9a84c" fill="#c9a84c" fillOpacity={0.1} strokeWidth={2}/>
              <Radar name={form2.companyName||"Company B"} dataKey="company2" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.1} strokeWidth={2}/>
              <Tooltip contentStyle={{background:"var(--navy-800)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontFamily:"JetBrains Mono",fontSize:12}}/>
            </RadarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:8}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"#c9a84c"}}>● {form1.companyName||"Company A"}</span>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"#60a5fa"}}>● {form2.companyName||"Company B"}</span>
          </div>
        </div>
        <div className="chart-card">
          <h4>Score Breakdown Comparison</h4>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={radarCompare} barSize={18} barGap={4}>
              <XAxis dataKey="subject" tick={{fill:"#7986cb",fontSize:9,fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"#7986cb",fontSize:9,fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--navy-800)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:10,fontFamily:"JetBrains Mono",fontSize:12}}/>
              <Bar dataKey="company1" name={form1.companyName||"A"} fill="#c9a84c" radius={[4,4,0,0]} fillOpacity={0.85}/>
              <Bar dataKey="company2" name={form2.companyName||"B"} fill="#60a5fa" radius={[4,4,0,0]} fillOpacity={0.85}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics comparison table */}
      <div className="compare-metrics-table">
        <h4>Head-to-Head Metrics</h4>
        <div className="compare-row compare-row-header">
          <div>Metric</div>
          <div style={{textAlign:"center"}}>{form1.companyName||"Company A"}</div>
          <div style={{textAlign:"center"}}>{form2.companyName||"Company B"}</div>
          <div style={{textAlign:"center"}}>Winner</div>
        </div>
        {metricRows.map((row,i) => {
          const winner = row.raw1 > row.raw2 ? 1 : row.raw2 > row.raw1 ? 2 : 0;
          return (
            <div className="compare-row" key={i}>
              <div className="compare-metric-name">{row.label}</div>
              <div className="compare-val" style={{color: winner===1?"#c9a84c":"var(--text)"}}>{row.v1}</div>
              <div className="compare-val" style={{color: winner===2?"#60a5fa":"var(--text)"}}>{row.v2}</div>
              <div style={{textAlign:"center"}}>
                {winner === 1 && <span className="winner-badge">{form1.companyName?.split(" ")[0]||"A"} ✓</span>}
                {winner === 2 && <span className="winner-badge" style={{background:"rgba(96,165,250,0.15)",color:"#60a5fa"}}>{form2.companyName?.split(" ")[0]||"B"} ✓</span>}
                {winner === 0 && <span style={{color:"var(--muted)",fontSize:11,fontFamily:"var(--font-mono)"}}>Tie</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights for both */}
      {[{r:r1,f:form1,color:"#c9a84c"},{r:r2,f:form2,color:"#60a5fa"}].map(({r,f,color},i) => (
        <div className="insights" key={i} style={{borderColor:`${color}20`}}>
          <div className="ai-badge" style={{color,borderColor:`${color}40`,background:`${color}10`}}>
            <div className="ai-dot" style={{background:color}}/> {f.companyName||`Company ${i===0?"A":"B"}`} — GROQ AI INSIGHTS
          </div>
          <h4 style={{color}}>{f.companyName||`Company ${i===0?"A":"B"}`} — Strategic Analysis</h4>
          {(r.insights||[]).map((ins,j) => {
            const tc = ins.type==="good"?"#4ade80":ins.type==="warn"?"#fb923c":"#f87171";
            return (
              <div className="insight-item" key={j}>
                <div className="insight-dot" style={{background:tc,color:tc}}/>
                <div><h5 style={{color:tc}}>{ins.title}</h5><p>{ins.text}</p></div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

// =============================================================================
// Main Component
// =============================================================================
export default function FinSight() {
  const [view,        setView]        = useState("form");
  const [inputMode,   setInputMode]   = useState("single");
  const [form,        setForm]        = useState({ ...EMPTY_FORM });
  const [form2,       setForm2]       = useState({ ...EMPTY_FORM });
  const [result,      setResult]      = useState(null);
  const [result2,     setResult2]     = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiStatus,   setApiStatus]   = useState("checking");
  const [error,       setError]       = useState("");
  const [downloading, setDownloading] = useState(false);
  const [resultsActive, setResultsActive] = useState(false);

  const radarRef = useRef(null);
  const barRef   = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.ok ? setApiStatus("ok") : setApiStatus("err"))
      .catch(() => setApiStatus("err"));
  }, []);

  const buildPayload = (f) => ({
    financialData: {
      companyName:        f.companyName || "SME Company",
      industry:           f.industry || "General",
      revenue:            parseFloat(f.revenue) || 0,
      prevRevenue:        parseFloat(f.prevRevenue) || null,
      netProfit:          parseFloat(f.netProfit) || 0,
      totalAssets:        parseFloat(f.totalAssets) || 0,
      totalLiabilities:   parseFloat(f.totalLiabilities) || 0,
      currentAssets:      parseFloat(f.currentAssets) || 0,
      currentLiabilities: parseFloat(f.currentLiabilities) || 1,
      inventory:          parseFloat(f.inventory) || 0,
      operatingExpenses:  parseFloat(f.operatingExpenses) || null,
    },
    yearlyData: [],
  });

  const analyze = async () => {
    setError("");
    setView("loading");
    setLoadingStep(0);
    setResultsActive(false);

    const stepInterval = setInterval(
      () => setLoadingStep(p => Math.min(LOADING_STEPS.length - 1, p + 1)),
      1200
    );

    try {
      const requests = [fetch(`${API_BASE}/api/analyze`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(buildPayload(form)),
      })];

      if (inputMode === "compare") {
        requests.push(fetch(`${API_BASE}/api/analyze`, {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify(buildPayload(form2)),
        }));
      }

      const responses = await Promise.all(requests);
      for (const r of responses) {
        if (!r.ok) { const e = await r.json(); throw new Error(e.detail || `Server error ${r.status}`); }
      }

      const [data1, data2] = await Promise.all(responses.map(r => r.json()));
      clearInterval(stepInterval);
      setResult(data1);
      if (data2) setResult2(data2);
      setTimeout(() => { setView("result"); setResultsActive(true); }, 300);
    } catch (e) {
      clearInterval(stepInterval);
      setError(`Analysis failed: ${e.message}. Make sure the backend is running.`);
      setView("form");
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      let radarBase64 = null, barBase64 = null;
      if (radarRef.current) radarBase64 = await toPng(radarRef.current, { backgroundColor: "#0a1a4a" });
      if (barRef.current)   barBase64   = await toPng(barRef.current,   { backgroundColor: "#0a1a4a" });

      const response = await fetch(`${API_BASE}/api/generate-report`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          results: result, formData: { companyName: form.companyName, industry: form.industry },
          charts: { radar: radarBase64, bar: barBase64 }
        }),
      });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `FinSight_${form.companyName||"Report"}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {
      alert(`PDF error: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const canAnalyze = inputMode === "compare"
    ? !!form.revenue && !!form.totalAssets && !!form2.revenue && !!form2.totalAssets
    : !!form.revenue && !!form.totalAssets;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="container">

          {/* Header */}
          <header className="header">
            <div className="logo">
              <div className="logo-icon">FS</div>
              <div className="logo-text">
                <h1>FinSight</h1>
                <p>SME FINANCIAL ANALYTICS</p>
              </div>
            </div>
            <span className={`api-status ${apiStatus==="ok"?"api-ok":"api-err"}`}>
              {apiStatus==="ok"?"● BACKEND CONNECTED":apiStatus==="err"?"● BACKEND OFFLINE":"● CHECKING..."}
            </span>
          </header>

          {/* Hero */}
          {view !== "result" && (
            <div className="hero">
              <h2>AI-Powered Financial Health <em>Scoring</em> for SMEs</h2>
              <p>Groq LLaMA-powered analysis with Altman Z-Score, SHAP explainability, company comparison, and 12-month forecasting.</p>
            </div>
          )}

          {error && <div className="error-banner">⚠ {error}</div>}

          {/* ── FORM VIEW ── */}
          {view === "form" && (
            <>
              <div className="mode-tabs">
                <button className={`mode-tab ${inputMode==="single"?"active":""}`} onClick={()=>setInputMode("single")}>SINGLE COMPANY</button>
                <button className={`mode-tab ${inputMode==="compare"?"active":""}`} onClick={()=>setInputMode("compare")}>COMPARE 2 COMPANIES</button>
              </div>

              {inputMode === "single" && (
                <>
                  <div className="demo-row">
                    <span className="demo-label">Try demo:</span>
                    {Object.keys(DEMOS).map(k => (
                      <button key={k} className="demo-btn" onClick={()=>setForm(DEMOS[k])}>{k}</button>
                    ))}
                  </div>
                  <div className="neu-card">
                    <CompanyForm form={form} setForm={setForm} label="Company A" dotClass="c1-dot" demos={false}/>
                  </div>
                </>
              )}

              {inputMode === "compare" && (
                <>
                  <div className="demo-row">
                    <span className="demo-label">Load demos:</span>
                    <button className="demo-btn" onClick={()=>{setForm(DEMOS["Healthy SME"]);setForm2(DEMOS["Struggling Co"]);}}>Healthy vs Struggling</button>
                    <button className="demo-btn" onClick={()=>{setForm(DEMOS["Growth Stage"]);setForm2(DEMOS["Healthy SME"]);}}>Growth vs Healthy</button>
                  </div>
                  <div className="comparison-grid">
                    <CompanyForm form={form}  setForm={setForm}  label="Company A" dotClass="c1-dot" demos={false}/>
                    <CompanyForm form={form2} setForm={setForm2} label="Company B" dotClass="c2-dot" demos={false}/>
                  </div>
                </>
              )}

              <button className="btn-analyze" onClick={analyze} disabled={!canAnalyze}>
                {inputMode==="compare" ? "COMPARE COMPANIES →" : "ANALYZE FINANCIAL HEALTH →"}
              </button>
              <div style={{height:60}}/>
            </>
          )}

          {/* ── LOADING VIEW ── */}
          {view === "loading" && (
            <div className="loading-state">
              <div className="spinner-gold"/>
              <p>{inputMode==="compare"?"ANALYZING BOTH COMPANIES...":"ANALYZING FINANCIAL DATA..."}</p>
              <div className="loading-steps">
                {LOADING_STEPS.map((s,i) => (
                  <div key={i} className={`loading-step ${i < loadingStep?"done":i===loadingStep?"active":""}`}>
                    {i < loadingStep ? "✓" : i===loadingStep ? "▶" : "○"} {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT VIEW ── */}
          {view === "result" && result && (
            <div className="results">
              <div className="action-row">
                <button className="back-btn" onClick={()=>setView("form")}>← BACK</button>
                {inputMode === "single" && (
                  <button className="download-btn" onClick={downloadPDF} disabled={downloading}>
                    {downloading ? "GENERATING..." : "↓ DOWNLOAD PDF"}
                  </button>
                )}
              </div>

              {inputMode === "single" ? (
                <SingleResult
                  result={result} companyName={form.companyName}
                  active={resultsActive} radarRef={radarRef} barRef={barRef}
                />
              ) : (
                <CompareResult r1={result} r2={result2} form1={form} form2={form2} active={resultsActive}/>
              )}

              <div style={{height:60}}/>
            </div>
          )}

        </div>
      </div>
    </>
  );
}