// =============================================================================
//  Header — Midnight Aurora Theme
//  FIX: all text colors explicit, no inheritance from dark bg
// =============================================================================

const headerStyles = `
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    position: sticky; top: 0; z-index: 100;
    background: rgba(6,11,20,0.88);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(0,212,200,0.12);
    margin: 0 -24px;
    padding-left: 24px; padding-right: 24px;
  }

  .logo { display: flex; align-items: center; gap: 12px; }

  .logo-mark {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #00d4c8 0%, #0891b2 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 13px; font-weight: 600;
    color: #060b14;
    box-shadow: 0 0 24px rgba(0,212,200,0.35);
    flex-shrink: 0;
  }

  /* FIX: explicit color, not relying on body inheritance */
  .logo-name {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 900;
    color: #e8f4f8;
    letter-spacing: -0.025em;
    line-height: 1;
  }

  .logo-name em { color: #00d4c8; font-style: normal; }

  /* FIX: text3 was too dark (#475569) — now using readable value */
  .logo-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    color: #5e8a9f;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 3px;
  }

  .header-right { display: flex; align-items: center; gap: 10px; }

  /* FIX: status pill text always explicit color */
  .status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.07em; border: 1px solid;
  }

  .status-pill.ok {
    background: rgba(0,212,200,0.08);
    border-color: rgba(0,212,200,0.25);
    color: #00d4c8;
  }

  .status-pill.err {
    background: rgba(251,113,133,0.08);
    border-color: rgba(251,113,133,0.25);
    color: #fb7185;
  }

  .status-pill.checking {
    background: rgba(160,191,208,0.06);
    border-color: rgba(160,191,208,0.15);
    color: #a0bfd0;
  }

  .status-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: currentColor;
    animation: blink 2s infinite;
  }
`;

export default function Header({ apiStatus }) {
  return (
    <>
      <style>{headerStyles}</style>
      <header className="header">
        <div className="logo">
          <div className="logo-mark">FS</div>
          <div>
            <div className="logo-name">Fin<em>Sight</em></div>
            <div className="logo-tag">SME Financial Intelligence · v4</div>
          </div>
        </div>
        <div className="header-right">
          <div className={`status-pill ${apiStatus}`}>
            <div className="status-dot"/>
            {apiStatus==="ok" ? "BACKEND CONNECTED" : apiStatus==="err" ? "BACKEND OFFLINE" : "CHECKING..."}
          </div>
        </div>
      </header>
    </>
  );
}
