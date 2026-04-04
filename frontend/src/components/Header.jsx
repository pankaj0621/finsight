// =============================================================================
//  Header Component
// =============================================================================

const headerStyles = `
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(12,14,20,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
  }

  .logo { display: flex; align-items: center; gap: 12px; }

  .logo-mark {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 14px; font-weight: 600;
    color: #0c0e14;
    box-shadow: 0 0 20px rgba(245,158,11,0.3);
    flex-shrink: 0;
  }

  .logo-name {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .logo-name em { color: var(--amber); font-style: normal; }

  .logo-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .header-right { display: flex; align-items: center; gap: 10px; }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 20px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.07em;
    border: 1px solid;
  }

  .status-pill.ok {
    background: rgba(245,158,11,0.08);
    border-color: rgba(245,158,11,0.25);
    color: var(--amber);
  }

  .status-pill.err {
    background: rgba(244,63,94,0.08);
    border-color: rgba(244,63,94,0.25);
    color: var(--rose);
  }

  .status-pill.checking {
    background: rgba(148,163,184,0.08);
    border-color: rgba(148,163,184,0.2);
    color: var(--text3);
  }

  .status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: blink 2s infinite;
  }

  /* Mobile Responsive Navbar Fix */
  @media (max-width: 600px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 0; /* Horizontal padding hata diya */
      margin: 0; /* Negative margin hata diya taaki bahar na jaye */
    }
    .header-right {
      width: 100%;
    }
    .status-pill {
      width: 100%;
      justify-content: center; /* Text ko center mein laane ke liye */
    }
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
            <div className="logo-tag">SME Financial Analytics v4</div>
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
