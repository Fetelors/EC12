// AIdvancing — Settings hub
// Tabs: Field mapping / Templates / Team / Brand / Integrations

const FIELD_MAPPINGS = [
  { step: 'Contract',          col: 'Contract status',         type: 'Status',     owner: 'EC Booking', req: true },
  { step: 'Tech rider',         col: 'Tech rider received',     type: 'File',       owner: 'TM',         req: true },
  { step: 'Hospitality rider',  col: 'Hosp. rider received',    type: 'File',       owner: 'TM',         req: true },
  { step: 'Accommodation',      col: 'Hotel allocation',        type: 'Connect',    owner: 'EC Hosp.',   req: true },
  { step: 'Travel & flights',   col: 'Flight bookings',         type: 'Long text',  owner: 'TM',         req: true },
  { step: 'Arrivals confirmed', col: 'Arrival confirmed',       type: 'Date',       owner: 'EC Hosp.',   req: true },
  { step: 'Load-in scheduled',  col: 'Load-in slot',            type: 'Timeline',   owner: 'EC Prod.',   req: false },
  { step: 'Advancing complete', col: 'Advancing complete',      type: 'Status',     owner: 'EC Hosp.',   req: true },
];

const TEAM = [
  { name: 'Mara P.',     role: 'Hospitality lead', access: 'Admin',     artists: 24 },
  { name: 'Sofia R.',    role: 'Hospitality',      access: 'Editor',    artists: 18 },
  { name: 'Andrei C.',   role: 'Booking',          access: 'Editor',    artists: 32 },
  { name: 'Vlad M.',     role: 'Booking lead',     access: 'Admin',     artists: 41 },
  { name: 'Smaranda V.', role: 'Runner coord.',    access: 'Editor',    artists: 0 },
  { name: 'Bogdan T.',   role: 'Transport',        access: 'Read-only', artists: 0 },
  { name: 'Iulia R.',    role: 'Production',       access: 'Read-only', artists: 0 },
];

const TEMPLATES = [
  { id: 'first',   label: 'First-touch',   sub: 'Sent within 48h of contract' },
  { id: 'chase',   label: 'Chase',         sub: 'Auto-send when fields stall 3+ days' },
  { id: 'confirm', label: 'Confirm',       sub: 'Recap of locked fields' },
  { id: 'final',   label: 'Final brief',   sub: 'Sent 5 days before show' },
];

const INTEGRATIONS = [
  { id: 'monday',   key: 'se.con.monday',   status: 'connected', sub: '"Advancing 26" board · 142 items · last sync 12s ago' },
  { id: 'outlook',  key: 'se.con.outlook',  status: 'connected', sub: 'mara@electriccastle.ro · sent 47 emails this week' },
  { id: 'amadeus',  key: 'se.con.amadeus',  status: 'degraded',  sub: 'Read-only access · last refresh 2h ago' },
  { id: 'whatsapp', key: 'se.con.whatsapp', status: 'connected', sub: '+40 728 100 471 · Smaranda V. · 3 active threads' },
  { id: 'maps',     key: 'se.con.maps',     status: 'connected', sub: 'Routes from Cluj airport to all hotels · cached' },
];

function SettingsView({ t }) {
  const [tab, setTab] = useState('fields');

  return (
    <main className="page">
      <PageHero
        eyebrow={t('se.eyebrow')}
        title={t('se.title')}
        sub={t('se.sub')}
      />

      <div style={{display:'flex',gap:4,padding:'20px 0 0',borderBottom:'1px solid var(--line)',marginBottom:32}}>
        {[
          { id:'fields',    label: t('se.tabs.fields') },
          { id:'templates', label: t('se.tabs.templates') },
          { id:'team',      label: t('se.tabs.team') },
          { id:'brand',     label: t('se.tabs.brand') },
          { id:'connect',   label: t('se.tabs.connect') },
        ].map(x => (
          <a key={x.id}
             onClick={() => setTab(x.id)}
             style={{
               padding:'12px 16px',fontSize:13,fontWeight:500,cursor:'pointer',
               borderBottom: tab===x.id ? '2px solid var(--ink)' : '2px solid transparent',
               color: tab===x.id ? 'var(--ink)' : 'var(--ink-4)',
               marginBottom:-1,
             }}>{x.label}</a>
        ))}
      </div>

      {tab === 'fields'    && <FieldsTab t={t}/>}
      {tab === 'templates' && <TemplatesTab t={t}/>}
      {tab === 'team'      && <TeamTab t={t}/>}
      {tab === 'brand'     && <BrandTab t={t}/>}
      {tab === 'connect'   && <IntegrationsTab t={t}/>}

      <div style={{height:60}}></div>
    </main>
  );
}

