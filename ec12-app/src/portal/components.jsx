// AIdvancing — shared components
// Loaded after react/babel; exports to window for cross-script visibility.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// =================================================================
// Theme controller — shared across views
// =================================================================
function applyAppTheme(t) {
  const r = document.documentElement.style;
  if (t.accentTeal) r.setProperty('--teal', t.accentTeal);
  if (t.accentLime) r.setProperty('--lime', t.accentLime);
  if (t.accentBlue) r.setProperty('--blue', t.accentBlue);

  const blobs = document.querySelector('.blobs');
  if (blobs) {
    blobs.style.opacity = String((t.blobIntensity || 42) / 100);
    blobs.querySelectorAll('.blob').forEach(b => {
      b.style.animationPlayState = t.blobMotion === false ? 'paused' : 'running';
    });
  }

  if (t.darkMode) {
    r.setProperty('--bg', '#0d0d0c');
    r.setProperty('--bg-soft', '#171715');
    r.setProperty('--paper', '#1c1c1a');
    r.setProperty('--ink', '#f5f3ee');
    r.setProperty('--ink-2', '#e3e0d8');
    r.setProperty('--ink-3', '#b8b4ab');
    r.setProperty('--ink-4', '#7a766f');
    r.setProperty('--ink-5', '#4a4844');
    r.setProperty('--line', 'rgba(255,255,255,0.08)');
    r.setProperty('--line-2', 'rgba(255,255,255,0.14)');
  } else {
    ['--bg','--bg-soft','--paper','--ink','--ink-2','--ink-3','--ink-4','--ink-5','--line','--line-2']
      .forEach(k => r.removeProperty(k));
  }
}

// =================================================================
// Blobs background — one component for every page
// =================================================================
function Blobs() {
  return (
    <div className="blobs">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>
    </div>
  );
}

// =================================================================
// Top nav
// =================================================================
function TopNav({ active, onNav, t }) {
  const links = [
    { id: 'tracker',   label: t('nav.tracker') },
    { id: 'email',     label: t('nav.email') },
    { id: 'arrivals',  label: t('nav.arrivals') },
    { id: 'itinerary', label: t('nav.itinerary') },
    { id: 'settings',  label: t('nav.settings') },
  ];
  return (
    <nav className="nav">
      <div className="brand" onClick={() => onNav('tracker')}>
        <span className="brand-dot"></span>
        {t('app.brand')}
      </div>
      <div className="nav-links">
        {links.map(l => (
          <a key={l.id}
             className={active === l.id ? 'active' : ''}
             onClick={() => onNav(l.id)}>{l.label}</a>
        ))}
      </div>
      <div className="nav-spacer"></div>
      <div className="nav-meta">
        <div className="nav-pill"><span className="nav-pill-dot"></span> {t('nav.synced')}</div>
        <div className="avatar">MP</div>
      </div>
    </nav>
  );
}

// =================================================================
// Footer
// =================================================================
function PageFoot({ t }) {
  return (
    <footer className="foot">
      <span>{t('foot.l')}</span>
      <span>{t('foot.r')}</span>
    </footer>
  );
}

// =================================================================
// Status helpers — render a Monday field as a small chip
// =================================================================
const STATUS_META = {
  confirmed: { cls: 'b-go',   key: 'common.confirmed' },
  partial:   { cls: 'b-info', key: 'common.partial' },
  pending:   { cls: 'b-warn', key: 'common.pending' },
  needed:    { cls: 'b-stop', key: 'common.needed' },
  idle:      { cls: 'b-idle', key: 'common.idle' },
  blocked:   { cls: 'b-stop', key: 'common.blocked' },
};

function StatusBadge({ status, t }) {
  const m = STATUS_META[status] || STATUS_META.idle;
  return <span className={'badge ' + m.cls}>{t(m.key)}</span>;
}

function StatusDot({ status }) {
  const m = STATUS_META[status] || STATUS_META.idle;
  const cls = m.cls === 'b-go' ? 'dot-go' : m.cls === 'b-warn' ? 'dot-warn' : m.cls === 'b-stop' ? 'dot-stop' : 'dot-idle';
  return <span className={'dot ' + cls}></span>;
}

// Steps progress bar (8 segments)
function StepsBar({ statuses }) {
  return (
    <div style={{display:'flex',gap:3,height:5}}>
      {statuses.map((s, i) => {
        const cls = s === 'confirmed' ? 'step-done' : s === 'partial' || s === 'pending' ? 'step-active' : s === 'needed' || s === 'blocked' ? 'step-warn' : 'step-idle';
        const bg = cls === 'step-done' ? 'var(--teal)'
                : cls === 'step-active' ? 'var(--amber)'
                : cls === 'step-warn' ? 'var(--st-stop)'
                : 'rgba(10,10,10,0.10)';
        return <div key={i} style={{flex:1,borderRadius:100,background:bg}}></div>;
      })}
    </div>
  );
}

function progressOf(statuses) {
  const done = statuses.filter(s => s === 'confirmed').length;
  return { done, total: statuses.length, pct: Math.round(100 * done / statuses.length) };
}

// =================================================================
// Stage chip with color dot
// =================================================================
function StageChip({ stageId }) {
  const stage = window.STAGES.find(s => s.id === stageId);
  if (!stage) return null;
  return <span className="dt-stage" style={{['--c']: stage.color}}>{stage.name}</span>;
}

// =================================================================
// Page hero — eyebrow + huge title + sub
// =================================================================
function PageHero({ eyebrow, title, sub, right }) {
  return (
    <header className="page-head">
      <div>
        <div className="page-eyebrow"><span className="page-eyebrow-line"></span> {eyebrow}</div>
        <h1 className="page-title" dangerouslySetInnerHTML={{__html: title}}></h1>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:18,minWidth:280}}>
        {sub && <div className="page-sub" style={{textAlign:'right'}}>{sub}</div>}
        {right}
      </div>
    </header>
  );
}

// =================================================================
// Stat strip
// =================================================================
function StatStrip({ stats }) {
  return (
    <div className="stat-strip">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}{s.unit && <span className="unit">{s.unit}</span>}</div>
          {s.trend && <div className={'stat-trend ' + (s.trendVariant || '')}>{s.trend}</div>}
        </div>
      ))}
    </div>
  );
}

// Export to window
Object.assign(window, {
  applyAppTheme, Blobs, TopNav, PageFoot,
  StatusBadge, StatusDot, StepsBar, progressOf,
  StageChip, PageHero, StatStrip,
});
