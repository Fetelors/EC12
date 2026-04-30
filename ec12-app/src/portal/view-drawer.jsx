// AIdvancing — Artist drawer
// Slides in from right; tabs for Overview / Fields / Travel / Activity

const FIELDS = [
  { key: 'partySize',     label: 'Party size & rooming',     owner: 'TM' },
  { key: 'tmContact',     label: 'TM contact details',       owner: 'TM' },
  { key: 'rider',         label: 'Hospitality rider',        owner: 'TM' },
  { key: 'dietary',       label: 'Dietary requirements',     owner: 'TM' },
  { key: 'hotelDetails',  label: 'Hotel allocation',         owner: 'EC' },
  { key: 'flightDetails', label: 'Flight bookings',          owner: 'TM' },
  { key: 'transfers',     label: 'Ground transfers',         owner: 'EC' },
];

const ACTIVITY = [
  { who: 'Mara P.',   when: '14:32', what: 'Marked rooming list confirmed.', kind: 'go' },
  { who: 'Lucas Beck',when: '12:08', what: 'Replied to chase #2 — flights forwarded.', kind: 'info' },
  { who: 'System',    when: '09:00', what: 'Auto-chase email sent — dietary requirements pending 3 days.', kind: 'warn' },
  { who: 'Vlad M.',   when: 'Yest', what: 'Updated stage allocation: Mainstage → Hangar.', kind: 'info' },
  { who: 'System',    when: 'Yest', what: 'Hotel allocation marked partial — 2 rooms unconfirmed.', kind: 'warn' },
];

function ArtistDrawer({ artist, t, onClose, onNav }) {
  const [tab, setTab] = useState('overview');
  if (!artist) return null;

  const stage = window.STAGES.find(s => s.id === artist.stage);
  const hotel = window.HOTELS.find(h => h.id === artist.hotel);
  const prog = progressOf(artist.status);
  const isChasing = artist.status.some(s => s === 'pending' || s === 'needed' || s === 'blocked');

  // ESC close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <aside className="drawer">
        {/* Header */}
        <div style={{padding:'24px 28px 20px',borderBottom:'1px solid var(--line)'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18}}>
            <div className="ac-tier" style={{display:'inline-flex',alignItems:'center',gap:8}}>
              {artist.tier.toUpperCase()} · {stage.name.toUpperCase()}
            </div>
            <a className="btn btn-soft btn-sm" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l6 6M9 3l-6 6"/></svg>
              {t('common.close')}
            </a>
          </div>
          <div style={{fontFamily:'var(--font-display)',fontSize:48,lineHeight:0.95,letterSpacing:'-0.03em',fontWeight:500,marginBottom:12}}>
            {artist.name}
          </div>
          <div style={{display:'flex',gap:14,fontSize:14,color:'var(--ink-3)',flexWrap:'wrap'}}>
            <span className="mono">{new Date(artist.showDate).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})} · {artist.showTime}</span>
            <span className="dimmer">·</span>
            <span>{artist.party}+{artist.crew} party · {artist.rooms} rooms</span>
            <span className="dimmer">·</span>
            <span>{artist.travelMode}</span>
          </div>
          <div style={{display:'flex',gap:8,marginTop:20}}>
            <a className="btn btn-primary btn-sm" onClick={() => onNav('email', artist.id)}>{t('dr.action.email')}</a>
            <a className="btn btn-soft btn-sm" onClick={() => onNav('itinerary', artist.id)}>{t('dr.action.itin')}</a>
            <a className="btn btn-ghost btn-sm">{t('dr.action.monday')}
              <svg width="11" height="11" viewBox="0 0 11 11" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M3 3h5v5M8 3l-5 5"/></svg>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,padding:'12px 28px 0',borderBottom:'1px solid var(--line)'}}>
          {[
            { id:'overview', label: t('dr.tabs.overview') },
            { id:'fields',   label: t('dr.tabs.fields') },
            { id:'travel',   label: t('dr.tabs.travel') },
            { id:'activity', label: t('dr.tabs.activity') },
          ].map(x => (
            <a key={x.id}
               onClick={() => setTab(x.id)}
               style={{
                 padding:'10px 14px',fontSize:13,fontWeight:500,cursor:'pointer',
                 borderBottom: tab===x.id ? '2px solid var(--ink)' : '2px solid transparent',
                 color: tab===x.id ? 'var(--ink)' : 'var(--ink-4)',
                 marginBottom:-1,
               }}>{x.label}</a>
          ))}
        </div>

        {/* Body */}
        <div style={{flex:1,overflow:'auto',padding:'28px'}}>

          {tab === 'overview' && (
            <>
              {isChasing && <ChasingAlert artist={artist} t={t}/>}

              <div style={{marginBottom:32}}>
                <div className="mono" style={{fontSize:11,letterSpacing:'0.04em',color:'var(--ink-4)',marginBottom:14}}>
                  {t('dr.advancing').toUpperCase()} · {prog.done}/{prog.total} · {prog.pct}%
                </div>
                <StepsBar statuses={artist.status}/>
                <div style={{display:'flex',gap:24,marginTop:14,flexWrap:'wrap',fontSize:11}} className="mono dim">
                  {window.STEPS.map((s, i) => (
                    <span key={s.id} style={{
                      color: artist.status[i] === 'confirmed' ? 'var(--teal)'
                           : artist.status[i] === 'pending' || artist.status[i] === 'partial' ? 'var(--amber)'
                           : artist.status[i] === 'needed' || artist.status[i] === 'blocked' ? 'var(--st-stop)'
                           : 'var(--ink-5)',
                    }}>{s.short}</span>
                  ))}
                </div>
              </div>

              <DetailGrid artist={artist} hotel={hotel}/>
            </>
          )}

          {tab === 'fields' && <FieldsTab artist={artist} t={t}/>}
          {tab === 'travel' && <TravelTab artist={artist} hotel={hotel} t={t}/>}
          {tab === 'activity' && <ActivityTab/>}

        </div>
      </aside>
    </>
  );
}

