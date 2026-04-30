// AIdvancing — Email draft center
// Two-pane: queue of drafts on the left, full email preview on the right

const CADENCES = [
  { id: 'first',   key: 'em.cadence.first' },
  { id: 'chase',   key: 'em.cadence.chase' },
  { id: 'confirm', key: 'em.cadence.confirm' },
  { id: 'final',   key: 'em.cadence.final' },
];

function urgencyOf(a) {
  if (a.status.some(s => s === 'needed' || s === 'blocked')) return 0;
  if (a.status.some(s => s === 'pending')) return 1;
  if (a.status.some(s => s === 'partial')) return 2;
  return 3;
}

function urgencyLabel(u) {
  return u === 0 ? { label:'OVERDUE', cls:'b-stop' }
       : u === 1 ? { label:'CHASE',   cls:'b-warn' }
       : u === 2 ? { label:'PARTIAL', cls:'b-info' }
       :           { label:'CALM',    cls:'b-idle' };
}

function EmailView({ t, initialArtistId, onOpenArtist }) {
  const artists = window.ARTISTS;
  const sorted = useMemo(() => artists.slice().sort((a,b) => urgencyOf(a) - urgencyOf(b)), []);
  const [selId, setSelId] = useState(initialArtistId || sorted[0].id);
  const [cadence, setCadence] = useState('chase');

  const artist = artists.find(a => a.id === selId) || sorted[0];

  return (
    <main className="page">
      <PageHero
        eyebrow={t('em.eyebrow')}
        title={t('em.title')}
        sub={t('em.sub')}
      />

      <div style={{
        display:'grid',gridTemplateColumns:'380px 1fr',gap:20,
        marginTop:24,marginBottom:40,
      }}>
        {/* LEFT: drafts queue */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">{t('em.list.title')}</div>
            <div className="card-meta">{t('em.list.meta', { n: sorted.length })}</div>
          </div>
          <div style={{maxHeight:760,overflow:'auto'}}>
            {sorted.map(a => {
              const u = urgencyOf(a);
              const meta = urgencyLabel(u);
              const stage = window.STAGES.find(s => s.id === a.stage);
              const isSel = a.id === artist.id;
              return (
                <div key={a.id}
                     onClick={() => setSelId(a.id)}
                     style={{
                       padding:'14px 18px',cursor:'pointer',
                       borderBottom:'1px solid var(--line)',
                       background: isSel ? 'rgba(10,163,154,0.06)' : 'transparent',
                       borderLeft: isSel ? '3px solid var(--teal)' : '3px solid transparent',
                       display:'flex',flexDirection:'column',gap:6,
                     }}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                    <div className="dt-name" style={{fontSize:14}}>{a.name}</div>
                    <span className={'badge ' + meta.cls} style={{fontSize:9,padding:'2px 7px'}}>{meta.label}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,fontSize:11}} className="mono dim">
                    <StageChip stageId={a.stage}/>
                    <span>{a.showDate.slice(5)} · {a.showTime}</span>
                  </div>
                  <div style={{fontSize:12,color:'var(--ink-3)'}}>
                    {a.tmName} · <span className="mono">{a.tmEmail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: email preview */}
        <DraftPreview artist={artist} cadence={cadence} setCadence={setCadence} t={t} onOpenArtist={onOpenArtist}/>
      </div>
    </main>
  );
}

function DraftPreview({ artist, cadence, setCadence, t, onOpenArtist }) {
  const stage = window.STAGES.find(s => s.id === artist.stage);
  const hotel = window.HOTELS.find(h => h.id === artist.hotel);
  const arr = (artist.flights || []).filter(f => f.dir === 'arr');
  const dep = (artist.flights || []).filter(f => f.dir === 'dep');
  const flightLegs = [...arr, ...dep].map(f => `${f.no} ${f.from}→${f.to} ${f.date.slice(5)} ${f.time}`).join(' · ');

  const showDate = new Date(artist.showDate).toLocaleDateString('en-GB', { day:'numeric', month:'long' });
  const subject = `EC12 Advancing — ${artist.name} (${stage.name}, ${showDate})`;
  const firstName = artist.tmName.split(' ')[0];

  return (
    <div className="card" style={{display:'flex',flexDirection:'column'}}>
      {/* Top bar: cadence + actions */}
      <div className="card-head" style={{justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div className="card-title">{artist.name}</div>
          <div className="mono dim" style={{fontSize:11}}>{stage.name} · {showDate} · {artist.showTime}</div>
        </div>
        <div style={{display:'flex',gap:6,marginLeft:'auto'}}>
          <a className="btn btn-soft btn-sm" onClick={() => onOpenArtist(artist.id)}>Open record</a>
          <a className="btn btn-ghost btn-sm">{t('em.draft.regen')}</a>
          <a className="btn btn-primary btn-sm">
            {t('em.draft.send')}
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M2 6h7m-3-3l3 3-3 3"/></svg>
          </a>
        </div>
      </div>

      {/* Cadence selector */}
      <div style={{padding:'14px 22px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',gap:14}}>
        <span className="mono" style={{fontSize:11,letterSpacing:'0.04em',color:'var(--ink-4)',textTransform:'uppercase'}}>{t('em.cadence')}</span>
        <div style={{display:'flex',gap:4}}>
          {CADENCES.map(c => (
            <a key={c.id}
               onClick={() => setCadence(c.id)}
               className={'btn btn-sm ' + (cadence === c.id ? 'btn-primary' : 'btn-soft')}
               style={{padding:'6px 12px',fontSize:12}}>
              {t(c.key)}
            </a>
          ))}
        </div>
      </div>

      {/* Email envelope */}
      <div style={{padding:'18px 22px',borderBottom:'1px solid var(--line)',background:'var(--bg-soft)'}}>
        <div style={{display:'grid',gridTemplateColumns:'70px 1fr',rowGap:7,alignItems:'center',fontSize:13}}>
          <span className="dim mono" style={{fontSize:11}}>{t('em.draft.to')}</span>
          <span className="mono">{artist.tmEmail}</span>
          <span className="dim mono" style={{fontSize:11}}>{t('em.draft.cc')}</span>
          <span className="mono dim">advancing@electriccastle.ro · monday-cc@board.com</span>
          <span className="dim mono" style={{fontSize:11}}>{t('em.draft.subject')}</span>
          <span style={{fontWeight:600,color:'var(--ink-2)'}}>{subject}</span>
        </div>
      </div>

      {/* Email body */}
      <div style={{
        flex:1,padding:'28px 32px',
        fontSize:14,lineHeight:1.65,color:'var(--ink-2)',
        fontFamily:'Georgia, "Times New Roman", serif',
      }}>
        <p style={{marginTop:0}}>{t('em.draft.greeting', { firstName })}</p>
        <p style={{marginTop:14}}>
          {t('em.draft.lede', {
            artist: artist.name,
            stage: stage.name,
            date: showDate,
            time: artist.showTime,
          })}
        </p>

        <H4 t={t} k="em.h.party"/>
        <p>
          {t('em.body.party', {
            a: artist.party, c: artist.crew, tot: artist.party + artist.crew, r: artist.rooms,
          })}{' '}
          {artist.fields.partySize !== 'confirmed' && (
            <em style={{color:'var(--amber)'}}>{t('em.body.party.q')}</em>
          )}
        </p>

        {hotel && (<>
          <H4 t={t} k="em.h.hotel"/>
          <p>{t('em.body.hotel', { hotel: hotel.name, city: hotel.city })}</p>
        </>)}

        {(artist.travelMode === 'Flying' || artist.travelMode === 'Mixed') && (<>
          <H4 t={t} k="em.h.flights"/>
          {flightLegs ? (
            <p>
              {t('em.body.flights.have', { legs: flightLegs })}{' '}
              {artist.fields.flightDetails !== 'confirmed' && (
                <em style={{color:'var(--amber)'}}>{t('em.body.flights.q')}</em>
              )}
            </p>
          ) : (
            <p style={{color:'var(--st-stop)'}}>
              <em>{t('em.body.flights.none')}</em>
            </p>
          )}
        </>)}

        <H4 t={t} k="em.h.transfer"/>
        <p>
          {t('em.body.transfer')}
          {' '}
          {artist.fields.transfers !== 'confirmed' && (
            <em style={{color:'var(--amber)'}}>{t('em.body.transfer.pending')}</em>
          )}
        </p>

        {artist.fields.dietary !== 'confirmed' && (<>
          <H4 t={t} k="em.h.dietary"/>
          <p><em style={{color:'var(--amber)'}}>{t('em.body.dietary.q', { n: artist.party + artist.crew })}</em></p>
        </>)}

        <H4 t={t} k="em.h.next"/>
        <p>{t('em.body.next')}</p>

        <p style={{marginTop:22,whiteSpace:'pre-wrap'}}>{t('em.body.sign')}</p>
      </div>

      {/* Bottom hint */}
      <div style={{
        padding:'12px 22px',borderTop:'1px solid var(--line)',
        display:'flex',alignItems:'center',gap:14,
      }}>
        <span className="mono dim" style={{fontSize:11}}>
          DRAFT · regenerated from board state · {new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })}
        </span>
        <div style={{flex:1}}></div>
        <a className="btn btn-soft btn-sm">{t('em.draft.copy')}</a>
      </div>
    </div>
  );
}

function H4({ t, k }) {
  return <h4 style={{
    marginTop:22,marginBottom:6,
    fontFamily:'var(--font-display)',
    fontSize:13,letterSpacing:'0.08em',textTransform:'uppercase',
    color:'var(--ink-3)',fontWeight:600,
  }}>{t(k)}</h4>;
}

window.EmailView = EmailView;
