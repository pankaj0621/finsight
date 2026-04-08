// =============================================================================
//  AnalysisForm — Midnight Aurora Theme
//  FIXES:
//  1. hero-tag color: var(--text3) was #475569 = unreadable → now #a0bfd0
//  2. hero h2 em gradient text — added fallback color for Safari
//  3. placeholder color fixed (was var(--text4) = too dark)
//  4. select option bg fixed for dark theme
// =============================================================================

import { DEMOS, INDUSTRIES, API_BASE } from "../utils/constants.js";

const formStyles = `
  /* ── Hero ── */
  .hero { padding: 64px 0 44px; text-align: center; }

  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,212,200,0.08);
    border: 1px solid rgba(0,212,200,0.2);
    border-radius: 20px; padding: 5px 16px;
    font-family: var(--font-mono); font-size: 11px;
    color: #00d4c8;
    letter-spacing: 0.06em; margin-bottom: 26px;
  }

  /* FIX: explicit color for heading */
  .hero h2 {
    font-family: var(--font-display);
    font-size: clamp(30px, 5vw, 56px);
    font-weight: 900; line-height: 1.06;
    letter-spacing: -0.03em;
    color: #e8f4f8;
    margin-bottom: 18px;
  }

  /* FIX: gradient text with explicit fallback color for browsers that
     don't support -webkit-background-clip: text */
  .hero h2 em {
    font-style: normal;
    color: #00d4c8; /* fallback — always visible */
    background: linear-gradient(135deg, #00d4c8 0%, #a78bfa 60%, #ff6b6b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    /* Safety: if background-clip fails, color fallback shows */
    -webkit-text-fill-color: transparent;
  }

  /* FIX: hero-sub was defaulting to body color sometimes */
  .hero-sub {
    font-size: 15px; color: #a0bfd0;
    max-width: 540px; margin: 0 auto; line-height: 1.75;
  }

  .hero-tags {
    display: flex; flex-wrap: wrap;
    gap: 8px; justify-content: center;
    margin-top: 22px;
  }

  /* FIX: was var(--text3) = #475569 — barely visible on dark bg
     Now explicitly #a0bfd0 which is readable */
  .hero-tag {
    padding: 4px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,212,200,0.12);
    border-radius: 20px;
    font-family: var(--font-mono); font-size: 10px;
    color: #a0bfd0;
    letter-spacing: 0.05em;
    transition: all 0.2s;
  }

  .hero-tag:hover {
    background: rgba(0,212,200,0.06);
    border-color: rgba(0,212,200,0.25);
    color: #00d4c8;
  }

  /* ── Mode tabs ── */
  .mode-tabs {
    display: flex; gap: 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(0,212,200,0.1);
    border-radius: var(--r-sm); padding: 4px;
    margin-bottom: 22px; width: fit-content;
  }

  .mode-tab {
    padding: 8px 18px; border-radius: 7px;
    font-family: var(--font-mono); font-size: 11px;
    color: #a0bfd0;
    background: none; border: none;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.05em;
  }

  .mode-tab:hover { color: #e8f4f8; }

  /* FIX: active tab text color explicitly dark (it's on teal bg) */
  .mode-tab.active {
    background: #00d4c8;
    color: #060b14;
    font-weight: 700;
    box-shadow: 0 0 20px rgba(0,212,200,0.3);
  }

  /* ── Demo strip ── */
  .demo-strip {
    display: flex; gap: 8px;
    margin-bottom: 22px; align-items: center; flex-wrap: wrap;
  }

  /* FIX: explicit readable color */
  .demo-label {
    font-family: var(--font-mono); font-size: 10px;
    color: #5e8a9f; letter-spacing: 0.08em;
  }

  .demo-chip {
    padding: 5px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,212,200,0.12);
    border-radius: 20px;
    font-family: var(--font-mono); font-size: 11px;
    color: #a0bfd0;
    cursor: pointer; transition: all 0.2s;
  }

  .demo-chip:hover {
    background: rgba(0,212,200,0.08);
    border-color: rgba(0,212,200,0.3);
    color: #00d4c8;
  }

  /* ── Form blocks ── */
  .form-block { margin-bottom: 22px; }

  .form-block-label {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); font-size: 10px;
    color: #00d4c8;
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-bottom: 14px;
  }

  .form-block-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(0,212,200,0.25) 0%, transparent 100%);
  }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } }

  .field { display: flex; flex-direction: column; gap: 6px; }

  /* FIX: explicit color for labels */
  .field label {
    font-family: var(--font-mono); font-size: 10px;
    color: #5e8a9f;
    letter-spacing: 0.07em; text-transform: uppercase;
  }

  /* FIX: explicit color for inputs — never inherit */
  .field input, .field select {
    background: rgba(14,22,40,0.8);
    border: 1px solid rgba(0,212,200,0.1);
    color: #e8f4f8;
    padding: 11px 14px; border-radius: var(--r-sm);
    font-family: var(--font-mono); font-size: 13px;
    outline: none; transition: all 0.2s;
    -webkit-appearance: none;
  }

  .field input:focus, .field select:focus {
    border-color: rgba(0,212,200,0.4);
    background: rgba(0,212,200,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,200,0.07);
  }

  /* FIX: placeholder color was var(--text4) = #334155, invisible
     Now using #3d6275 which is subtly visible */
  .field input::placeholder { color: #3d6275; opacity: 1; }

  /* FIX: select option must have explicit dark bg + light text */
  .field select option {
    background: #0a1120;
    color: #e8f4f8;
  }

  /* FIX: select arrow visibility on dark bg */
  .field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235e8a9f' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  /* ── CTA Button ── */
  .btn-cta {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #00d4c8 0%, #0891b2 100%);
    color: #060b14;
    border: none; border-radius: var(--r-sm);
    font-family: var(--font-display);
    font-size: 15px; font-weight: 800;
    cursor: pointer; letter-spacing: 0.01em;
    transition: all 0.25s; margin-top: 8px;
    box-shadow: 0 0 32px rgba(0,212,200,0.28);
  }

  .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(0,212,200,0.38); }
  .btn-cta:active { transform: translateY(0); }
  .btn-cta:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── Error ── */
  .error-pill {
    background: rgba(251,113,133,0.08);
    border: 1px solid rgba(251,113,133,0.22);
    border-radius: var(--r-sm); padding: 12px 16px;
    font-family: var(--font-mono); font-size: 12px;
    color: #fb7185;
    margin-bottom: 20px;
  }

  /* ── Upload Zone ── */
  .upload-zone {
    border: 2px dashed rgba(0,212,200,0.15);
    border-radius: var(--r); padding: 60px 40px;
    text-align: center; cursor: pointer;
    transition: all 0.3s; position: relative;
    overflow: hidden;
    background: rgba(0,212,200,0.02);
    margin-bottom: 20px;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: rgba(0,212,200,0.4);
    background: rgba(0,212,200,0.04);
  }

  .upload-zone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer;
    width: 100%; height: 100%;
  }

  .upload-icon { font-size: 44px; margin-bottom: 16px; }

  /* FIX: explicit heading color */
  .upload-zone h3 {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 700;
    margin-bottom: 8px; color: #e8f4f8;
  }

  /* FIX: explicit p color */
  .upload-zone p { color: #a0bfd0; font-size: 14px; }

  .upload-bar-track {
    height: 2px; background: rgba(0,212,200,0.1);
    border-radius: 1px; overflow: hidden; margin: 20px 0 8px;
  }

  .upload-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d4c8, #a78bfa);
    border-radius: 1px; transition: width 0.3s;
  }

  /* FIX: explicit status text color */
  .upload-status {
    font-family: var(--font-mono); font-size: 11px;
    color: #a0bfd0;
  }

  .extracted-preview {
    background: rgba(14,22,40,0.6);
    border: 1px solid rgba(0,212,200,0.12);
    border-radius: var(--r-sm); padding: 18px;
    margin-top: 14px; text-align: left;
  }

  .extracted-title {
    font-family: var(--font-mono); font-size: 10px;
    color: #00d4c8;
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 12px;
  }

  .extracted-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }

  .extracted-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 0; border-bottom: 1px solid rgba(0,212,200,0.07);
    font-size: 12px;
  }

  .extracted-item:last-child { border-bottom: none; }
  .extracted-key { color: #5e8a9f; font-family: var(--font-mono); font-size: 10px; }
  .extracted-val { color: #00d4c8; font-family: var(--font-mono); font-size: 11px; font-weight: 500; }

  /* ── Year tabs ── */
  .year-tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }

  .year-tab {
    padding: 6px 14px;
    background: rgba(14,22,40,0.8);
    border: 1px solid rgba(0,212,200,0.1);
    border-radius: 20px; font-family: var(--font-mono); font-size: 11px;
    color: #a0bfd0;
    cursor: pointer; transition: all 0.2s;
  }

  .year-tab.active {
    background: rgba(0,212,200,0.1);
    border-color: rgba(0,212,200,0.35);
    color: #00d4c8;
  }

  .add-year-btn {
    padding: 6px 14px; background: none;
    border: 1px dashed rgba(0,212,200,0.15);
    border-radius: 20px; font-family: var(--font-mono); font-size: 11px;
    color: #5e8a9f;
    cursor: pointer; transition: all 0.2s;
  }

  .add-year-btn:hover { border-color: #00d4c8; color: #00d4c8; }

  .form-wrap { padding-bottom: 80px; }
`;

