// =============================================================================
//  LoadingScreen — Midnight Aurora Theme
//  FIX: loading-step text was var(--text4) = #334155, invisible on dark bg
// =============================================================================

import { LOADING_STEPS } from "../utils/constants.js";

const loadingStyles = `
  .loading-wrap {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 28px;
  }

  .loader-ring {
    width: 60px; height: 60px; border-radius: 50%;
    border: 2px solid rgba(0,212,200,0.12);
    border-top-color: #00d4c8;
    box-shadow: 0 0 20px rgba(0,212,200,0.15);
    animation: spin 0.9s linear infinite;
  }

  /* FIX: explicit color for loading title */
  .loading-title {
    font-family: var(--font-mono); font-size: 12px;
    color: #a0bfd0;
    letter-spacing: 0.12em; text-transform: uppercase;
  }

  .loading-steps {
    display: flex; flex-direction: column;
    gap: 8px; align-items: flex-start;
  }

  /* FIX: was var(--text4) = #334155 — nearly invisible on #060b14 background
     Now using #4a6b82 which is readable */
  .loading-step {
    font-family: var(--font-mono); font-size: 11px;
    color: #4a6b82;
    letter-spacing: 0.05em;
    transition: color 0.4s;
    display: flex; align-items: center; gap: 10px;
  }

  .loading-step::before { content: '○'; font-size: 10px; }

  /* Active step — bright teal */
  .loading-step.active { color: #00d4c8; }
  .loading-step.active::before { content: '◉'; color: #00d4c8; }

  /* Done step — mint green */
  .loading-step.done { color: #34d399; }
  .loading-step.done::before { content: '✓'; color: #34d399; }
`;

export default function LoadingScreen({ loadingStep }) {
  return (
    <>
      <style>{loadingStyles}</style>
      <div className="loading-wrap">
        <div className="loader-ring"/>
        <div className="loading-title">Analyzing Financial Data</div>
        <div className="loading-steps">
          {LOADING_STEPS.map((s,i) => (
            <div key={i} className={`loading-step ${i<loadingStep?"done":i===loadingStep?"active":""}`}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
