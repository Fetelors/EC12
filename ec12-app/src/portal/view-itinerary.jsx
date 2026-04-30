// AIdvancing — Artist itinerary microsite
// Two screens: passcode lock + premium itinerary

function ItineraryView({ t, initialArtistId }) {
  const artists = window.ARTISTS;
  const [selId, setSelId] = useState(initialArtistId || 'a01');
  const artist = artists.find(a => a.id === selId);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');

  // When artist changes, lock again
  useEffect(() => {
    setUnlocked(false);
    setPin('');
  }, [selId]);

  return (
    <main className="page">
      <PageHero
        eyebrow="// itinerary microsite · artist-facing · sent on day 5"
        title="What the artist sees, <em>before they land.</em>"
        sub="A passcode-gated microsite. Same data, premium voice. Below is a live preview — pick an artist to render their weekend."
        right={
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
            <span className="mono dim" style={{fontSize:11}}>PREVIEW · ARTIST</span>
            <select
              value={selId}
              onChange={e => setSelId(e.target.value)}
              className="field field-mono"
              style={{minWidth:220,paddingTop:8,paddingBottom:8}}>
              {artists.slice(0, 12).map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <span className="mono dim" style={{fontSize:10}}>PIN preview: <strong style={{color:'var(--ink-2)'}}>4827</strong></span>
          </div>
        }
      />

      <div style={{marginTop:32,marginBottom:48}}>
        <div style={{
          borderRadius:'var(--r-xl)',
          overflow:'hidden',
          border:'1px solid var(--line)',
          boxShadow:'0 30px 80px -40px rgba(10,10,10,0.30), 0 12px 30px -12px rgba(10,10,10,0.10)',
          background: unlocked ? 'transparent' : 'rgba(10,10,10,0.92)',
          minHeight: 720,
          position: 'relative',
        }}>
          {!unlocked
            ? <PinGate artist={artist} pin={pin} setPin={setPin} onUnlock={() => setUnlocked(true)} t={t}/>
            : <ItineraryContent artist={artist} t={t}/>
          }
        </div>
      </div>
    </main>
  );
}

// --- Passcode lock screen ---
function PinGate({ artist, pin, setPin, onUnlock, t }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' && pin.length === 4) onUnlock();
  };

  return (
    <div style={{
      minHeight: 720,
      display:'flex',alignItems:'center',justifyContent:'center',
      background: 'radial-gradient(circle at 30% 30%, rgba(10,163,154,0.35), transparent 50%), radial-gradient(circle at 70% 70%, rgba(37,99,235,0.30), transparent 50%), #0d0d0c',
      color:'#f5f3ee',
      padding: 60,
      position:'relative',
    }}>
      {/* Tiny EC mark */}
      <div style={{position:'absolute',top:32,left:32,display:'flex',alignItems:'center',gap:10,fontFamily:'var(--font-display)',fontWeight:600,fontSize:15,letterSpacing:'-0.01em'}}>
        <span style={{width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,var(--teal),var(--lime))'}}></span>
        ELECTRIC CASTLE 12 · ARTIST PORTAL
      </div>

      <div style={{maxWidth:480,textAlign:'center'}}>
        <div className="mono" style={{fontSize:11,letterSpacing:'0.12em',opacity:0.6,marginBottom:24}}>
          ARTIST · {artist.name.toUpperCase()}
        </div>
        <h1 style={{
          fontFamily:'var(--font-display)',
          fontSize: 56,lineHeight:0.98,letterSpacing:'-0.035em',
          fontWeight:500,margin:0,marginBottom:18,
          textWrap:'balance',
        }}>
          {t('it.lock.title', { artist: artist.name })}
        </h1>
        <p style={{fontSize:16,lineHeight:1.5,opacity:0.7,marginBottom:36}}>
          {t('it.lock.sub')}
        </p>

        {/* PIN input */}
        <div style={{
          display:'flex',gap:10,justifyContent:'center',marginBottom:24,
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width:54,height:60,borderRadius:14,
              background:'rgba(245,243,238,0.06)',
              border:'1px solid rgba(245,243,238,' + (pin.length === i ? '0.5' : '0.14') + ')',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:24,fontWeight:500,fontFamily:'var(--font-display)',
              transition:'all .15s',
            }}>{pin[i] ? '•' : ''}</div>
          ))}
        </div>

        <input
          type="text"
          value={pin}
          autoFocus
          maxLength={4}
          onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,4))}
          onKeyDown={handleKey}
          placeholder="0000"
          style={{
            width:200,padding:'12px 16px',borderRadius:100,
            border:'1px solid rgba(245,243,238,0.2)',
            background:'rgba(245,243,238,0.08)',
            color:'#f5f3ee',outline:'none',
            fontFamily:'var(--font-mono)',fontSize:14,letterSpacing:'0.4em',
            textAlign:'center',
          }}/>

        <div style={{marginTop:24,display:'flex',justifyContent:'center',gap:10}}>
          <a className="btn btn-primary"
             onClick={() => pin.length === 4 && onUnlock()}
             style={{
               background:'#f5f3ee',color:'#0d0d0c',
               opacity: pin.length === 4 ? 1 : 0.4,
               cursor: pin.length === 4 ? 'pointer' : 'not-allowed',
             }}>
            {t('it.lock.unlock')}
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M3 7h8m-3-3l3 3-3 3"/></svg>
          </a>
        </div>

        <p style={{marginTop:32,fontSize:12,opacity:0.5}}>{t('it.lock.hint')}</p>
      </div>
    </div>
  );
}