export default function AnalysisForm({
  inputMode, setInputMode, form, setForm,
  yearlyData, setYearlyData, activeYear, setActiveYear,
  uploadState, setUploadState, isDragOver, setIsDragOver,
  error, canAnalyze, onAnalyze, setError,
}) {
  const set          = (k,v) => setForm(f => ({...f,[k]:v}));
  const setYearField = (idx,k,v) => setYearlyData(p => p.map((y,i) => i===idx ? {...y,[k]:v} : y));

  const addYear = () => {
    const last = yearlyData[yearlyData.length-1];
    const ni   = yearlyData.length;
    setYearlyData(p => [...p,{year:String((parseInt(last.year)||2024)+1),revenue:"",netProfit:"",totalAssets:"",totalLiabilities:"",currentAssets:"",currentLiabilities:"1",inventory:"",operatingExpenses:""}]);
    setActiveYear(ni);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadState({status:"processing",progress:10,extracted:null});
    const tick = setInterval(() => setUploadState(p => ({...p,progress:Math.min(88,p.progress+14)})),200);
    try {
      const fd  = new FormData(); fd.append("file",file);
      const res = await fetch(`${API_BASE}/api/extract-document`,{method:"POST",body:fd});
      const data = await res.json();
      clearInterval(tick);
      if (!res.ok) throw new Error(data.detail||"Extraction failed");
      setUploadState({status:"done",progress:100,extracted:data.data});
      setForm(f => ({...f,...data.data}));
    } catch(e) {
      clearInterval(tick);
      setUploadState({status:"error",progress:0,extracted:null});
      setError(`Extraction failed: ${e.message}`);
    }
  };

  return (
    <>
      <style>{formStyles}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">⬡ Powered by Groq LLaMA 3.3 70B</div>
        <h2>AI-Powered Financial<br/><em>Health Scoring</em> for SMEs</h2>
        <p className="hero-sub">Upload financial statements or enter data manually. Get instant AI insights, Altman Z-Score, SHAP explainability & 12-month forecasting.</p>
        <div className="hero-tags">
          {["Altman Z-Score","SHAP Explainability","Industry Benchmarks","Scenario Simulation","12-Month Forecast","AI Chat"].map(t=>(
            <span className="hero-tag" key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="form-wrap">
        {error && <div className="error-pill">⚠ {error}</div>}

        {/* Mode tabs */}
        <div className="mode-tabs">
          {[["manual","Manual Entry"],["upload","Upload Doc"],["multiyear","Multi-Year"]].map(([m,l]) => (
            <button key={m} className={`mode-tab ${inputMode===m?"active":""}`} onClick={() => setInputMode(m)}>{l}</button>
          ))}
        </div>

        {/* Demo strip */}
        <div className="demo-strip">
          <span className="demo-label">Try demo:</span>
          {Object.keys(DEMOS).map(k => (
            <button key={k} className="demo-chip" onClick={() => { setForm(DEMOS[k]); setInputMode("manual"); }}>{k}</button>
          ))}
        </div>

        {/* ── Upload Mode ── */}
        {inputMode==="upload" && (
          <>
            <div
              className={`upload-zone ${isDragOver?"drag-over":""}`}
              onDragOver={e=>{e.preventDefault();setIsDragOver(true);}}
              onDragLeave={()=>setIsDragOver(false)}
              onDrop={e=>{e.preventDefault();setIsDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFileUpload(f);}}
            >
              <input type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={e=>handleFileUpload(e.target.files[0])}/>
              <div className="upload-icon">📄</div>
              <h3>Upload Financial Statement</h3>
              <p>PDF, Excel, or CSV — AI extracts data automatically</p>
              {uploadState.status!=="idle" && (
                <div style={{marginTop:20}}>
                  <div className="upload-bar-track"><div className="upload-bar-fill" style={{width:uploadState.progress+"%"}}/></div>
                  <div className="upload-status">
                    {uploadState.status==="processing" ? "Extracting with AI..." :
                     uploadState.status==="done"        ? `✓ Extracted ${uploadState.extracted?.fieldsExtracted||0} fields (${uploadState.extracted?.confidence||0}% confidence)` :
                     uploadState.status==="error"       ? "✗ Extraction failed" : ""}
                  </div>
                </div>
              )}
            </div>
            {uploadState.extracted && (
              <div className="extracted-preview">
                <div className="extracted-title">Extracted Data — Review Before Analyzing</div>
                <div className="extracted-grid">
                  {Object.entries(uploadState.extracted)
                    .filter(([k]) => !["confidence","fieldsExtracted"].includes(k))
                    .map(([k,v]) => (
                      <div className="extracted-item" key={k}>
                        <span className="extracted-key">{k}</span>
                        <span className="extracted-val">{typeof v==="number" ? v.toLocaleString() : String(v)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Manual Mode ── */}
        {inputMode==="manual" && (
          <>
            <div className="form-block">
              <div className="form-block-label">Company Info</div>
              <div className="form-grid">
                <div className="field"><label>Company Name</label><input placeholder="e.g. Acme Pvt Ltd" value={form.companyName} onChange={e=>set("companyName",e.target.value)}/></div>
                <div className="field"><label>Industry</label><select value={form.industry} onChange={e=>set("industry",e.target.value)}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
              </div>
            </div>
            <div className="form-block">
              <div className="form-block-label">Income Statement (₹)</div>
              <div className="form-grid">
                <div className="field"><label>Revenue (Current Year)</label><input type="number" placeholder="5000000" value={form.revenue} onChange={e=>set("revenue",e.target.value)}/></div>
                <div className="field"><label>Revenue (Previous Year)</label><input type="number" placeholder="4200000" value={form.prevRevenue} onChange={e=>set("prevRevenue",e.target.value)}/></div>
                <div className="field"><label>Net Profit / Loss</label><input type="number" placeholder="750000" value={form.netProfit} onChange={e=>set("netProfit",e.target.value)}/></div>
                <div className="field"><label>Operating Expenses</label><input type="number" placeholder="3800000" value={form.operatingExpenses} onChange={e=>set("operatingExpenses",e.target.value)}/></div>
              </div>
            </div>
            <div className="form-block">
              <div className="form-block-label">Balance Sheet (₹)</div>
              <div className="form-grid">
                <div className="field"><label>Total Assets</label><input type="number" placeholder="8000000" value={form.totalAssets} onChange={e=>set("totalAssets",e.target.value)}/></div>
                <div className="field"><label>Total Liabilities</label><input type="number" placeholder="2400000" value={form.totalLiabilities} onChange={e=>set("totalLiabilities",e.target.value)}/></div>
                <div className="field"><label>Current Assets</label><input type="number" placeholder="3200000" value={form.currentAssets} onChange={e=>set("currentAssets",e.target.value)}/></div>
                <div className="field"><label>Current Liabilities</label><input type="number" placeholder="1500000" value={form.currentLiabilities} onChange={e=>set("currentLiabilities",e.target.value)}/></div>
                <div className="field"><label>Inventory</label><input type="number" placeholder="400000" value={form.inventory} onChange={e=>set("inventory",e.target.value)}/></div>
              </div>
            </div>
          </>
        )}

        {/* ── Multi-year Mode ── */}
        {inputMode==="multiyear" && (
          <>
            <div className="form-block">
              <div className="form-block-label">Company Info</div>
              <div className="form-grid">
                <div className="field"><label>Company Name</label><input placeholder="Acme Pvt Ltd" value={form.companyName} onChange={e=>set("companyName",e.target.value)}/></div>
                <div className="field"><label>Industry</label><select value={form.industry} onChange={e=>set("industry",e.target.value)}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
              </div>
            </div>
            <div className="form-block">
              <div className="form-block-label">Yearly Data</div>
              <div className="year-tabs">
                {yearlyData.map((y,i) => (
                  <button key={i} className={`year-tab ${activeYear===i?"active":""}`} onClick={() => setActiveYear(i)}>FY {y.year}</button>
                ))}
                <button className="add-year-btn" onClick={addYear}>+ Add Year</button>
              </div>
              {yearlyData.map((y,i) => i!==activeYear ? null : (
                <div className="form-grid" key={i}>
                  <div className="field"><label>Year</label><input placeholder="2024" value={y.year} onChange={e=>setYearField(i,"year",e.target.value)}/></div>
                  <div className="field"><label>Revenue</label><input type="number" value={y.revenue} onChange={e=>setYearField(i,"revenue",e.target.value)}/></div>
                  <div className="field"><label>Net Profit</label><input type="number" value={y.netProfit} onChange={e=>setYearField(i,"netProfit",e.target.value)}/></div>
                  <div className="field"><label>Total Assets</label><input type="number" value={y.totalAssets} onChange={e=>setYearField(i,"totalAssets",e.target.value)}/></div>
                  <div className="field"><label>Total Liabilities</label><input type="number" value={y.totalLiabilities} onChange={e=>setYearField(i,"totalLiabilities",e.target.value)}/></div>
                  <div className="field"><label>Current Assets</label><input type="number" value={y.currentAssets} onChange={e=>setYearField(i,"currentAssets",e.target.value)}/></div>
                  <div className="field"><label>Current Liabilities</label><input type="number" value={y.currentLiabilities} onChange={e=>setYearField(i,"currentLiabilities",e.target.value)}/></div>
                  <div className="field"><label>Inventory</label><input type="number" value={y.inventory} onChange={e=>setYearField(i,"inventory",e.target.value)}/></div>
                  <div className="field"><label>Operating Expenses</label><input type="number" value={y.operatingExpenses} onChange={e=>setYearField(i,"operatingExpenses",e.target.value)}/></div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="btn-cta" onClick={onAnalyze} disabled={!canAnalyze}>
          Analyze Financial Health →
        </button>
      </div>
    </>
  );
}
