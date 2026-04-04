// =============================================================================
//  FinSight v4.0 — NEXT-GEN FINTECH UI
//  Cyber-Minimalist · Bento Grid · Glassmorphism · Dynamic Grade Glow
//  All existing logic preserved — only styles & JSX structure overhauled
// =============================================================================

import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ReferenceLine, Area, AreaChart, CartesianGrid, Line,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "https://finsight-backend-f0pq.onrender.com";

// =============================================================================
// Fonts & Global CSS — God-Level Redesign
// =============================================================================
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&family=Inter:wght@300;400;500;600&family=Geist+Mono:wght@300;400;500;600&display=swap');
`;

const styles = `
  ${FONTS}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

  :root {
    --bg: #030303;
    --bg2: #080810;
    --glass: rgba(255,255,255,0.028);
    --glass-border: rgba(255,255,255,0.055);
    --glass-hover: rgba(255,255,255,0.045);
    --surface: rgba(12,12,22,0.85);
    --surface2: rgba(18,18,30,0.9);

    --accent: #a3e635;
    --accent-dim: rgba(163,230,53,0.12);
    --accent-glow: rgba(163,230,53,0.25);
    --teal: #2dd4bf;
    --teal-dim: rgba(45,212,191,0.1);
    --violet: #8b5cf6;
    --violet-dim: rgba(139,92,246,0.1);
    --danger: #f87171;
    --danger-dim: rgba(248,113,113,0.1);
    --warning: #fb923c;
    --warning-dim: rgba(251,146,60,0.1);

    --text: #f1f5f9;
    --text2: #94a3b8;
    --text3: #475569;

    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'Geist Mono', monospace;

    --radius: 16px;
    --radius-sm: 10px;
    --radius-xs: 6px;

    --grade-color: #a3e635;
    --grade-glow: rgba(163,230,53,0.15);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  /* ── App Shell ── */
  .app {
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow-x: hidden;
  }

  /* Mesh gradient background */
  .mesh-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% -10%, rgba(99,102,241,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at -10% 80%, rgba(45,212,191,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(163,230,53,0.03) 0%, transparent 60%);
  }

  /* Noise texture overlay */
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.25;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
  }

  .page-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  /* ════════════════════════════════════════════
     GLASSMORPHISM UTILITY
  ════════════════════════════════════════════ */
  .glass {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
  }

  .glass-card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }

  .glass-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
    pointer-events: none;
  }

  .glass-card:hover {
    border-color: rgba(255,255,255,0.1);
    box-shadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    transform: translateY(-1px);
  }

  /* ════════════════════════════════════════════
     HEADER
  ════════════════════════════════════════════ */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(3,3,3,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-mark {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--accent) 0%, #65a30d 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 14px; font-weight: 600;
    color: #030303;
    box-shadow: 0 0 20px var(--accent-glow);
  }

  .logo-name {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .logo-name span { color: var(--accent); }

  .logo-sub {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 1px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    border: 1px solid;
  }

  .status-pill.ok {
    background: rgba(163,230,53,0.08);
    border-color: rgba(163,230,53,0.25);
    color: var(--accent);
  }

  .status-pill.err {
    background: rgba(248,113,113,0.08);
    border-color: rgba(248,113,113,0.25);
    color: var(--danger);
  }

  .status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* ════════════════════════════════════════════
     HERO SECTION
  ════════════════════════════════════════════ */
  .hero {
    padding: 72px 0 48px;
    text-align: center;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent-dim);
    border: 1px solid rgba(163,230,53,0.2);
    border-radius: 20px;
    padding: 5px 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.06em;
    margin-bottom: 28px;
  }

  .hero h2 {
    font-family: var(--font-display);
    font-size: clamp(36px, 5.5vw, 64px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 20px;
  }

  .hero h2 em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: 16px;
    color: var(--text2);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 24px;
  }

  .hero-tag {
    padding: 4px 12px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text2);
    letter-spacing: 0.06em;
  }

  /* ════════════════════════════════════════════
     FORM SECTION
  ════════════════════════════════════════════ */
  .form-wrap {
    padding-bottom: 80px;
  }

  /* Input mode tabs */
  .mode-tabs {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    padding: 4px;
    margin-bottom: 28px;
    width: fit-content;
  }

  .mode-tab {
    padding: 8px 18px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text2);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.05em;
  }

  .mode-tab.active {
    background: var(--accent);
    color: #030303;
    font-weight: 600;
    box-shadow: 0 0 20px var(--accent-glow);
  }

  /* Demo presets */
  .demo-strip {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    align-items: center;
    flex-wrap: wrap;
  }

  .demo-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .demo-chip {
    padding: 5px 14px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text2);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.04em;
  }

  .demo-chip:hover {
    background: var(--teal-dim);
    border-color: rgba(45,212,191,0.3);
    color: var(--teal);
  }

  /* Form grid */
  .form-block {
    margin-bottom: 24px;
  }

  .form-block-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--teal);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .form-block-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(45,212,191,0.3) 0%, transparent 100%);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  @media(max-width:600px) {
    .form-grid { grid-template-columns: 1fr; }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .field input, .field select {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--glass-border);
    color: var(--text);
    padding: 11px 14px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 13px;
    outline: none;
    transition: all 0.2s;
    -webkit-appearance: none;
  }

  .field input:focus, .field select:focus {
    border-color: rgba(163,230,53,0.4);
    background: rgba(163,230,53,0.03);
    box-shadow: 0 0 0 3px rgba(163,230,53,0.06);
  }

  .field input::placeholder {
    color: var(--text3);
    opacity: 0.7;
  }

  .field select option { background: #0f0f1a; }

  /* CTA button */
  .btn-cta {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, var(--accent) 0%, #65a30d 100%);
    color: #030303;
    border: none;
    border-radius: var(--radius-sm);
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: all 0.25s;
    margin-top: 8px;
    box-shadow: 0 0 30px var(--accent-glow);
    position: relative;
    overflow: hidden;
  }

  .btn-cta::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 40px var(--accent-glow); }
  .btn-cta:hover::after { opacity: 1; }
  .btn-cta:active { transform: translateY(0); }
  .btn-cta:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Error */
  .error-pill {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--danger);
    margin-bottom: 20px;
  }

  /* ════════════════════════════════════════════
     UPLOAD ZONE
  ════════════════════════════════════════════ */
  .upload-zone {
    border: 2px dashed rgba(255,255,255,0.08);
    border-radius: var(--radius);
    padding: 64px 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    background: rgba(255,255,255,0.015);
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: rgba(163,230,53,0.35);
    background: rgba(163,230,53,0.025);
  }

  .upload-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer;
    width: 100%; height: 100%;
  }

  .upload-icon {
    font-size: 44px;
    margin-bottom: 16px;
    filter: grayscale(0.3);
  }

  .upload-zone h3 {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }

  .upload-zone p { color: var(--text2); font-size: 14px; }

  .upload-bar-track {
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 1px;
    overflow: hidden;
    margin: 20px 0 8px;
  }

  .upload-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--teal));
    border-radius: 1px;
    transition: width 0.3s;
  }

  .upload-status {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text2);
  }

  .extracted-preview {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    padding: 20px;
    margin-top: 16px;
    text-align: left;
  }

  .extracted-preview-title {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--teal);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .extracted-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .extracted-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 12px;
  }

  .extracted-item:last-child { border-bottom: none; }
  .extracted-key { color: var(--text3); font-family: var(--font-mono); font-size: 10px; }
  .extracted-val { color: var(--accent); font-family: var(--font-mono); font-size: 11px; }

  /* Year tabs */
  .year-tabs { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }

  .year-tab {
    padding: 6px 14px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text2);
    cursor: pointer;
    transition: all 0.2s;
  }

  .year-tab.active {
    background: var(--accent-dim);
    border-color: rgba(163,230,53,0.35);
    color: var(--accent);
  }

  .add-year-btn {
    padding: 6px 14px;
    background: none;
    border: 1px dashed rgba(255,255,255,0.12);
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-year-btn:hover { border-color: var(--teal); color: var(--teal); }

  /* ════════════════════════════════════════════
     LOADING
  ════════════════════════════════════════════ */
  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 32px;
  }

  .loader-ring {
    width: 64px; height: 64px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.06);
    border-top-color: var(--accent);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-title {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text2);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .loading-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .loading-step {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
    letter-spacing: 0.05em;
    transition: color 0.4s;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .loading-step::before {
    content: '○';
    font-size: 10px;
  }

  .loading-step.active { color: var(--teal); }
  .loading-step.active::before { content: '◉'; color: var(--teal); }
  .loading-step.done { color: var(--accent); }
  .loading-step.done::before { content: '✓'; color: var(--accent); }

  /* ════════════════════════════════════════════
     RESULTS — BENTO GRID SYSTEM
  ════════════════════════════════════════════ */
  .results-wrap {
    padding-bottom: 120px;
    animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .results-topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .btn-back {
    display: flex; align-items: center; gap: 8px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    color: var(--text2);
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-back:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }

  .btn-pdf {
    display: flex; align-items: center; gap: 8px;
    background: var(--accent-dim);
    border: 1px solid rgba(163,230,53,0.25);
    color: var(--accent);
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-pdf:hover { background: rgba(163,230,53,0.15); }
  .btn-pdf:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-copy {
    display: flex; align-items: center; gap: 8px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    color: var(--text2);
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: auto;
  }

  .btn-copy:hover { border-color: var(--teal); color: var(--teal); }

  /* ── Hero Bento Row ── */
  .bento-hero {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  @media(max-width:900px) {
    .bento-hero { grid-template-columns: 1fr 1fr; }
  }

  @media(max-width:600px) {
    .bento-hero { grid-template-columns: 1fr; }
  }

  /* ── Main score hero card — spans 1 col but taller ── */
  .hero-score-card {
    grid-column: span 1;
    padding: 32px;
    border-radius: var(--radius);
    background: var(--glass);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 260px;
    transition: border-color 0.5s, box-shadow 0.5s;
  }

  .hero-score-card.grade-A {
    border-color: rgba(163,230,53,0.3);
    box-shadow: 0 0 60px rgba(163,230,53,0.1), inset 0 0 60px rgba(163,230,53,0.03);
  }

  .hero-score-card.grade-B {
    border-color: rgba(45,212,191,0.3);
    box-shadow: 0 0 60px rgba(45,212,191,0.1), inset 0 0 60px rgba(45,212,191,0.03);
  }

  .hero-score-card.grade-C {
    border-color: rgba(251,146,60,0.3);
    box-shadow: 0 0 60px rgba(251,146,60,0.1), inset 0 0 60px rgba(251,146,60,0.03);
  }

  .hero-score-card.grade-D {
    border-color: rgba(248,113,113,0.3);
    box-shadow: 0 0 60px rgba(248,113,113,0.1), inset 0 0 60px rgba(248,113,113,0.03);
  }

  .hero-score-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--grade-color), transparent);
    opacity: 0.6;
  }

  /* Score ring */
  .score-ring-wrap {
    position: relative;
    width: 110px; height: 110px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .score-ring-wrap svg {
    position: absolute; inset: 0;
    transform: rotate(-90deg);
  }

  .score-ring-track { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 6; }

  .score-ring-fill {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1);
    filter: drop-shadow(0 0 8px currentColor);
  }

  .score-num {
    font-family: var(--font-mono);
    font-size: 32px;
    font-weight: 600;
    color: var(--text);
    line-height: 1;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .score-num span {
    font-size: 12px;
    color: var(--text3);
    font-weight: 400;
    display: block;
    margin-top: 2px;
  }

  /* Company info in hero */
  .hero-company {
    text-align: center;
  }

  .hero-company-name {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }

  .grade-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
  }

  .grade-pill.grade-A { background: rgba(163,230,53,0.12); color: #a3e635; border: 1px solid rgba(163,230,53,0.25); }
  .grade-pill.grade-B { background: rgba(45,212,191,0.12); color: #2dd4bf; border: 1px solid rgba(45,212,191,0.25); }
  .grade-pill.grade-C { background: rgba(251,146,60,0.12); color: #fb923c; border: 1px solid rgba(251,146,60,0.25); }
  .grade-pill.grade-D { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }

  .hero-summary {
    font-size: 12px;
    color: var(--text2);
    line-height: 1.6;
    text-align: center;
    margin-top: 8px;
    max-width: 220px;
  }

  /* ── Altman Z hero card ── */
  .altman-hero-card {
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 260px;
  }

  .altman-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .altman-score {
    font-family: var(--font-mono);
    font-size: 52px;
    font-weight: 600;
    line-height: 1;
    margin: 8px 0;
  }

  .altman-zone {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 4px;
    display: inline-block;
  }

  .altman-spectrum {
    margin-top: 20px;
  }

  .altman-bar {
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
    position: relative;
  }

  .altman-bar-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--danger), var(--warning), var(--accent));
    transition: width 1.5s cubic-bezier(0.22,1,0.36,1);
  }

  .altman-labels {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
  }

  /* ── Invest score hero card ── */
  .invest-hero-card {
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 260px;
  }

  .invest-score-big {
    font-family: var(--font-mono);
    font-size: 64px;
    font-weight: 600;
    line-height: 1;
  }

  .invest-bar-track {
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
    margin: 12px 0 6px;
  }

  .invest-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1.4s cubic-bezier(0.22,1,0.36,1);
  }

  .invest-verdict {
    font-size: 12px;
    color: var(--text2);
    line-height: 1.6;
    margin-top: 8px;
  }

  /* ── 2nd Bento Row — charts + SHAP ── */
  .bento-row2 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }

  @media(max-width:900px) {
    .bento-row2 { grid-template-columns: 1fr 1fr; }
  }

  @media(max-width:600px) {
    .bento-row2 { grid-template-columns: 1fr; }
  }

  .bento-card {
    border-radius: var(--radius);
    padding: 24px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
    transition: border-color 0.25s, transform 0.2s;
  }

  .bento-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  .bento-card:hover {
    border-color: rgba(255,255,255,0.1);
    transform: translateY(-1px);
  }

  .bento-card.span2 { grid-column: span 2; }
  .bento-card.span3 { grid-column: span 3; }

  @media(max-width:900px) {
    .bento-card.span2 { grid-column: span 2; }
    .bento-card.span3 { grid-column: span 2; }
  }

  @media(max-width:600px) {
    .bento-card.span2, .bento-card.span3 { grid-column: span 1; }
  }

  .card-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-label-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  /* ── Metric mini cards ── */
  .bento-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
    margin-bottom: 14px;
  }

  .metric-tile {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);
    padding: 18px 16px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
  }

  .metric-tile:hover {
    border-color: rgba(255,255,255,0.1);
    transform: translateY(-1px);
  }

  .metric-tile-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .metric-tile-value {
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 4px;
  }

  .metric-tile-sub {
    font-size: 11px;
    color: var(--text3);
    margin-bottom: 10px;
  }

  .metric-tile-bar {
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 1px;
    overflow: hidden;
  }

  .metric-tile-bar-fill {
    height: 100%;
    border-radius: 1px;
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
  }

  /* color classes */
  .c-good { color: #a3e635; }
  .c-ok   { color: #2dd4bf; }
  .c-warn { color: #fb923c; }
  .c-bad  { color: #f87171; }

  /* ── SHAP in bento ── */
  .shap-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .shap-lbl {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text2);
    width: 120px;
    flex-shrink: 0;
    text-align: right;
  }

  .shap-bar-area {
    flex: 1;
    height: 20px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .shap-zero-line {
    position: absolute;
    left: 50%; top: 0; bottom: 0;
    width: 1px;
    background: rgba(255,255,255,0.08);
  }

  .shap-bar-pos {
    position: absolute;
    left: 50%;
    height: 14px;
    border-radius: 2px;
    background: linear-gradient(90deg, rgba(163,230,53,0.6), rgba(163,230,53,0.9));
  }

  .shap-bar-neg {
    position: absolute;
    right: 50%;
    height: 14px;
    border-radius: 2px;
    background: linear-gradient(90deg, rgba(248,113,113,0.9), rgba(248,113,113,0.6));
  }

  .shap-pts {
    font-family: var(--font-mono);
    font-size: 11px;
    width: 52px;
    flex-shrink: 0;
    text-align: right;
  }

  /* ── Insights ── */
  .insight-row {
    display: flex;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    align-items: flex-start;
  }

  .insight-row:last-child { border-bottom: none; padding-bottom: 0; }

  .insight-indicator {
    width: 3px;
    border-radius: 2px;
    flex-shrink: 0;
    align-self: stretch;
    min-height: 40px;
  }

  .insight-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 3px;
    color: var(--text);
  }

  .insight-text {
    font-size: 12px;
    color: var(--text2);
    line-height: 1.6;
  }

  /* ── Forecast chart card ── */
  .forecast-note {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    margin-top: 10px;
    display: flex;
    gap: 12px;
  }

  .forecast-note span { color: var(--warning); }

  /* ── Benchmark section ── */
  .benchmark-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .benchmark-name {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text2);
    width: 130px;
    flex-shrink: 0;
  }

  .benchmark-bars-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 120px;
  }

  .bm-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bm-who {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    width: 24px;
    flex-shrink: 0;
  }

  .bm-track {
    flex: 1;
    height: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 2px;
    overflow: hidden;
  }

  .bm-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s;
  }

  .bm-val {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    width: 28px;
    text-align: right;
    flex-shrink: 0;
  }

  .bm-status {
    font-family: var(--font-mono);
    font-size: 9px;
    padding: 2px 7px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .bm-better { background: rgba(163,230,53,0.1); color: #a3e635; }
  .bm-onpar  { background: rgba(45,212,191,0.1); color: #2dd4bf; }
  .bm-worse  { background: rgba(248,113,113,0.1); color: #f87171; }

  /* ════════════════════════════════════════════
     FUTURISTIC SCENARIO SIMULATOR
  ════════════════════════════════════════════ */
  .sim-panel {
    border-radius: var(--radius);
    padding: 28px;
    background: linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(45,212,191,0.03) 100%);
    border: 1px solid rgba(139,92,246,0.2);
    backdrop-filter: blur(20px);
    margin-bottom: 14px;
    position: relative;
    overflow: hidden;
  }

  .sim-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
  }

  .sim-title {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--violet);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sim-title-icon {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--violet);
    box-shadow: 0 0 6px var(--violet);
  }

  .sim-subtitle {
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 24px;
  }

  .sim-sliders {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media(max-width:700px) {
    .sim-sliders { grid-template-columns: 1fr; }
  }

  .sim-slider-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sim-slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sim-slider-name {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .sim-slider-value {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
  }

  /* Custom range slider */
  input[type="range"].futuristic-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    cursor: pointer;
    outline: none;
  }

  input[type="range"].futuristic-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--violet);
    border: 2px solid rgba(255,255,255,0.2);
    box-shadow: 0 0 12px rgba(139,92,246,0.6);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  input[type="range"].futuristic-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(139,92,246,0.8);
  }

  input[type="range"].futuristic-slider::-moz-range-thumb {
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--violet);
    border: 2px solid rgba(255,255,255,0.2);
    cursor: pointer;
  }

  .slider-ticks {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    margin-top: 2px;
  }

  .btn-simulate {
    padding: 11px 28px;
    background: linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.1) 100%);
    border: 1px solid rgba(139,92,246,0.4);
    color: #c4b5fd;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .btn-simulate:hover {
    background: rgba(139,92,246,0.25);
    box-shadow: 0 0 24px rgba(139,92,246,0.3);
  }

  .btn-simulate:disabled { opacity: 0.4; cursor: not-allowed; }

  .sim-result-grid {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: var(--radius-sm);
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 14px;
    margin-top: 16px;
  }

  .sim-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sim-stat-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .sim-stat-value {
    font-family: var(--font-mono);
    font-size: 20px;
    font-weight: 600;
    color: #a5b4fc;
  }

  .sim-delta {
    font-family: var(--font-mono);
    font-size: 10px;
  }

  /* ════════════════════════════════════════════
     RECOMMENDATIONS
  ════════════════════════════════════════════ */
  .rec-item {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-left: 3px solid transparent;
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-bottom: 10px;
    transition: all 0.2s;
  }

  .rec-item:last-child { margin-bottom: 0; }
  .rec-item:hover { background: rgba(255,255,255,0.04); }

  .rec-item.high   { border-left-color: var(--danger); }
  .rec-item.medium { border-left-color: var(--warning); }
  .rec-item.low    { border-left-color: var(--accent); }

  .rec-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .rec-priority-badge {
    font-family: var(--font-mono);
    font-size: 9px;
    padding: 2px 8px;
    border-radius: 3px;
    letter-spacing: 0.06em;
    font-weight: 600;
    flex-shrink: 0;
  }

  .rec-priority-badge.high   { background: rgba(248,113,113,0.12); color: var(--danger); }
  .rec-priority-badge.medium { background: rgba(251,146,60,0.12);  color: var(--warning); }
  .rec-priority-badge.low    { background: rgba(163,230,53,0.12);  color: var(--accent); }

  .rec-action { font-size: 13px; font-weight: 600; color: var(--text); }
  .rec-detail { font-size: 12px; color: var(--text2); line-height: 1.6; margin-bottom: 8px; }

  .rec-impact {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--teal);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rec-impact::before { content: '→'; opacity: 0.5; }

  /* ════════════════════════════════════════════
     FLOATING CHAT WIDGET
  ════════════════════════════════════════════ */
  .chat-fab {
    position: fixed;
    bottom: 28px; right: 28px;
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--teal) 0%, #0d9488 100%);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 24px rgba(45,212,191,0.4);
    transition: all 0.25s;
    z-index: 200;
  }

  .chat-fab:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 32px rgba(45,212,191,0.5);
  }

  .chat-panel {
    position: fixed;
    bottom: 92px; right: 28px;
    width: 360px;
    max-height: 500px;
    background: rgba(8,8,16,0.96);
    border: 1px solid rgba(45,212,191,0.2);
    border-radius: var(--radius);
    backdrop-filter: blur(32px);
    display: flex;
    flex-direction: column;
    z-index: 200;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(45,212,191,0.08);
    animation: slideUp 0.25s cubic-bezier(0.22,1,0.36,1);
    overflow: hidden;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media(max-width:480px) {
    .chat-panel {
      left: 16px; right: 16px;
      width: auto;
      bottom: 80px;
    }
  }

  .chat-panel-header {
    padding: 16px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .chat-panel-icon {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(45,212,191,0.15);
    border: 1px solid rgba(45,212,191,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .chat-panel-title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
  }

  .chat-panel-sub {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
  }

  .chat-panel-close {
    margin-left: auto;
    background: none;
    border: none;
    color: var(--text3);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 4px;
    transition: color 0.2s;
  }

  .chat-panel-close:hover { color: var(--text); }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 280px;
  }

  .chat-msg {
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 1.6;
    max-width: 88%;
  }

  .chat-msg.user {
    background: rgba(163,230,53,0.08);
    border: 1px solid rgba(163,230,53,0.15);
    color: var(--text);
    align-self: flex-end;
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .chat-msg.ai {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    color: var(--text2);
    align-self: flex-start;
  }

  .chat-msg.loading {
    opacity: 0.5;
    font-style: italic;
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .chat-quick-btns {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 0 16px 10px;
  }

  .chat-quick-btn {
    padding: 4px 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    cursor: pointer;
    transition: all 0.2s;
  }

  .chat-quick-btn:hover { border-color: var(--teal); color: var(--teal); }

  .chat-input-wrap {
    padding: 12px 16px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    gap: 8px;
  }

  .chat-input-field {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: var(--text);
    padding: 9px 12px;
    border-radius: var(--radius-xs);
    font-family: var(--font-mono);
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s;
  }

  .chat-input-field:focus { border-color: rgba(45,212,191,0.4); }
  .chat-input-field::placeholder { color: var(--text3); }

  .chat-send-btn {
    padding: 9px 14px;
    background: var(--teal);
    color: #030303;
    border: none;
    border-radius: var(--radius-xs);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.04em;
  }

  .chat-send-btn:hover { background: #5eead4; }
  .chat-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ════════════════════════════════════════════
     MOBILE BOTTOM NAV
  ════════════════════════════════════════════ */
  .mobile-nav {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(8,8,16,0.96);
    border-top: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(24px);
    padding: 8px 16px;
    z-index: 150;
    justify-content: space-around;
  }

  @media(max-width:640px) {
    .mobile-nav { display: flex; }
    .results-wrap { padding-bottom: 80px; }
    .chat-fab { bottom: 80px; }
    .chat-panel { bottom: 140px; }
  }

  .mobile-nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: var(--radius-xs);
    transition: background 0.2s;
  }

  .mobile-nav-btn:hover { background: rgba(255,255,255,0.05); }

  .mobile-nav-icon { font-size: 18px; }

  .mobile-nav-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 0.06em;
  }

  /* ════════════════════════════════════════════
     COPY TOAST
  ════════════════════════════════════════════ */
  .copy-toast {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(163,230,53,0.15);
    border: 1px solid rgba(163,230,53,0.3);
    color: var(--accent);
    padding: 8px 20px;
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    opacity: 0;
    transition: all 0.3s;
    z-index: 300;
    pointer-events: none;
  }

  .copy-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* ════════════════════════════════════════════
     SECTION DIVIDER
  ════════════════════════════════════════════ */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0 14px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .section-divider::before, .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }

  /* AI Groq badge */
  .groq-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(45,212,191,0.07);
    border: 1px solid rgba(45,212,191,0.18);
    border-radius: 20px;
    padding: 4px 12px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--teal);
    letter-spacing: 0.06em;
    margin-bottom: 16px;
  }

  .groq-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--teal);
    animation: blink 1.5s infinite;
  }