// --- The premium itinerary ---
function ItineraryContent({ artist, t }) {
  const stage = window.STAGES.find(s => s.id === artist.stage);
  const hotel = window.HOTELS.find(h => h.id === artist.hotel);
  const arr = (artist.flights || []).filter(f => f.dir === 'arr')[0];
  const dep = (artist.flights || []).filter(f => f.dir === 'dep')[0];

  return (
    <div style={{position:'relative',background:'var(--paper)'}}>
      {/* Hero — pink/teal/lime bloom on white */}
      <div style={{
        padding:'80px 60px 60px',
        position:'relative',
        background:`
          radial-gradient(circle at 15% 20%, rgba(10,163,154,0.18), transparent 50%),
          radial-gradient(circle at 80% 30%, rgba(163,212,55,0.22), transparent 50%),
          radial-gradient(circle at 60% 90%, rgba(37,99,235,0.13), transparent 60%),
          var(--paper)
        `,
        overflow:'hidden',
      }}>
        <div style={{
          display:'flex',alignItems:'center',gap:10,
          fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,letterSpacing:'-0.01em',
          marginBottom:40,
        }}>
          <span style={{width:10,height:10,borderRadius:'50%',background:'linear-gradient(135deg,var(--teal),var(--lime))'}}></span>
          ELECTRIC CASTLE 12
        </div>

        <div className="mono" style={{fontSize:11,letterSpacing:'0.12em',color:'var(--ink-3)',marginBottom:28}}>
          {t('it.eyebrow')} · BONȚIDA, ROMANIA · 16 — 19 JULY 2026
        </div>

        <h1 style={{
          fontFamily:'var(--font-display)',
          fontSize: 'clamp(56px, 7vw, 96px)',
          lineHeight: 0.95, letterSpacing: '-0.04em', fontWeight: 500,
          margin:'0 0 24px',
          maxWidth: 900, textWrap:'balance',
        }} dangerouslySetInnerHTML={{__html: t('it.headline', { artist: artist.name })}}></h1>

        <p style={{fontSize:20,color:'var(--ink-3)',maxWidth:560,lineHeight:1.45,marginBottom:0}}>
          {t('it.tagline')}
        </p>

        {/* Top-line stats */}
        <div style={{
          marginTop: 56, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 0,
          paddingTop:28,borderTop:'1px solid var(--line)',
        }}>
          <ItStat label="STAGE" value={stage.name} mono/>
          <ItStat label="SHOW DAY" value={new Date(artist.showDate).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'long'})} mono/>
          <ItStat label="SET TIME" value={artist.showTime}/>
          <ItStat label="PARTY" value={`${artist.party} A-party · ${artist.crew} crew`} mono last/>
        </div>
      </div>

      {/* Day-by-day schedule */}
      <ItSection title={t('it.h.arrival')} day={t('it.day.thu')}>
        {arr ? (
          <ItDetailRow
            time={arr.time}
            head={`${arr.no} · ${arr.from} → ${arr.to}`}
            sub={`${arr.pax} pax · arriving from ${arr.from}`}
            tail="Pickup at gate by Bogdan T. (+40 728 451 770)"
          />
        ) : (
          <ItDetailRow
            time="—"
            head="Self-driving"
            sub={`${artist.travelMode} · arrival flexible`}
            tail="Park at Banffy Castle · pass at gate"
          />
        )}
      </ItSection>

      <ItSection title={t('it.h.hotel')} day={hotel ? hotel.tier : ''}>
        {hotel && (
          <ItDetailRow
            time="14:00"
            head={hotel.name}
            sub={`${hotel.city} · ${artist.rooms} rooms · 3 nights`}
            tail="Breakfast 06:30 — 10:30 · gym & spa included"
          />
        )}
      </ItSection>

      <ItSection title={t('it.h.show')} day={new Date(artist.showDate).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}>
        <ItDetailRow time="14:00" head={t('it.show.gates')} sub="Festival doors open" tail=""/>
        <ItDetailRow time={subtractHours(artist.showTime, 4)} head={t('it.show.sound')} sub={`${stage.name} · 60 min slot`} tail="Stage manager: Vlad I."/>
        <ItDetailRow time={artist.showTime} head={t('it.show.set')} sub={`${stage.name} · 75 min`} tail="Audio engineer: Marko · Lighting: Ada" highlight/>
        <ItDetailRow time={subtractHours(artist.showTime, -2)} head={t('it.show.curfew')} sub="All stages · 04:00 max" tail=""/>
      </ItSection>

      <ItSection title={t('it.h.depart')} day={t('it.day.sat')}>
        {dep ? (
          <ItDetailRow
            time={dep.time}
            head={`${dep.no} · ${dep.from} → ${dep.to}`}
            sub={`${dep.pax} pax · departure leg`}
            tail={`Pickup at hotel ${subtractHours(dep.time, 3)} · drive ~25 min`}
          />
        ) : (
          <ItDetailRow time="—" head="Departure TBC" sub="" tail=""/>
        )}
      </ItSection>

      {/* Runner card */}
      <div style={{padding:'0 60px 80px'}}>
        <div className="card-frosted" style={{
          padding:32,marginTop:8,
          background:'linear-gradient(135deg, rgba(10,163,154,0.08), rgba(163,212,55,0.05))',
          border:'1px solid rgba(10,163,154,0.18)',
        }}>
          <div className="mono" style={{fontSize:11,letterSpacing:'0.06em',color:'var(--teal)',marginBottom:14,fontWeight:600}}>
            {t('it.h.runner').toUpperCase()}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <div style={{
              width:64,height:64,borderRadius:'50%',
              background:'linear-gradient(135deg,var(--teal),var(--blue))',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:'white',fontFamily:'var(--font-display)',fontWeight:600,fontSize:24,
              flexShrink:0,
            }}>SV</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:500,letterSpacing:'-0.02em',marginBottom:4}}>
                Smaranda V.
              </div>
              <div className="mono" style={{fontSize:12,color:'var(--ink-3)'}}>
                {t('it.runner.role')} · +40 728 100 471 · smaranda@electriccastle.ro
              </div>
              <div style={{fontSize:13,color:'var(--ink-3)',marginTop:4}}>
                {t('it.runner.note')}
              </div>
            </div>
            <a className="btn btn-primary btn-sm" style={{flexShrink:0}}>WhatsApp</a>
          </div>
        </div>

        {/* Footer */}
        <div style={{marginTop:32,paddingTop:24,borderTop:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span className="mono dim" style={{fontSize:11,letterSpacing:'0.04em'}}>
            ELECTRIC CASTLE 12 · ARTIST PORTAL · v3
          </span>
          <span className="mono dim" style={{fontSize:11,letterSpacing:'0.04em'}}>
            UPDATED 14:32 · LIVE
          </span>
        </div>
      </div>
    </div>
  );
}

