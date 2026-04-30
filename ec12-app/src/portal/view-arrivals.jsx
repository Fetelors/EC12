// AIdvancing — Arrivals & departures
// Flight-board style with summary chips up top

const DRIVERS = [
  'Bogdan T.', 'Cristi A.', 'Iulia R.', 'Tudor L.', 'Andra M.',
  'Smaranda V.', 'Matei P.', 'Ioana D.', 'Radu N.', '—',
];

const VEHICLES = [
  'SUV · CJ-77-FST', 'Sprinter · CJ-12-EC', 'SUV · CJ-44-MUS', 'Coach · CJ-99-EC',
  'SUV · CJ-21-FST', 'Sprinter · CJ-08-EC', 'SUV · CJ-66-EC', 'SUV · CJ-13-EC',
];

// Build a movements list from artist flights, plus a few extras for density.
function buildMovements() {
  const list = [];
  let driverIdx = 0, vehicleIdx = 0;
  window.ARTISTS.forEach(a => {
    (a.flights || []).forEach(f => {
      const hotel = window.HOTELS.find(h => h.id === a.hotel);
      list.push({
        ...f,
        artist: a.name,
        artistId: a.id,
        stage: a.stage,
        driver: DRIVERS[driverIdx++ % DRIVERS.length],
        vehicle: VEHICLES[vehicleIdx++ % VEHICLES.length],
        hotelTo: hotel ? hotel.name : 'TBC',
      });
    });
  });
  return list;
}

const STATUS_VARIANTS = ['landed', 'delayed', 'boarding', 'onTime', 'scheduled', 'noDriver'];

function statusForMovement(m) {
  // Deterministic-ish based on time/conf
  if (m.conf === 'partial' || m.conf === 'pending') return Math.random() > 0.5 ? 'delayed' : 'noDriver';
  // Use hour as seed
  const h = parseInt(m.time.slice(0, 2), 10);
  if (h < 14) return 'landed';
  if (h < 16) return 'onTime';
  return 'scheduled';
}

function ArrivalsView({ t }) {
  const [tab, setTab] = useState('arr');
  const [filter, setFilter] = useState('today');

  const movements = useMemo(() => buildMovements(), []);
  const arr = movements.filter(m => m.dir === 'arr');
  const dep = movements.filter(m => m.dir === 'dep');
  const list = (tab === 'arr' ? arr : dep)
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const summary = {
    total: list.length,
    drivers: new Set(list.map(m => m.driver).filter(d => d !== '—')).size,
    vehicles: new Set(list.map(m => m.vehicle)).size,
    gaps: list.filter(m => m.driver === '—' || m.conf === 'pending').length,
  };

  return (
    <main className="page">
      <PageHero
        eyebrow={t('ar.eyebrow')}
        title={t('ar.title')}
        sub={t('ar.sub')}
        right={
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <span className="badge b-stop" style={{padding:'5px 12px'}}>
              <span className="dot dot-stop" style={{boxShadow:'0 0 0 0 transparent'}}></span>
              {t('ar.live')}
            </span>
            <a className="btn btn-soft btn-sm">Print roster</a>
          </div>
        }
      />

      <StatStrip stats={[
        { label: t('ar.summary.tot').toUpperCase(), value: summary.total, trend: '4 days to gates', trendVariant: 'dim' },
        { label: t('ar.summary.drv').toUpperCase(), value: summary.drivers, trend: '6 vans · 4 SUVs', trendVariant: 'dim' },
        { label: t('ar.summary.veh').toUpperCase(), value: summary.vehicles, trend: '2 reserve avail.', trendVariant: 'up' },
        { label: t('ar.summary.gap').toUpperCase(), value: summary.gaps, trend: 'requires action', trendVariant: 'warn' },
      ]}/>

      {/* Tabs + filter row */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0 18px',borderBottom:'1px solid var(--line)',marginBottom:24}}>
        <div style={{display:'flex',gap:4}}>
          {['arr', 'dep'].map(x => (
            <a key={x}
               onClick={() => setTab(x)}
               className={'btn btn-sm ' + (tab === x ? 'btn-primary' : 'btn-soft')}>
              {t('ar.tabs.' + x)}
            </a>
          ))}
        </div>
        <div style={{flex:1}}></div>
        <div style={{display:'flex',gap:6}}>
          {['today', 'week', 'all'].map(f => (
            <a key={f}
               onClick={() => setFilter(f)}
               className={'btn btn-sm ' + (filter === f ? 'btn-primary' : 'btn-soft')}
               style={{padding:'6px 12px',fontSize:11}}>
              {f === 'today' ? 'Today' : f === 'week' ? 'This week' : 'All'}
            </a>
          ))}
        </div>
      </div>

      {/* The board */}
      <div className="card" style={{marginBottom:40,fontVariantNumeric:'tabular-nums'}}>
        <table className="dt">
          <thead>
            <tr>
              <th style={{width:90}}>{t('ar.col.time')}</th>
              <th>{t('ar.col.flight')}</th>
              <th>{t('ar.col.route')}</th>
              <th>{t('ar.col.artist')}</th>
              <th>{t('ar.col.pax')}</th>
              <th>{t('ar.col.driver')}</th>
              <th>{t('ar.col.vehicle')}</th>
              <th>{t('ar.col.hotel')}</th>
              <th>{t('ar.col.status')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m, i) => {
              const st = statusForMovement(m);
              const stCls = st === 'landed' ? 'b-go'
                          : st === 'onTime' ? 'b-go'
                          : st === 'boarding' ? 'b-info'
                          : st === 'delayed' ? 'b-warn'
                          : st === 'noDriver' ? 'b-stop'
                          : 'b-idle';
              const stLabel = st === 'delayed' ? t('ar.st.delayed', { n: 25 })
                            : t('ar.st.' + st);
              return (
                <tr key={i}>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span className="dt-mono" style={{fontSize:14,fontWeight:600,color:'var(--ink)'}}>{m.time}</span>
                      <span className="mono dim" style={{fontSize:10}}>{m.date.slice(5)}</span>
                    </div>
                  </td>
                  <td><span className="dt-mono">{m.no}</span></td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span className="dt-mono">{m.from}</span>
                      <svg width="20" height="10" viewBox="0 0 20 10" stroke="currentColor" strokeWidth="1" fill="none" style={{color:'var(--ink-4)'}}>
                        <path d="M2 5h14m-3-3l3 3-3 3"/>
                      </svg>
                      <span className="dt-mono">{m.to}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span className="dt-name">{m.artist}</span>
                      <StageChip stageId={m.stage}/>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span className="dt-num">{m.pax}</span>
                      <span className="mono dim" style={{fontSize:10}}>{m.partyType}</span>
                    </div>
                  </td>
                  <td>
                    <span className="dt-mono" style={{color: m.driver === '—' ? 'var(--st-stop)' : 'var(--ink-2)'}}>
                      {m.driver}
                    </span>
                  </td>
                  <td><span className="mono dim" style={{fontSize:11}}>{m.vehicle}</span></td>
                  <td>
                    <span style={{fontSize:13,color:'var(--ink-2)'}}>{m.hotelTo}</span>
                  </td>
                  <td>
                    <span className={'badge ' + stCls}>
                      {stLabel}
                    </span>
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

window.ArrivalsView = ArrivalsView;