`;

// =============================================================================
// Constants
// =============================================================================
const DEMOS = {
  "Healthy SME":   {companyName:"TechVentures Pvt Ltd",industry:"Technology",revenue:"5000000",prevRevenue:"4200000",netProfit:"750000",totalAssets:"8000000",totalLiabilities:"2400000",currentAssets:"3200000",currentLiabilities:"1500000",inventory:"400000",operatingExpenses:"3800000"},
  "Struggling Co": {companyName:"OldTrade Industries",industry:"Retail",revenue:"2000000",prevRevenue:"2400000",netProfit:"-80000",totalAssets:"5000000",totalLiabilities:"3800000",currentAssets:"900000",currentLiabilities:"1100000",inventory:"300000",operatingExpenses:"1900000"},
  "Growth Stage":  {companyName:"NovaSpark Solutions",industry:"Technology",revenue:"8500000",prevRevenue:"5000000",netProfit:"420000",totalAssets:"12000000",totalLiabilities:"5500000",currentAssets:"4800000",currentLiabilities:"2200000",inventory:"600000",operatingExpenses:"7200000"},
};
const EMPTY_FORM = {companyName:"",industry:"General",revenue:"",prevRevenue:"",netProfit:"",totalAssets:"",totalLiabilities:"",currentAssets:"",currentLiabilities:"",inventory:"",operatingExpenses:""};
const LOADING_STEPS = ["PARSING FINANCIAL DATA...","COMPUTING ALTMAN Z-SCORE...","RUNNING SCORING ENGINE...","COMPUTING SHAP ATTRIBUTIONS...","CALLING GROQ AI...","BUILDING FORECAST TRAJECTORY..."];
const INDUSTRIES = ["Technology","Manufacturing","Retail","Healthcare","Finance","Real Estate","Education","General"];
const BENCH_LABELS = {currentRatio:"Current Ratio",quickRatio:"Quick Ratio",debtRatio:"Debt Ratio",netProfitMargin:"Net Margin",revenueGrowth:"Revenue Growth",assetTurnover:"Asset Turnover"};
const QUICK_QUESTIONS = ["Why is my score this?","How to reduce debt?","Is my growth healthy?","What's my biggest risk?"];

// =============================================================================
// Grade color helper
// =============================================================================
const gradeCol = g => g==="A"?"#a3e635":g==="B"?"#2dd4bf":g==="C"?"#fb923c":"#f87171";
const barCol   = s => s>=75?"#a3e635":s>=50?"#2dd4bf":s>=30?"#fb923c":"#f87171";
const typeCol  = t => t==="good"?"#a3e635":t==="warn"?"#fb923c":"#f87171";

// =============================================================================
// BenchmarkSection
// =============================================================================
function BenchmarkSection({ benchmarks, industry }) {
  if (!benchmarks) return null;
  const getPct = (v, max) => Math.min(100, (v / Math.max(max, 0.01)) * 100);
  return (
    <>
      {Object.entries(benchmarks).map(([key, data]) => {
        const max = Math.max(data.yours, data.industry, 0.01) * 1.2;
        const st  = data.status?.replace("-","");
        return (
          <div className="benchmark-row" key={key}>
            <div className="benchmark-name">{BENCH_LABELS[key]||key}</div>
            <div className="benchmark-bars-wrap">
              <div className="bm-row">
                <div className="bm-who" style={{color:"#a3e635"}}>You</div>
                <div className="bm-track"><div className="bm-fill" style={{width:getPct(data.yours,max)+"%",background:"#a3e635"}}/></div>
                <div className="bm-val">{data.yours}</div>
              </div>
              <div className="bm-row">
                <div className="bm-who">Avg</div>
                <div className="bm-track"><div className="bm-fill" style={{width:getPct(data.industry,max)+"%",background:"rgba(255,255,255,0.2)"}}/></div>
                <div className="bm-val">{data.industry}</div>
              </div>
            </div>
            <div className={`bm-status ${st==="better"?"bm-better":st==="onpar"?"bm-onpar":"bm-worse"}`}>
              {st==="better"?"▲ BETTER":st==="onpar"?"≈ PAR":"▼ BELOW"}
            </div>
          </div>
        );
      })}
    </>
  );
}

// =============================================================================
// Recommendations
// =============================================================================
function RecommendationsSection({ recommendations }) {
  if (!recommendations?.length) return null;
  return (
    <>
      {recommendations.map((rec, i) => (
        <div className={`rec-item ${rec.priority}`} key={i}>
          <div className="rec-header">
            <span className={`rec-priority-badge ${rec.priority}`}>{rec.priority?.toUpperCase()}</span>
            <span className="rec-action">{rec.action}</span>
          </div>
          <p className="rec-detail">{rec.detail}</p>
          <div className="rec-impact">{rec.impact}</div>
        </div>
      ))}
    </>
  );
}

// =============================================================================
// Futuristic Scenario Simulator
// =============================================================================
function SimulationSection({ originalResult, originalForm }) {
  const [sc,         setSc]         = useState({revenueChange:0,expenseChange:0,debtChange:0});
  const [simResult,  setSimResult]  = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const runSim = async () => {
    setSimLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulate`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          financialData:{
            companyName:      originalForm.companyName||"SME",
            industry:         originalForm.industry||"General",
            revenue:          parseFloat(originalForm.revenue)||0,
            prevRevenue:      parseFloat(originalForm.prevRevenue)||null,
            netProfit:        parseFloat(originalForm.netProfit)||0,
            totalAssets:      parseFloat(originalForm.totalAssets)||0,
            totalLiabilities: parseFloat(originalForm.totalLiabilities)||0,
            currentAssets:    parseFloat(originalForm.currentAssets)||0,
            currentLiabilities:parseFloat(originalForm.currentLiabilities)||1,
            inventory:        parseFloat(originalForm.inventory)||0,
            operatingExpenses:parseFloat(originalForm.operatingExpenses)||null,
          },
          scenarios:sc,
        }),
      });
      const data = await res.json();
      setSimResult(data);
    } catch(e) { console.error(e); }
    finally { setSimLoading(false); }
  };

  const delta = (nv, ov) => {
    const d = nv - ov;
    if (Math.abs(d) < 0.5) return null;
    return <span className="sim-delta" style={{color:d>0?"#a3e635":"#f87171"}}>{d>0?"▲":"▼"}{Math.abs(d).toFixed(1)}</span>;
  };

  const sliderCols = { revenueChange:"#a3e635", expenseChange:"#fb923c", debtChange:"#f87171" };

  return (
    <div className="sim-panel">
      <div className="sim-title"><div className="sim-title-icon"/>SCENARIO SIMULATOR</div>
      <div className="sim-subtitle">Adjust levers to model how business changes affect your financial health score.</div>
      <div className="sim-sliders">
        {[
          {key:"revenueChange",  label:"Revenue Delta"},
          {key:"expenseChange",  label:"Expense Delta"},
          {key:"debtChange",     label:"Debt Delta"},
        ].map(({key,label}) => (
          <div className="sim-slider-item" key={key}>
            <div className="sim-slider-header">
              <span className="sim-slider-name">{label}</span>
              <span className="sim-slider-value" style={{color:sliderCols[key]}}>
                {sc[key]>0?"+":""}{sc[key]}%
              </span>
            </div>
            <input
              type="range"
              className="futuristic-slider"
              min="-50" max="50" step="5"
              value={sc[key]}
              onChange={e=>setSc(s=>({...s,[key]:parseInt(e.target.value)}))}
              style={{accentColor:sliderCols[key]}}
            />
            <div className="slider-ticks"><span>-50%</span><span>0</span><span>+50%</span></div>
          </div>
        ))}
      </div>
      <button className="btn-simulate" onClick={runSim} disabled={simLoading}>
        {simLoading?"COMPUTING...":"▶ RUN SIMULATION"}
      </button>
      {simResult && (
        <div className="sim-result-grid">
          {[
            {label:"Health Score", val:simResult.totalScore+"/100",      old:originalResult.totalScore,      cur:simResult.totalScore},
            {label:"Grade",        val:simResult.grade,                   old:null,                           cur:null},
            {label:"Debt Ratio",   val:simResult.metrics?.debtRatio,      old:parseFloat(originalResult.metrics?.debtRatio),      cur:parseFloat(simResult.metrics?.debtRatio)},
            {label:"Net Margin",   val:simResult.metrics?.netProfitMargin,old:parseFloat(originalResult.metrics?.netProfitMargin),cur:parseFloat(simResult.metrics?.netProfitMargin)},
            {label:"Current Ratio",val:simResult.metrics?.currentRatio,   old:parseFloat(originalResult.metrics?.currentRatio),   cur:parseFloat(simResult.metrics?.currentRatio)},
            {label:"Invest Score", val:simResult.investScore+"/100",       old:originalResult.investScore,    cur:simResult.investScore},
          ].map(({label,val,old,cur},i)=>(
            <div className="sim-stat" key={i}>
              <div className="sim-stat-label">{label}</div>
              <div className="sim-stat-value">{val}</div>
              {old!==null && i===0 && delta(cur,old)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Floating Chat Widget
// =============================================================================
function ChatWidget({ analysisContext, visible, onClose }) {
  const [messages,    setMessages]    = useState([{role:"ai",text:"Hi! I'm FinSight AI. Ask me anything about your company's financial health."}]);
  const [input,       setInput]       = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send = async (text) => {
    const msg = text||input.trim();
    if (!msg) return;
    setInput("");
    setMessages(m=>[...m,{role:"user",text:msg}]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:msg, analysisContext}),
      });
      const data = await res.json();
      setMessages(m=>[...m,{role:"ai",text:data.answer||"Sorry, couldn't process that."}]);
    } catch(e) {
      setMessages(m=>[...m,{role:"ai",text:"Connection error. Try again."}]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <div className="chat-panel-icon">🤖</div>
        <div>
          <div className="chat-panel-title">FinSight AI</div>
          <div className="chat-panel-sub">Groq LLaMA · Real-time analysis</div>
        </div>
        <button className="chat-panel-close" onClick={onClose}>✕</button>
      </div>
      <div className="chat-messages">
        {messages.map((m,i)=>(
          <div className={`chat-msg ${m.role}`} key={i}>{m.text}</div>
        ))}
        {chatLoading && <div className="chat-msg ai loading">Thinking...</div>}
        <div ref={endRef}/>
      </div>
      <div className="chat-quick-btns">
        {QUICK_QUESTIONS.map((q,i)=>(
          <button key={i} className="chat-quick-btn" onClick={()=>send(q)} disabled={chatLoading}>{q}</button>
        ))}
      </div>
      <div className="chat-input-wrap">
        <input
          className="chat-input-field"
          placeholder="Ask about your finances..."
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!chatLoading&&send()}
          disabled={chatLoading}
        />
        <button className="chat-send-btn" onClick={()=>send()} disabled={chatLoading||!input.trim()}>
          {chatLoading?"...":"SEND"}
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================
export default function FinSight() {
  const [view,        setView]        = useState("form");
  const [inputMode,   setInputMode]   = useState("manual");
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [yearlyData,  setYearlyData]  = useState([{year:"2024",revenue:"",netProfit:"",totalAssets:"",totalLiabilities:"",currentAssets:"",currentLiabilities:"1",inventory:"",operatingExpenses:""}]);
  const [activeYear,  setActiveYear]  = useState(0);
  const [result,      setResult]      = useState(null);
  const [animScore,   setAnimScore]   = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [uploadState, setUploadState] = useState({status:"idle",progress:0,extracted:null});
  const [isDragOver,  setIsDragOver]  = useState(false);
  const [apiStatus,   setApiStatus]   = useState("checking");
  const [error,       setError]       = useState("");
  const [downloading, setDownloading] = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const [copyToast,   setCopyToast]   = useState(false);

  const radarRef = useRef(null);
  const barRef   = useRef(null);

  // Backend health check
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r=>r.ok?setApiStatus("ok"):setApiStatus("err"))
      .catch(()=>setApiStatus("err"));
  },[]);

  const set          = (k,v)=>setForm(f=>({...f,[k]:v}));
  const setYearField = (idx,k,v)=>setYearlyData(p=>p.map((y,i)=>i===idx?{...y,[k]:v}:y));
  const addYear      = ()=>{
    const last=yearlyData[yearlyData.length-1];
    const ni  =yearlyData.length;
    setYearlyData(p=>[...p,{year:String((parseInt(last.year)||2024)+1),revenue:"",netProfit:"",totalAssets:"",totalLiabilities:"",currentAssets:"",currentLiabilities:"1",inventory:"",operatingExpenses:""}]);
    setActiveYear(ni);
  };

  const handleFileUpload = async(file)=>{
    if(!file)return;
    setUploadState({status:"processing",progress:10,extracted:null});
    const tick=setInterval(()=>setUploadState(p=>({...p,progress:Math.min(88,p.progress+14)})),200);
    try{
      const fd=new FormData();fd.append("file",file);
      const res=await fetch(`${API_BASE}/api/extract-document`,{method:"POST",body:fd});
      const data=await res.json();
      clearInterval(tick);
      if(!res.ok)throw new Error(data.detail||"Extraction failed");
      setUploadState({status:"done",progress:100,extracted:data.data});
      setForm(f=>({...f,...data.data}));
    }catch(e){
      clearInterval(tick);
      setUploadState({status:"error",progress:0,extracted:null});
      setError(`Extraction failed: ${e.message}`);
    }
  };

  const analyze=async()=>{
    setError("");setView("loading");setLoadingStep(0);
    const si=setInterval(()=>setLoadingStep(p=>Math.min(LOADING_STEPS.length-1,p+1)),1200);
    const af=inputMode==="upload"&&uploadState.extracted?{...form,...uploadState.extracted}:inputMode==="multiyear"?{...form,...yearlyData[yearlyData.length-1]}:form;
    try{
      const res=await fetch(`${API_BASE}/api/analyze`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          financialData:{
            companyName:af.companyName||"SME Company",
            industry:af.industry||"General",
            revenue:parseFloat(af.revenue)||0,
            prevRevenue:parseFloat(af.prevRevenue)||null,
            netProfit:parseFloat(af.netProfit)||0,
            totalAssets:parseFloat(af.totalAssets)||0,
            totalLiabilities:parseFloat(af.totalLiabilities)||0,
            currentAssets:parseFloat(af.currentAssets)||0,
            currentLiabilities:parseFloat(af.currentLiabilities)||1,
            inventory:parseFloat(af.inventory)||0,
            operatingExpenses:parseFloat(af.operatingExpenses)||null,
          },
          yearlyData:yearlyData.filter(y=>y.revenue).map(y=>({
            year:y.year,
            revenue:parseFloat(y.revenue)||0,netProfit:parseFloat(y.netProfit)||0,
            totalAssets:parseFloat(y.totalAssets)||0,totalLiabilities:parseFloat(y.totalLiabilities)||0,
            currentAssets:parseFloat(y.currentAssets)||0,currentLiabilities:parseFloat(y.currentLiabilities)||1,
            inventory:parseFloat(y.inventory)||0,operatingExpenses:parseFloat(y.operatingExpenses)||0,
          })),
        }),
      });
      if(!res.ok){const e=await res.json();throw new Error(e.detail||`Error ${res.status}`);}
      const data=await res.json();
      clearInterval(si);
      setResult(data);setAnimScore(0);
      setTimeout(()=>setView("result"),300);
    }catch(e){
      clearInterval(si);
      setError(`Analysis failed: ${e.message}`);
      setView("form");
    }
  };

  const downloadPDF=async()=>{
    if(!result)return;
    setDownloading(true);
    try{
      let rb=null,bb=null;
      if(radarRef.current)rb=await toPng(radarRef.current,{backgroundColor:"#080810"});
      if(barRef.current)bb=await toPng(barRef.current,{backgroundColor:"#080810"});
      const af=inputMode==="upload"&&uploadState.extracted?{...form,...uploadState.extracted}:inputMode==="multiyear"?{...form,...yearlyData[yearlyData.length-1]}:form;
      const response=await fetch(`${API_BASE}/api/generate-report`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({results:result,formData:{companyName:af.companyName||"SME",industry:af.industry||"General"},charts:{radar:rb,bar:bb}}),
      });
      if(!response.ok)throw new Error("Failed to generate PDF");
      const blob=await response.blob();
      const url=window.URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.download=`FinSight_Report_${af.companyName||"SME"}.pdf`;
      document.body.appendChild(a);a.click();a.remove();
    }catch(e){
      alert(`PDF failed: ${e.message}`);
    }finally{setDownloading(false);}
  };

  // Copy summary to clipboard
  const copySummary=()=>{
    if(!result)return;
    const txt=`FinSight Report — ${result.companyName||form.companyName}
Score: ${result.totalScore}/100 | Grade: ${result.grade} | Risk: ${result.riskLevel}
Altman Z: ${result.altman?.Z} (${result.altman?.zone})
Investment Score: ${result.investScore}/100
Summary: ${result.summary}`;
    navigator.clipboard.writeText(txt);
    setCopyToast(true);
    setTimeout(()=>setCopyToast(false),2500);
  };

  // Score animation
  useEffect(()=>{
    if(view==="result"&&result){
      let s=0;const end=result.totalScore;
      const step=()=>{s+=2;setAnimScore(Math.min(s,end));if(s<end)requestAnimationFrame(step);};
      requestAnimationFrame(step);
    }
  },[view,result]);

  const circ      = 2*Math.PI*52;
  const dashOff   = result?circ-(animScore/100)*circ:circ;
  const gColor    = result?gradeCol(result.grade):"#a3e635";
  const maxShap   = result?Math.max(...(result.shapValues||[]).map(s=>Math.abs(s.contribution)),1):1;

  const radarData = result
    ?Object.entries(result.scores).map(([k,v])=>({subject:k.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase()),value:v,fullMark:100}))
    :[];

  const barData = result?[
    {name:"Liquidity",score:result.scores.liquidity},
    {name:"Quick",    score:result.scores.quickRatio},
    {name:"Debt",     score:result.scores.debtHealth},
    {name:"Profit",   score:result.scores.profitability},
    {name:"Growth",   score:result.scores.growth},
    {name:"Efficiency",score:result.scores.efficiency},
  ]:[];

  const canAnalyze =
    inputMode==="upload"    ? uploadState.status==="done" :
    inputMode==="multiyear" ? yearlyData.some(y=>y.revenue) :
                              !!form.revenue&&!!form.totalAssets;

  const activeForm = inputMode==="upload"&&uploadState.extracted?{...form,...uploadState.extracted}:inputMode==="multiyear"?{...form,...yearlyData[yearlyData.length-1]}:form;

  const analysisCtx = result?{
    companyName:result.companyName||form.companyName,
    industry:result.industry||form.industry,
    totalScore:result.totalScore,grade:result.grade,
    riskLevel:result.riskLevel,investScore:result.investScore,
    metrics:result.metrics,altman:result.altman,summary:result.summary,
  }:{};

  // ── Tooltip for recharts ──
  const ChartTooltip = ({contentStyle:_,...p}) => (
    <div style={{background:"rgba(8,8,16,0.95)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"8px 12px",fontFamily:"Geist Mono",fontSize:11,color:"#f1f5f9",...p}}/>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="mesh-bg"/>
        <div className="noise"/>

        {/* ═══════════════════════════════
            HEADER
        ═══════════════════════════════ */}
        <div className="page-wrap">
          <header className="header">
            <div className="logo">
              <div className="logo-mark">FS</div>
              <div>
                <div className="logo-name">Fin<span>Sight</span></div>
                <div className="logo-sub">SME Financial Intelligence · v4.0</div>
              </div>
            </div>
            <div className="header-right">
              <div className={`status-pill ${apiStatus==="ok"?"ok":"err"}`}>
                <div className="status-dot"/>
                {apiStatus==="ok"?"BACKEND LIVE":apiStatus==="err"?"OFFLINE":"CONNECTING"}
              </div>
            </div>
          </header>
        </div>

        <div className="page-wrap">

          {/* ═══════════════════════════════
              HERO
          ═══════════════════════════════ */}
          {view!=="result" && (
            <div className="hero">
              <div className="hero-eyebrow">
                <span style={{width:6,height:6,borderRadius:"50%",background:"#a3e635",flexShrink:0,display:"inline-block"}}/>
                POWERED BY GROQ LLAMA 3.3 70B
              </div>
              <h2>AI Financial Health<br/><em>Intelligence</em> for SMEs</h2>
              <p className="hero-sub">Real-time scoring · Altman Z-Score · SHAP explainability · Scenario simulation · AI chat</p>
              <div className="hero-tags">
                {["Groq LLaMA","Altman Z-Score","SHAP XAI","Industry Benchmarking","Scenario Sim","PDF Export"].map(t=>(
                  <span className="hero-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {error && <div className="error-pill">⚠ {error}</div>}

          {/* ═══════════════════════════════
              FORM VIEW
          ═══════════════════════════════ */}
          {view==="form" && (
            <div className="form-wrap">
              <div className="mode-tabs">
                {["manual","upload","multiyear"].map(m=>(
                  <button key={m} className={`mode-tab ${inputMode===m?"active":""}`} onClick={()=>setInputMode(m)}>
                    {m==="manual"?"Manual Entry":m==="upload"?"Upload Doc":"Multi-Year"}
                  </button>
                ))}
              </div>

              <div className="demo-strip">
                <span className="demo-label">Demos ·</span>
                {Object.keys(DEMOS).map(k=>(
                  <button key={k} className="demo-chip" onClick={()=>{setForm(DEMOS[k]);setInputMode("manual");}}>{k}</button>
                ))}
              </div>

              {/* Upload Mode */}
              {inputMode==="upload" && (
                <div style={{marginBottom:24}}>
                  <div
                    className={`upload-zone ${isDragOver?"drag-over":""}`}
                    onDragOver={e=>{e.preventDefault();setIsDragOver(true);}}
                    onDragLeave={()=>setIsDragOver(false)}
                    onDrop={e=>{e.preventDefault();setIsDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFileUpload(f);}}
                  >
                    <input type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={e=>handleFileUpload(e.target.files[0])}/>
                    <div className="upload-icon">📊</div>
                    <h3>Drop Financial Statement</h3>
                    <p>PDF · Excel · CSV — AI extracts all fields automatically</p>
                    {uploadState.status!=="idle" && (
                      <>
                        <div className="upload-bar-track"><div className="upload-bar-fill" style={{width:uploadState.progress+"%"}}/></div>
                        <div className="upload-status">
                          {uploadState.status==="processing"?"Extracting with AI...":uploadState.status==="done"?`✓ Extracted ${uploadState.extracted?.fieldsExtracted||0} fields (${uploadState.extracted?.confidence||0}% confidence)`:uploadState.status==="error"?"✗ Extraction failed":""}
                        </div>
                      </>
                    )}
                  </div>
                  {uploadState.extracted && (
                    <div className="extracted-preview">
                      <div className="extracted-preview-title">Extracted Financial Data — Review Before Analyzing</div>
                      <div className="extracted-grid">
                        {Object.entries(uploadState.extracted).filter(([k])=>!["confidence","fieldsExtracted"].includes(k)).map(([k,v])=>(
                          <div className="extracted-item" key={k}>
                            <span className="extracted-key">{k}</span>
                            <span className="extracted-val">{typeof v==="number"?v.toLocaleString():String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Mode */}
              {inputMode==="manual" && (
                <>
                  <div className="form-block">
                    <div className="form-block-label">Company Info</div>
                    <div className="form-grid">
                      <div className="field"><label>COMPANY NAME</label><input placeholder="e.g. Acme Pvt Ltd" value={form.companyName} onChange={e=>set("companyName",e.target.value)}/></div>
                      <div className="field"><label>INDUSTRY</label><select value={form.industry} onChange={e=>set("industry",e.target.value)}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
                    </div>
                  </div>
                  <div className="form-block">
                    <div className="form-block-label">Income Statement (₹)</div>
                    <div className="form-grid">
                      <div className="field"><label>REVENUE — CURRENT YEAR</label><input type="number" placeholder="5000000" value={form.revenue} onChange={e=>set("revenue",e.target.value)}/></div>
                      <div className="field"><label>REVENUE — PREVIOUS YEAR</label><input type="number" placeholder="4200000" value={form.prevRevenue} onChange={e=>set("prevRevenue",e.target.value)}/></div>
                      <div className="field"><label>NET PROFIT / LOSS</label><input type="number" placeholder="750000" value={form.netProfit} onChange={e=>set("netProfit",e.target.value)}/></div>
                      <div className="field"><label>OPERATING EXPENSES</label><input type="number" placeholder="3800000" value={form.operatingExpenses} onChange={e=>set("operatingExpenses",e.target.value)}/></div>
                    </div>
                  </div>
                  <div className="form-block">
                    <div className="form-block-label">Balance Sheet (₹)</div>
                    <div className="form-grid">
                      <div className="field"><label>TOTAL ASSETS</label><input type="number" placeholder="8000000" value={form.totalAssets} onChange={e=>set("totalAssets",e.target.value)}/></div>
                      <div className="field"><label>TOTAL LIABILITIES</label><input type="number" placeholder="2400000" value={form.totalLiabilities} onChange={e=>set("totalLiabilities",e.target.value)}/></div>
                      <div className="field"><label>CURRENT ASSETS</label><input type="number" placeholder="3200000" value={form.currentAssets} onChange={e=>set("currentAssets",e.target.value)}/></div>
                      <div className="field"><label>CURRENT LIABILITIES</label><input type="number" placeholder="1500000" value={form.currentLiabilities} onChange={e=>set("currentLiabilities",e.target.value)}/></div>
                      <div className="field"><label>INVENTORY</label><input type="number" placeholder="400000" value={form.inventory} onChange={e=>set("inventory",e.target.value)}/></div>
                    </div>
                  </div>
                </>
              )}

              {/* Multi-year */}
              {inputMode==="multiyear" && (
                <>
                  <div className="form-block">
                    <div className="form-block-label">Company</div>
                    <div className="form-grid">
                      <div className="field"><label>COMPANY NAME</label><input placeholder="Acme Pvt Ltd" value={form.companyName} onChange={e=>set("companyName",e.target.value)}/></div>
                      <div className="field"><label>INDUSTRY</label><select value={form.industry} onChange={e=>set("industry",e.target.value)}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
                    </div>
                  </div>
                  <div className="form-block">
                    <div className="form-block-label">Yearly Data</div>
                    <div className="year-tabs">
                      {yearlyData.map((y,i)=>(
                        <button key={i} className={`year-tab ${activeYear===i?"active":""}`} onClick={()=>setActiveYear(i)}>FY {y.year}</button>
                      ))}
                      <button className="add-year-btn" onClick={addYear}>+ Add Year</button>
                    </div>
                    {yearlyData.map((y,i)=>i!==activeYear?null:(
                      <div key={i} className="form-grid">
                        <div className="field"><label>YEAR</label><input placeholder="2024" value={y.year} onChange={e=>setYearField(i,"year",e.target.value)}/></div>
                        <div className="field"><label>REVENUE</label><input type="number" value={y.revenue} onChange={e=>setYearField(i,"revenue",e.target.value)}/></div>
                        <div className="field"><label>NET PROFIT</label><input type="number" value={y.netProfit} onChange={e=>setYearField(i,"netProfit",e.target.value)}/></div>
                        <div className="field"><label>TOTAL ASSETS</label><input type="number" value={y.totalAssets} onChange={e=>setYearField(i,"totalAssets",e.target.value)}/></div>
                        <div className="field"><label>TOTAL LIABILITIES</label><input type="number" value={y.totalLiabilities} onChange={e=>setYearField(i,"totalLiabilities",e.target.value)}/></div>
                        <div className="field"><label>CURRENT ASSETS</label><input type="number" value={y.currentAssets} onChange={e=>setYearField(i,"currentAssets",e.target.value)}/></div>
                        <div className="field"><label>CURRENT LIABILITIES</label><input type="number" value={y.currentLiabilities} onChange={e=>setYearField(i,"currentLiabilities",e.target.value)}/></div>
                        <div className="field"><label>INVENTORY</label><input type="number" value={y.inventory} onChange={e=>setYearField(i,"inventory",e.target.value)}/></div>
                        <div className="field"><label>OPERATING EXPENSES</label><input type="number" value={y.operatingExpenses} onChange={e=>setYearField(i,"operatingExpenses",e.target.value)}/></div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button className="btn-cta" onClick={analyze} disabled={!canAnalyze}>
                Analyze Financial Health →
              </button>
            </div>
          )}

          {/* ═══════════════════════════════
              LOADING VIEW
          ═══════════════════════════════ */}
          {view==="loading" && (
            <div className="loading-wrap">
              <div className="loader-ring"/>
              <div className="loading-title">Analyzing Financial Data</div>
              <div className="loading-steps">
                {LOADING_STEPS.map((s,i)=>(
                  <div key={i} className={`loading-step ${i<loadingStep?"done":i===loadingStep?"active":""}`}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════
              RESULTS — BENTO GRID
          ═══════════════════════════════ */}
          {view==="result" && result && (
            <div className="results-wrap">

              {/* Top action bar */}
              <div className="results-topbar">
                <button className="btn-back" onClick={()=>setView("form")}>← Back</button>
                <button className="btn-pdf" onClick={downloadPDF} disabled={downloading}>
                  {downloading?"Generating...":"↓ PDF Report"}
                </button>
                <button className="btn-copy" onClick={copySummary}>⧉ Copy Summary</button>
              </div>

              {/* ── Bento Row 1: Score · Altman · Investment ── */}
              <div className="bento-hero">

                {/* Score hero card */}
                <div className={`hero-score-card grade-${result.grade}`} style={{"--grade-color":gColor}}>
                  <div className="score-ring-wrap">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle className="score-ring-track" cx="60" cy="60" r="52"/>
                      <circle className="score-ring-fill" cx="60" cy="60" r="52"
                        stroke={gColor}
                        strokeDasharray={circ}
                        strokeDashoffset={dashOff}
                      />
                    </svg>
                    <div className="score-num">{animScore}<span>/100</span></div>
                  </div>
                  <div className="hero-company">
                    <div className="hero-company-name">{result.companyName||form.companyName||"Company"}</div>
                    <div className={`grade-pill grade-${result.grade}`}>
                      GRADE {result.grade} &nbsp;·&nbsp; {result.riskLevel}
                    </div>
                    <div className="hero-summary">{result.summary}</div>
                  </div>
                </div>

                {/* Altman Z card */}
                <div className="glass-card altman-hero-card">
                  <div className="altman-label">Altman Z'-Score</div>
                  <div className="altman-score" style={{color:result.altman?.zoneColor}}>{result.altman?.Z}</div>
                  <span className="altman-zone" style={{
                    background:result.altman?.zone==="Safe Zone"?"rgba(163,230,53,0.1)":result.altman?.zone==="Grey Zone"?"rgba(251,146,60,0.1)":"rgba(248,113,113,0.1)",
                    color:result.altman?.zoneColor
                  }}>{result.altman?.zone}</span>
                  <div className="altman-spectrum" style={{marginTop:"auto"}}>
                    <div style={{fontFamily:"Geist Mono",fontSize:10,color:"#475569",letterSpacing:"0.08em",marginBottom:6}}>BANKRUPTCY PROBABILITY SPECTRUM</div>
                    <div className="altman-bar">
                      <div className="altman-bar-fill" style={{width:(result.altman?.percent||0)+"%"}}/>
                    </div>
                    <div className="altman-labels">
                      <span style={{color:"#f87171"}}>Distress &lt;1.23</span>
                      <span style={{color:"#fb923c"}}>Grey 1.23–2.9</span>
                      <span style={{color:"#a3e635"}}>Safe &gt;2.9</span>
                    </div>
                    <p style={{fontSize:11,color:"#475569",marginTop:10,lineHeight:1.6,fontFamily:"Inter"}}>{result.bankruptcyRisk}</p>
                  </div>
                </div>

                {/* Investment score card */}
                <div className="glass-card invest-hero-card">
                  <div>
                    <div className="altman-label">Investment Score</div>
                    <div className="invest-score-big" style={{color:result.investScore>=70?"#a3e635":result.investScore>=50?"#2dd4bf":"#fb923c"}}>
                      {result.investScore}
                      <span style={{fontSize:22,color:"#475569",fontWeight:400}}>/100</span>
                    </div>
                  </div>
                  <div>
                    <div className="invest-bar-track">
                      <div className="invest-bar-fill" style={{
                        width:result.investScore+"%",
                        background:result.investScore>=70?"linear-gradient(90deg,#a3e635,#65a30d)":result.investScore>=50?"linear-gradient(90deg,#2dd4bf,#0d9488)":"linear-gradient(90deg,#fb923c,#ea580c)"
                      }}/>
                    </div>
                    <div className="invest-verdict">{result.investmentVerdict||"See full analysis below."}</div>
                    <div style={{marginTop:12}}>
                      <div className={`grade-pill grade-${result.grade}`} style={{fontSize:10}}>
                        {result.investScore>=75?"STRONG BUY":result.investScore>=55?"HOLD":"REVIEW"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Metric tiles ── */}
              <div className="section-divider">Key Metrics</div>
              <div className="bento-metrics">
                {[
                  {label:"Current Ratio", value:result.metrics.currentRatio,    sub:"Liquidity",       bar:result.scores.liquidity},
                  {label:"Quick Ratio",   value:result.metrics.quickRatio,      sub:"Acid Test",       bar:result.scores.quickRatio},
                  {label:"Debt Ratio",    value:result.metrics.debtRatio,       sub:"Leverage",        bar:result.scores.debtHealth},
                  {label:"Net Margin",    value:result.metrics.netProfitMargin, sub:"Profitability",   bar:result.scores.profitability},
                  {label:"Revenue Growth",value:result.metrics.revenueGrowth,   sub:"YoY Change",      bar:result.scores.growth},
                  {label:"Asset Turnover",value:result.metrics.assetTurnover,   sub:"Efficiency",      bar:result.scores.efficiency},
                  {label:"EBITDA Margin", value:result.metrics.ebitdaMargin,    sub:"Operational",     bar:Math.min(100,parseFloat(result.metrics.ebitdaMargin)||0)},
                  {label:"Working Capital",value:result.metrics.workingCapital, sub:"Liquidity Buffer",bar:50},
                  {label:"Monthly Burn",  value:result.metrics.burnRate,        sub:"Burn Rate",       bar:50},
                ].map((m,i)=>{
                  const cc=m.bar>=75?"c-good":m.bar>=50?"c-ok":m.bar>=30?"c-warn":"c-bad";
                  return (
                    <div className="metric-tile" key={i}>
                      <div className="metric-tile-label">{m.label}</div>
                      <div className={`metric-tile-value ${cc}`}>{m.value}</div>
                      <div className="metric-tile-sub">{m.sub}</div>
                      <div className="metric-tile-bar">
                        <div className="metric-tile-bar-fill" style={{width:m.bar+"%",background:barCol(m.bar)}}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Bento Row 2: Radar · Bar · SHAP ── */}
              <div className="section-divider">Score Analysis</div>
              <div className="bento-row2">
                <div className="bento-card" ref={radarRef}>
                  <div className="card-label"><div className="card-label-dot"/>Radar Breakdown</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)"/>
                      <PolarAngleAxis dataKey="subject" tick={{fill:"#475569",fontSize:10,fontFamily:"Geist Mono"}}/>
                      <Radar dataKey="value" stroke={gColor} fill={gColor} fillOpacity={0.1} strokeWidth={1.5}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bento-card" ref={barRef}>
                  <div className="card-label"><div className="card-label-dot" style={{background:"#2dd4bf"}}/>Component Scores</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} barSize={22}>
                      <XAxis dataKey="name" tick={{fill:"#475569",fontSize:10,fontFamily:"Geist Mono"}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:10,fontFamily:"Geist Mono"}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:"rgba(8,8,16,0.95)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,fontFamily:"Geist Mono",fontSize:11}} cursor={{fill:"rgba(255,255,255,0.02)"}}/>
                      <Bar dataKey="score" radius={[3,3,0,0]}>
                        {barData.map((e,i)=><Cell key={i} fill={barCol(e.score)}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bento-card">
                  <div className="card-label"><div className="card-label-dot" style={{background:"#8b5cf6"}}/>SHAP Attribution</div>
                  <div style={{fontSize:11,color:"#475569",marginBottom:12,lineHeight:1.5}}>
                    Score = {result.totalScore}/100. Each bar = contribution relative to baseline of 50.
                  </div>
                  {(result.shapValues||[]).map((sv,i)=>{
                    const isPos=sv.contribution>=0;
                    const bw=Math.abs(sv.contribution)/maxShap*100;
                    return(
                      <div className="shap-row" key={i}>
                        <div className="shap-lbl">{sv.label}</div>
                        <div className="shap-bar-area">
                          <div className="shap-zero-line"/>
                          {isPos
                            ?<div className="shap-bar-pos" style={{width:bw+"%"}}/>
                            :<div className="shap-bar-neg" style={{width:bw+"%"}}/>
                          }
                        </div>
                        <div className="shap-pts" style={{color:isPos?"#a3e635":"#f87171"}}>{isPos?"+":""}{sv.contribution}p</div>
                      </div>
                    );
                  })}
                  <div style={{display:"flex",gap:16,marginTop:12,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                    <span style={{display:"flex",alignItems:"center",gap:5,fontFamily:"Geist Mono",fontSize:9,color:"#475569"}}>
                      <span style={{width:8,height:8,borderRadius:2,background:"#a3e635",display:"inline-block"}}/>Positive
                    </span>
                    <span style={{display:"flex",alignItems:"center",gap:5,fontFamily:"Geist Mono",fontSize:9,color:"#475569"}}>
                      <span style={{width:8,height:8,borderRadius:2,background:"#f87171",display:"inline-block"}}/>Negative
                    </span>
                  </div>
                </div>
              </div>

              {/* ── AI Insights + Benchmark ── */}
              <div className="section-divider">AI Insights & Benchmarking</div>
              <div className="bento-row2">
                <div className="bento-card span2">
                  <div className="groq-badge"><div className="groq-dot"/>GROQ LLAMA 3.3 70B · LIVE ANALYSIS</div>
                  <div className="card-label"><div className="card-label-dot" style={{background:"#2dd4bf"}}/>Explainable Insights</div>
                  {(result.insights||[]).map((ins,i)=>(
                    <div className="insight-row" key={i}>
                      <div className="insight-indicator" style={{background:typeCol(ins.type)}}/>
                      <div>
                        <div className="insight-title" style={{color:typeCol(ins.type)}}>{ins.title}</div>
                        <div className="insight-text">{ins.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bento-card">
                  <div className="card-label"><div className="card-label-dot" style={{background:"#fb923c"}}/>Industry Benchmark</div>
                  <div style={{fontSize:11,color:"#475569",marginBottom:14}}>vs {result.industry||form.industry} averages</div>
                  <BenchmarkSection benchmarks={result.benchmarks} industry={result.industry||form.industry}/>
                </div>
              </div>

              {/* ── Forecast ── */}
              {result.forecastData?.length>0 && (
                <>
                  <div className="section-divider">12-Month Forecast</div>
                  <div className="bento-card span3" style={{padding:24,marginBottom:14}}>
                    <div className="card-label"><div className="card-label-dot" style={{background:"#fb923c"}}/>Financial Health Trajectory</div>
                    <div style={{fontSize:11,color:"#475569",marginBottom:16}}>Historical + Groq-projected scores with widening confidence bands</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={result.forecastData} margin={{top:10,right:10,left:-20,bottom:0}}>
                        <defs>
                          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.12}/>
                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="period" tick={{fill:"#475569",fontSize:10,fontFamily:"Geist Mono"}} axisLine={false} tickLine={false}/>
                        <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:10,fontFamily:"Geist Mono"}} axisLine={false} tickLine={false}/>
                        <Tooltip contentStyle={{background:"rgba(8,8,16,0.95)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,fontFamily:"Geist Mono",fontSize:11}}/>
                        <ReferenceLine y={65} stroke="#2dd4bf" strokeDasharray="4 4" strokeOpacity={0.3}/>
                        <ReferenceLine y={45} stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.25}/>
                        <Area type="monotone" dataKey="confidence_hi" stroke="none" fill="url(#cg)"/>
                        <Area type="monotone" dataKey="confidence_lo" stroke="none" fill="transparent"/>
                        <Line type="monotone" dataKey="score" stroke={gColor} strokeWidth={2}
                          dot={(p)=>{
                            const{cx,cy,payload,index}=p;
                            return payload.type==="forecast"
                              ?<circle key={index} cx={cx} cy={cy} r={3} fill="#fb923c" stroke="#030303" strokeWidth={1.5}/>
                              :<circle key={index} cx={cx} cy={cy} r={4} fill={gColor} stroke="#030303" strokeWidth={1.5}/>;
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="forecast-note">
                      <span style={{color:gColor}}>● Historical</span>
                      <span>● <span>Groq Forecasted</span></span>
                      <span style={{opacity:0.5}}>Shaded = confidence band</span>
                    </div>
                  </div>
                </>
              )}

              {/* ── Recommendations ── */}
              {result.recommendations?.length>0 && (
                <>
                  <div className="section-divider">Actionable Recommendations</div>
                  <div className="bento-card" style={{padding:24,marginBottom:14}}>
                    <div className="card-label"><div className="card-label-dot" style={{background:"#f87171"}}/>Priority Actions</div>
                    <RecommendationsSection recommendations={result.recommendations}/>
                  </div>
                </>
              )}

              {/* ── Scenario Simulator ── */}
              <div className="section-divider">Scenario Simulator</div>
              <SimulationSection originalResult={result} originalForm={activeForm}/>

            </div>
          )}

        </div>{/* /page-wrap */}

        {/* ═══════════════════════════════
            FLOATING CHAT
        ═══════════════════════════════ */}
        {view==="result" && result && (
          <>
            <ChatWidget analysisContext={analysisCtx} visible={chatOpen} onClose={()=>setChatOpen(false)}/>
            <button className="chat-fab" onClick={()=>setChatOpen(o=>!o)} title="Chat with your data">
              {chatOpen?"✕":"💬"}
            </button>
          </>
        )}

        {/* ═══════════════════════════════
            MOBILE BOTTOM NAV
        ═══════════════════════════════ */}
        {view==="result" && (
          <nav className="mobile-nav">
            <button className="mobile-nav-btn" onClick={()=>setView("form")}>
              <span className="mobile-nav-icon">←</span>
              <span className="mobile-nav-label">BACK</span>
            </button>
            <button className="mobile-nav-btn" onClick={downloadPDF} disabled={downloading}>
              <span className="mobile-nav-icon">↓</span>
              <span className="mobile-nav-label">PDF</span>
            </button>
            <button className="mobile-nav-btn" onClick={copySummary}>
              <span className="mobile-nav-icon">⧉</span>
              <span className="mobile-nav-label">COPY</span>
            </button>
            <button className="mobile-nav-btn" onClick={()=>setChatOpen(o=>!o)}>
              <span className="mobile-nav-icon">💬</span>
              <span className="mobile-nav-label">AI CHAT</span>
            </button>
          </nav>
        )}

        {/* Copy toast */}
        <div className={`copy-toast ${copyToast?"show":""}`}>✓ Summary copied to clipboard</div>

      </div>{/* /app */}
    </>
  );
}