function ItStat({ label, value, mono, last }) {
  return (
    <div style={{
      paddingRight: last ? 0 : 24,
      borderRight: last ? 'none' : '1px solid var(--line)',
    }}>
      <div className="mono" style={{fontSize:10,letterSpacing:'0.06em',color:'var(--ink-4)',fontWeight:500,marginBottom:8}}>{label}</div>
      <div style={{
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        fontSize: mono ? 16 : 24,
        fontWeight: mono ? 500 : 500,
        letterSpacing:'-0.01em',
        color:'var(--ink)',
      }}>{value}</div>
    </div>
  );
}

function ItSection({ title, day, children }) {
  return (
    <section style={{padding:'40px 60px',borderTop:'1px solid var(--line)'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:24}}>
        <div className="mono" style={{fontSize:11,letterSpacing:'0.06em',color:'var(--ink-4)',fontWeight:500,minWidth:120}}>
          {day || ''}
        </div>
        <h3 style={{
          fontFamily:'var(--font-display)',fontSize:36,
          letterSpacing:'-0.025em',fontWeight:500,margin:0,
          color:'var(--ink)',
        }}>{title}</h3>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:0}}>
        {children}
      </div>
    </section>
  );
}

function ItDetailRow({ time, head, sub, tail, highlight }) {
  return (
    <div style={{
      display:'grid',gridTemplateColumns:'120px 1fr 1fr',gap:24,
      padding:'18px 0',
      borderTop:'1px solid var(--line)',
      alignItems:'baseline',
      background: highlight ? 'rgba(10,163,154,0.04)' : 'transparent',
      paddingLeft: highlight ? 16 : 0,
      paddingRight: highlight ? 16 : 0,
      borderLeft: highlight ? '2px solid var(--teal)' : 'none',
      marginLeft: highlight ? -16 : 0,
    }}>
      <div className="mono" style={{fontSize:18,fontWeight:500,color: highlight ? 'var(--teal)' : 'var(--ink-2)',letterSpacing:'-0.01em'}}>{time}</div>
      <div>
        <div style={{fontSize:18,fontWeight:500,color:'var(--ink)',letterSpacing:'-0.01em',marginBottom:3}}>{head}</div>
        {sub && <div style={{fontSize:13,color:'var(--ink-3)'}}>{sub}</div>}
      </div>
      <div className="mono dim" style={{fontSize:12,paddingTop:5}}>{tail}</div>
    </div>
  );
}

function subtractHours(timeStr, h) {
  const [hh, mm] = timeStr.split(':').map(n => parseInt(n, 10));
  let total = hh * 60 + mm - h * 60;
  total = ((total % 1440) + 1440) % 1440;
  const out = String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  return out;
}

window.ItineraryView = ItineraryView;