function ChasingAlert({ artist, t }) {
  const items = [];
  if (artist.fields.partySize !== 'confirmed')     items.push('rooming list');
  if (artist.fields.dietary !== 'confirmed')       items.push('dietary');
  if (artist.fields.flightDetails !== 'confirmed') items.push('flight bookings');
  if (artist.fields.transfers === 'needed')        items.push('ground transfers');
  if (items.length === 0) return null;

  return (
    <div style={{
      display:'flex',gap:12,padding:'14px 16px',borderRadius:12,marginBottom:24,
      background:'rgba(217,119,6,0.07)', border:'1px solid rgba(217,119,6,0.22)',
    }}>
      <div style={{
        flex:'0 0 auto',width:20,height:20,borderRadius:'50%',
        background:'var(--amber)',color:'white',display:'flex',
        alignItems:'center',justifyContent:'center',
        fontFamily:'var(--font-mono)',fontSize:12,fontWeight:600,marginTop:1,
      }}>!</div>
      <div style={{fontSize:13,lineHeight:1.45,color:'var(--ink-2)'}}>
        <strong style={{color:'var(--amber)',fontWeight:600}}>{items.length} item{items.length>1?'s':''} chasing.</strong>{' '}
        {items.join(' · ')}.
      </div>
    </div>
  );
}

function DetailGrid({ artist, hotel }) {
  const arr = (artist.flights || []).filter(f => f.dir === 'arr');
  const dep = (artist.flights || []).filter(f => f.dir === 'dep');
  const items = [
    {
      label: 'ARRIVAL',
      value: arr[0] ? `${arr[0].no} · ${arr[0].from} → ${arr[0].to}` : '—',
      sub: arr[0] ? `${arr[0].date.slice(5)} · ${arr[0].time} · ${arr[0].pax} pax` : (artist.travelMode + ' · TBC'),
      warn: arr[0]?.conf !== 'confirmed',
    },
    {
      label: 'HOTEL',
      value: hotel ? `${hotel.name}` : '—',
      sub: hotel ? `${hotel.tier} · ${hotel.city} · ${artist.rooms} rooms` : '',
      warn: artist.fields.hotelDetails !== 'confirmed',
    },
    {
      label: 'GROUND TRANSFERS',
      value: artist.fields.transfers === 'confirmed' ? 'SUV + Sprinter assigned' : 'awaiting flights',
      sub: 'Bogdan T. · +40 728 451 770',
      warn: artist.fields.transfers !== 'confirmed',
    },
    {
      label: 'DEPARTURE',
      value: dep[0] ? `${dep[0].no} · ${dep[0].from} → ${dep[0].to}` : '—',
      sub: dep[0] ? `${dep[0].date.slice(5)} · ${dep[0].time} · ${dep[0].pax} pax` : '',
      warn: dep[0]?.conf !== 'confirmed',
    },
  ];

  return (
    <div style={{
      display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px 28px',
      padding:'20px 0 24px',
      borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{display:'flex',flexDirection:'column',gap:4}}>
          <span className="mono" style={{fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--ink-4)',fontWeight:500}}>{it.label}</span>
          <span style={{fontSize:14,color: it.warn ? 'var(--amber)' : 'var(--ink-2)',fontWeight:500,letterSpacing:'-0.005em'}}>{it.value}</span>
          {it.sub && <span className="mono" style={{fontSize:11,color:'var(--ink-2)',fontWeight:500}}>{it.sub}</span>}
        </div>
      ))}
    </div>
  );
}