function FieldsTab({ t }) {
  return (
    <section>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500,letterSpacing:'-0.025em',marginBottom:6}}>
            {t('se.fields.title')}
          </div>
          <div style={{fontSize:14,color:'var(--ink-3)',maxWidth:560}}>{t('se.fields.sub')}</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <a className="btn btn-ghost btn-sm">{t('common.cancel')}</a>
          <a className="btn btn-primary btn-sm">{t('common.save')}</a>
        </div>
      </div>
      <div className="card">
        <table className="dt">
          <thead>
            <tr>
              <th style={{width:32}}></th>
              <th>{t('se.fields.col.step')}</th>
              <th>{t('se.fields.col.col')}</th>
              <th>{t('se.fields.col.type')}</th>
              <th>{t('se.fields.col.owner')}</th>
              <th>{t('se.fields.col.req')}</th>
            </tr>
          </thead>
          <tbody>
            {FIELD_MAPPINGS.map((f, i) => (
              <tr key={i}>
                <td className="dim" style={{cursor:'grab'}}>
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="3" r="1.2"/><circle cx="7" cy="3" r="1.2"/><circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="3" cy="11" r="1.2"/><circle cx="7" cy="11" r="1.2"/></svg>
                </td>
                <td><span className="dt-name">{f.step}</span></td>
                <td>
                  <span className="badge b-info" style={{padding:'3px 10px',fontFamily:'var(--font-mono)'}}>
                    monday: {f.col}
                  </span>
                </td>
                <td><span className="mono" style={{fontSize:11,color:'var(--ink-3)'}}>{f.type}</span></td>
                <td>{f.owner}</td>
                <td>{f.req
                  ? <span className="badge b-stop">required</span>
                  : <span className="badge b-idle">optional</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TemplatesTab({ t }) {
  const [sel, setSel] = useState('chase');
  const tpl = TEMPLATES.find(x => x.id === sel);

  return (
    <section>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:24}}>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500,letterSpacing:'-0.025em',marginBottom:6}}>
            {t('se.tpl.title')}
          </div>
          <div style={{fontSize:14,color:'var(--ink-3)',maxWidth:560}}>{t('se.tpl.sub')}</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:20}}>
        <div className="card">
          {TEMPLATES.map((x, i) => (
            <div key={x.id}
                 onClick={() => setSel(x.id)}
                 style={{
                   padding:'16px 18px',cursor:'pointer',
                   borderBottom: i<TEMPLATES.length-1 ? '1px solid var(--line)' : 'none',
                   background: x.id === sel ? 'rgba(10,163,154,0.06)' : 'transparent',
                   borderLeft: x.id === sel ? '3px solid var(--teal)' : '3px solid transparent',
                 }}>
              <div style={{fontWeight:600,fontSize:14,color:'var(--ink)',marginBottom:4}}>{x.label}</div>
              <div className="mono" style={{fontSize:11,color:'var(--ink-4)'}}>{x.sub}</div>
            </div>
          ))}
        </div>
        <div className="card card-pad">
          <div className="mono" style={{fontSize:11,letterSpacing:'0.06em',color:'var(--ink-4)',marginBottom:14,fontWeight:500,textTransform:'uppercase'}}>
            {tpl.label} · subject line
          </div>
          <input className="field" defaultValue="EC12 Advancing — {{artist}} ({{stage}}, {{showDate}})" style={{marginBottom:18,fontFamily:'var(--font-mono)'}}/>

          <div className="mono" style={{fontSize:11,letterSpacing:'0.06em',color:'var(--ink-4)',marginBottom:14,fontWeight:500,textTransform:'uppercase'}}>
            body
          </div>
          <textarea
            className="field"
            rows={14}
            defaultValue={`Hi {{tmFirst}},

Mara from Electric Castle hospitality — picking up advancing for {{artist}}. You're playing {{stage}} on {{showDate}} at {{showTime}}.

PARTY SIZE
We have {{partySize}} on file. {{?partySizePending}}Could you confirm the final headcount?{{/}}

ACCOMMODATION
A-party at {{hotel}} ({{hotelCity}}). Standard check-in 14:00, check-out 12:00.

FLIGHTS
{{?hasFlights}}We've logged: {{flightLegs}}.{{/}}{{?noFlights}}Flights not yet on file — please share booking confirmations when ready.{{/}}

Best,
Mara P.`}
            style={{fontFamily:'var(--font-mono)',fontSize:12,resize:'vertical'}}/>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:18}}>
            <span className="mono dim" style={{fontSize:11}}>14 variables · 4 conditional blocks · live preview in {t('em.title').replace(/<[^>]+>/g,'')}</span>
            <div style={{display:'flex',gap:8}}>
              <a className="btn btn-ghost btn-sm">Reset</a>
              <a className="btn btn-primary btn-sm">{t('common.save')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamTab({ t }) {
  return (
    <section>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:24}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500,letterSpacing:'-0.025em'}}>{t('se.team.title')}</div>
        <a className="btn btn-primary btn-sm">+ Invite</a>
      </div>
      <div className="card">
        <table className="dt">
          <thead><tr>
            <th>{t('se.team.col.name')}</th>
            <th>{t('se.team.col.role')}</th>
            <th>{t('se.team.col.access')}</th>
            <th>{t('se.team.col.artists')}</th>
            <th></th>
          </tr></thead>
          <tbody>
            {TEAM.map((m, i) => {
              const initials = m.name.split(/\s+/).map(p => p[0]).join('').slice(0,2);
              return (
                <tr key={i}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="avatar" style={{width:28,height:28,fontSize:10}}>{initials}</div>
                      <span className="dt-name">{m.name}</span>
                    </div>
                  </td>
                  <td>{m.role}</td>
                  <td>
                    <span className={'badge ' + (m.access==='Admin'?'b-info':m.access==='Editor'?'b-go':'b-idle')}>
                      {m.access}
                    </span>
                  </td>
                  <td><span className="dt-num">{m.artists}</span></td>
                  <td><a className="btn btn-soft btn-sm" style={{padding:'4px 10px',fontSize:11}}>Edit</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BrandTab({ t }) {
  return (
    <section>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500,letterSpacing:'-0.025em',marginBottom:6}}>
          {t('se.brand.title')}
        </div>
        <div style={{fontSize:14,color:'var(--ink-3)',maxWidth:560}}>{t('se.brand.sub')}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div className="card card-pad">
          <SectionLabel2>Header voice</SectionLabel2>
          <input className="field" defaultValue="Welcome to the castle, {{artist}}." style={{marginBottom:14}}/>
          <SectionLabel2>Tagline</SectionLabel2>
          <input className="field" defaultValue="Three days. One stage. Everything below is live — refresh anytime." style={{marginBottom:14}}/>
          <SectionLabel2>Runner phone (always shown)</SectionLabel2>
          <input className="field field-mono" defaultValue="+40 728 100 471"/>
        </div>
        <div className="card card-pad">
          <SectionLabel2>Theme</SectionLabel2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:8,marginBottom:18}}>
            {[
              { name:'Festival', tags:['#0aa39a','#a3d437','#2563eb'], active:true },
              { name:'After dark', tags:['#0d0d0c','#0aa39a','#d97706'] },
              { name:'Pastel', tags:['#f5f3ee','#c7e577','#6b95f5'] },
            ].map((th, i) => (
              <div key={i} style={{
                padding:14,borderRadius:12,
                border: th.active ? '2px solid var(--ink)' : '1px solid var(--line)',
                cursor:'pointer',
              }}>
                <div style={{display:'flex',gap:4,marginBottom:10}}>
                  {th.tags.map((c, j) => (
                    <div key={j} style={{flex:1,height:32,borderRadius:6,background:c}}></div>
                  ))}
                </div>
                <div style={{fontSize:12,fontWeight:500}}>{th.name}</div>
              </div>
            ))}
          </div>
          <SectionLabel2>Microsite logo</SectionLabel2>
          <div style={{display:'flex',alignItems:'center',gap:14,padding:14,border:'1px dashed var(--line-2)',borderRadius:12}}>
            <div className="brand-dot" style={{width:32,height:32}}></div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500}}>EC12-mark.svg</div>
              <div className="mono dim" style={{fontSize:11}}>uploaded · 4kb</div>
            </div>
            <a className="btn btn-soft btn-sm">Replace</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationsTab({ t }) {
  return (
    <section>
      <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500,letterSpacing:'-0.025em',marginBottom:24}}>
        {t('se.con.title')}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {INTEGRATIONS.map((it, i) => (
          <div key={it.id} className="card card-pad" style={{display:'flex',gap:16,alignItems:'flex-start'}}>
            <div style={{
              width:42,height:42,borderRadius:12,flexShrink:0,
              background: it.status === 'connected' ? 'linear-gradient(135deg, rgba(10,163,154,0.18), rgba(10,163,154,0.05))'
                                                    : 'linear-gradient(135deg, rgba(217,119,6,0.18), rgba(217,119,6,0.05))',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,
              color: it.status === 'connected' ? 'var(--teal)' : 'var(--amber)',
            }}>{t(it.key)[0]}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                <span style={{fontWeight:600,fontSize:14}}>{t(it.key)}</span>
                <span className={'badge ' + (it.status==='connected'?'b-go':'b-warn')}>
                  {t('se.con.' + it.status)}
                </span>
              </div>
              <div className="mono dim" style={{fontSize:11,marginBottom:10}}>{it.sub}</div>
              <a className="btn btn-soft btn-sm" style={{padding:'4px 10px',fontSize:11}}>{t('se.con.config')}</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel2({ children }) {
  return (
    <div className="mono" style={{
      fontSize:11,letterSpacing:'0.06em',textTransform:'uppercase',
      color:'var(--ink-4)',marginBottom:8,fontWeight:500,
    }}>{children}</div>
  );
}

window.SettingsView = SettingsView;
