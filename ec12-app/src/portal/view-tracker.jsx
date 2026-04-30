// AIdvancing — Tracker view
// Stat strip + filters + searchable table + drawer

const TIER_LABEL = {
  'Headliner': { label: 'HEADLINER', cls: 'b-stop' },
  'Sub-headliner': { label: 'SUB-HEAD', cls: 'b-warn' },
  'Support': { label: 'SUPPORT', cls: 'b-idle' },
};

function TrackerView({ t, onOpenArtist }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ col: 'date', dir: 'asc' });

  const artists = window.ARTISTS;
  const stages = window.STAGES;
  const hotels = window.HOTELS;

  const stageOf = (id) => stages.find(s => s.id === id);
  const hotelOf = (id) => hotels.find(h => h.id === id);

  const filtered = useMemo(() => {
    let list = artists.slice();
    if (filter === 'head') list = list.filter(a => a.tier === 'Headliner' || a.tier === 'Sub-headliner');
    if (filter === 'chasing') list = list.filter(a => a.status.some(s => s === 'pending' || s === 'needed' || s === 'blocked'));
    if (filter === 'today') list = list.filter(a => a.showDate === '2026-07-17');
    if (filter === 'flying') list = list.filter(a => a.travelMode === 'Flying' || a.travelMode === 'Mixed');

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.tmName.toLowerCase().includes(q) ||
        (a.flights || []).some(f => f.no.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sort.col === 'name') return a.name.localeCompare(b.name) * (sort.dir === 'asc' ? 1 : -1);
      if (sort.col === 'progress') {
        const ap = progressOf(a.status).pct;
        const bp = progressOf(b.status).pct;
        return (ap - bp) * (sort.dir === 'asc' ? 1 : -1);
      }
      // date
      const r = (a.showDate + a.showTime).localeCompare(b.showDate + b.showTime);
      return r * (sort.dir === 'asc' ? 1 : -1);
    });

    return list;
  }, [filter, query, sort]);

  const totals = useMemo(() => {
    const total = artists.length;
    const advanced = artists.filter(a => progressOf(a.status).pct >= 80).length;
    const chasing  = artists.filter(a => a.status.some(s => s === 'pending' || s === 'needed' || s === 'blocked')).length;
    const overdue  = artists.filter(a => a.status.some(s => s === 'needed' || s === 'blocked')).length;
    return { total, advanced, chasing, overdue };
  }, []);

  return (
    <main className="page">
      <PageHero
        eyebrow={t('tr.eyebrow')}
        title={t('tr.title')}
        sub={t('tr.sub')}
        right={
          <div style={{display:'flex',gap:8}}>
            <a className="btn btn-soft btn-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 7h10M7 2v10"/>
              </svg>
              Add artist
            </a>
            <a className="btn btn-soft btn-sm">Export CSV</a>
          </div>
        }
      />

      <StatStrip stats={[
        { label: t('tr.stat.total'), value: totals.total, unit: t('tr.stat.booked'), trend: '▲ 12 / week', trendVariant: 'up' },
        { label: t('tr.stat.advanced'), value: totals.advanced, unit: '/' + totals.total, trend: Math.round(100*totals.advanced/totals.total) + '%', trendVariant: 'dim' },
        { label: t('tr.stat.chasing'), value: totals.chasing, trend: t('tr.stat.overdue', { n: totals.overdue }), trendVariant: 'warn' },
        { label: t('tr.stat.days'), value: 68, trend: t('tr.stat.gates'), trendVariant: 'dim' },
      ]}/>

      {/* Filters + search row */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0 18px',borderBottom:'1px solid var(--line)',marginBottom:24}}>
        <div style={{display:'flex',gap:4}}>
          {[
            { id:'all',     label: t('tr.filters.all') },
            { id:'head',    label: t('tr.filters.head') },
            { id:'chasing', label: t('tr.filters.chasing') },
            { id:'today',   label: t('tr.filters.today') },
            { id:'flying',  label: t('tr.filters.flying') },
          ].map(f => (
            <a key={f.id}
               onClick={() => setFilter(f.id)}
               className={'btn btn-sm ' + (filter === f.id ? 'btn-primary' : 'btn-soft')}>
              {f.label}
            </a>
          ))}
        </div>
        <div style={{flex:1}}></div>
        <div className="search-pill">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="3.5"/><path d="M8 8l3 3"/></svg>
          <input
            type="text"
            placeholder={t('tr.search')}
            value={query}
            onChange={e => setQuery(e.target.value)}/>
        </div>
        <div className="dim mono" style={{fontSize:11}}>{filtered.length} / {artists.length}</div>
      </div>

      {/* Table */}
      <div className="card" style={{marginBottom:40}}>
        <table className="dt">
          <thead>
            <tr>
              <th onClick={()=>setSort(s=>({col:'name',dir:s.col==='name'&&s.dir==='asc'?'desc':'asc'}))} style={{cursor:'pointer'}}>{t('tr.col.artist')}</th>
              <th onClick={()=>setSort(s=>({col:'date',dir:s.col==='date'&&s.dir==='asc'?'desc':'asc'}))} style={{cursor:'pointer'}}>{t('tr.col.show')}</th>
              <th>{t('tr.col.party')}</th>
              <th>{t('tr.col.travel')}</th>
              <th>{t('tr.col.hotel')}</th>
              <th>{t('tr.col.tm')}</th>
              <th onClick={()=>setSort(s=>({col:'progress',dir:s.col==='progress'&&s.dir==='asc'?'desc':'asc'}))} style={{cursor:'pointer',width:160}}>{t('tr.col.steps')}</th>
              <th>{t('tr.col.status')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const stage = stageOf(a.stage);
              const hotel = hotelOf(a.hotel);
              const prog = progressOf(a.status);
              const tier = TIER_LABEL[a.tier] || { label: a.tier.toUpperCase(), cls: 'b-idle' };
              const arrivalFlight = (a.flights || []).find(f => f.dir === 'arr');
              const isChasing = a.status.some(s => s === 'pending' || s === 'needed' || s === 'blocked');
              const showDate = new Date(a.showDate).toLocaleDateString('en-GB', { weekday: 'short', day:'numeric', month:'short' });
              return (
                <tr key={a.id} className="clickable" onClick={() => onOpenArtist(a.id)}>
                  <td>
                    <div style={{display:'flex',flexDirection:'column',gap:3}}>
                      <span className="dt-name">{a.name}</span>
                      <span style={{display:'flex',gap:6,alignItems:'center'}}>
                        <span className={'badge ' + tier.cls} style={{fontSize:9,padding:'2px 7px'}}>{tier.label}</span>
                        <StageChip stageId={a.stage}/>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span className="dt-mono">{showDate}</span>
                      <span className="mono dim" style={{fontSize:11}}>{a.showTime} · {a.actType}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span className="dt-num">{a.party} + {a.crew}</span>
                      <span className="mono dim" style={{fontSize:11}}>{a.rooms} rooms</span>
                    </div>
                  </td>
                  <td>
                    {arrivalFlight ? (
                      <div style={{display:'flex',flexDirection:'column'}}>
                        <span className="dt-mono">{arrivalFlight.no}</span>
                        <span className="mono dim" style={{fontSize:11}}>{arrivalFlight.from}→{arrivalFlight.to} · {arrivalFlight.date.slice(5)}</span>
                      </div>
                    ) : (
                      <span className="dim mono" style={{fontSize:11}}>{a.travelMode}</span>
                    )}
                  </td>
                  <td>
                    {hotel ? (
                      <div style={{display:'flex',flexDirection:'column'}}>
                        <span style={{fontSize:13,color:'var(--ink-2)',fontWeight:500}}>{hotel.name}</span>
                        <span className="mono dim" style={{fontSize:11}}>{hotel.tier} · {hotel.city}</span>
                      </div>
                    ) : (<span className="dim">—</span>)}
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span style={{fontSize:13,color:'var(--ink-2)',fontWeight:500}}>{a.tmName}</span>
                      <span className="mono dim" style={{fontSize:11}}>{a.lead}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column',gap:5}}>
                      <StepsBar statuses={a.status}/>
                      <span className="mono" style={{fontSize:11,color:'var(--ink-3)'}}>{prog.done}/{prog.total} · {prog.pct}%</span>
                    </div>
                  </td>
                  <td>
                    {isChasing
                      ? <StatusBadge status={a.status.find(s => s === 'needed' || s === 'blocked') ? 'needed' : 'pending'} t={t}/>
                      : <StatusBadge status={prog.pct === 100 ? 'confirmed' : 'partial'} t={t}/>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

window.TrackerView = TrackerView;