function FieldsTab({ artist, t }) {
  return (
    <>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500,letterSpacing:'-0.02em',marginBottom:6}}>
          {t('dr.fields.title')}
        </div>
        <div style={{fontSize:13,color:'var(--ink-3)',maxWidth:480}}>
          {t('dr.fields.sub')}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:0,border:'1px solid var(--line)',borderRadius:12,overflow:'hidden',background:'var(--paper)'}}>
        {FIELDS.map((f, i) => {
          const v = artist.fields[f.key] || 'idle';
          return (
            <div key={f.key} style={{
              display:'grid',gridTemplateColumns:'1fr auto auto',gap:16,alignItems:'center',
              padding:'14px 16px',borderBottom: i<FIELDS.length-1?'1px solid var(--line)':'none',
            }}>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:'var(--ink-2)'}}>{f.label}</div>
                <div className="mono dim" style={{fontSize:10,letterSpacing:'0.04em',marginTop:2}}>OWNER · {f.owner}</div>
              </div>
              <StatusBadge status={v} t={t}/>
              <a className="btn btn-soft btn-sm" style={{padding:'4px 10px',fontSize:11}}>Update</a>
            </div>
          );
        })}
      </div>
    </>
  );
}

function TravelTab({ artist, hotel, t }) {
  const arr = (artist.flights || []).filter(f => f.dir === 'arr');
  const dep = (artist.flights || []).filter(f => f.dir === 'dep');
  return (
    <>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500,letterSpacing:'-0.02em',marginBottom:6}}>
          {t('dr.travel.title')}
        </div>
      </div>

      <SectionLabel>{t('dr.travel.flights')}</SectionLabel>
      {(arr.length + dep.length === 0) ? (
        <div className="card card-pad dim" style={{fontSize:13}}>{artist.travelMode} — no flights on file.</div>
      ) : (
        <div className="card" style={{marginBottom:28}}>
          <table className="dt">
            <thead>
              <tr>
                <th>Dir</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Date</th>
                <th>Time</th>
                <th>Pax</th>
                <th>Party</th>
                <th>Conf</th>
              </tr>
            </thead>
            <tbody>
              {[...arr, ...dep].map((f, i) => (
                <tr key={i}>
                  <td><span className="mono dim" style={{fontSize:11,textTransform:'uppercase'}}>{f.dir}</span></td>
                  <td><span className="dt-mono">{f.no}</span></td>
                  <td><span className="dt-mono">{f.from} → {f.to}</span></td>
                  <td><span className="dt-mono">{f.date.slice(5)}</span></td>
                  <td><span className="dt-mono">{f.time}</span></td>
                  <td><span className="dt-num">{f.pax}</span></td>
                  <td>{f.partyType}</td>
                  <td><StatusBadge status={f.conf} t={t}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SectionLabel>{t('dr.travel.hotel')}</SectionLabel>
      <div className="card card-pad" style={{marginBottom:28}}>
        {hotel ? (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 28px'}}>
            <KV label="Hotel" value={hotel.name}/>
            <KV label="Tier" value={hotel.tier}/>
            <KV label="City" value={hotel.city}/>
            <KV label="Rooms" value={artist.rooms + ' rooms'}/>
            <KV label="Check-in" value="14:00"/>
            <KV label="Check-out" value="12:00"/>
          </div>
        ) : <div className="dim">No hotel allocated.</div>}
      </div>

      <SectionLabel>{t('dr.travel.transfer')}</SectionLabel>
      <div className="card card-pad">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 28px'}}>
          <KV label="Vehicles" value="3 SUV + 1 Sprinter"/>
          <KV label="Lead driver" value="Bogdan T."/>
          <KV label="Phone" value="+40 728 451 770"/>
          <KV label="Status" value={<StatusBadge status={artist.fields.transfers} t={t}/>}/>
        </div>
      </div>
    </>
  );
}

function ActivityTab() {
  return (
    <>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:500,letterSpacing:'-0.02em',marginBottom:6}}>
          Recent activity
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:0,borderLeft:'2px solid var(--line)'}}>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{padding:'12px 0 16px 18px',position:'relative'}}>
            <div style={{
              position:'absolute',left:-5,top:18,width:8,height:8,borderRadius:'50%',
              background: a.kind==='go'?'var(--teal)':a.kind==='warn'?'var(--amber)':'var(--ink-4)',
              boxShadow:'0 0 0 3px var(--paper)',
            }}></div>
            <div style={{display:'flex',gap:8,alignItems:'baseline',marginBottom:2}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--ink-2)'}}>{a.who}</span>
              <span className="mono dim" style={{fontSize:11}}>{a.when}</span>
            </div>
            <div style={{fontSize:13,color:'var(--ink-3)'}}>{a.what}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="mono" style={{
      fontSize:11,letterSpacing:'0.06em',textTransform:'uppercase',
      color:'var(--ink-4)',marginBottom:10,fontWeight:500,
    }}>{children}</div>
  );
}

function KV({ label, value }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <span className="mono" style={{fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase',color:'var(--ink-4)',fontWeight:500}}>{label}</span>
      <span style={{fontSize:13,color:'var(--ink-2)',fontWeight:500}}>{value}</span>
    </div>
  );
}

window.ArtistDrawer = ArtistDrawer;
