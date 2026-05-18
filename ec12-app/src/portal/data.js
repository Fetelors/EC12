// EC12 — Sample / mock data
// Used while Monday.com boards are not yet connected.
// Once MONDAY_CONFIG is filled in and boards are live,
// the Tracker view will pull live data instead of this.

window.STAGES = [
  { id: 'mainstage', name: 'Mainstage',     color: '#d52518' },
  { id: 'hangar',    name: 'Hangar',        color: '#ffb100' },
  { id: 'backyard',  name: 'Backyard',      color: '#9abc05' },
  { id: 'booha',     name: 'BOOHA',         color: '#f96015' },
  { id: 'hideout',   name: 'Hideout',       color: '#5b1830' },
  { id: 'beach',     name: 'The Beach',     color: '#0a8a82' },
  { id: 'pingpong',  name: 'Ping Pong',     color: '#cacc90' },
  { id: 'stables',   name: 'Stables',       color: '#18542a' },
];

window.HOTELS = [
  { id: 'radisson',   name: 'Radisson Blu',         tier: 'A-Party', city: 'Cluj' },
  { id: 'grand',      name: 'Grand Hotel Italia',   tier: 'A-Party', city: 'Cluj' },
  { id: 'doubletree', name: 'DoubleTree by Hilton', tier: 'A-Party', city: 'Cluj' },
  { id: 'platinia',   name: 'Platinia',              tier: 'B-Party', city: 'Cluj' },
  { id: 'opera',      name: 'Opera Plaza',           tier: 'A-Party', city: 'Cluj' },
  { id: 'hampton',    name: 'Hampton by Hilton',     tier: 'Crew',    city: 'Cluj' },
  { id: 'banffy',     name: 'Banffy Castle Estate',  tier: 'A-Party', city: 'Bonțida' },
];

window.STEPS = [
  { id: 's0', short: 'Contract', long: 'Contract signed',    owner: 'EC' },
  { id: 's1', short: 'Tech',     long: 'Tech rider',         owner: 'TM' },
  { id: 's2', short: 'Hosp',     long: 'Hospitality rider',  owner: 'TM' },
  { id: 's3', short: 'Hotel',    long: 'Accommodation',      owner: 'EC' },
  { id: 's4', short: 'Travel',   long: 'Travel & flights',   owner: 'TM' },
  { id: 's5', short: 'Arrivals', long: 'Arrivals confirmed', owner: 'EC' },
  { id: 's6', short: 'Load-in',  long: 'Load-in scheduled',  owner: 'EC' },
  { id: 's7', short: 'Complete', long: 'Advancing complete', owner: 'EC' },
];

// status codes: confirmed | partial | pending | needed | idle | blocked
window.ARTISTS = [
  {
    id: 'a01', name: 'NTHNG',        tier: 'Headliner',     origin: 'INT', stage: 'mainstage',
    showDate: '2026-07-17', showTime: '23:30', actType: 'Live',
    lead: 'Mara P.', bookedBy: 'Vlad M.',
    party: 14, crew: 9, rooms: 11,
    hotel: 'radisson', crewHotel: 'hampton',
    tmName: 'Lucas Beck', tmEmail: 'lucas@nthng-mgmt.com', tmPhone: '+44 7700 900123',
    travelMode: 'Flying',
    status: ['confirmed','confirmed','partial','confirmed','pending','needed','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'partial', dietary: 'pending',
      hotelDetails: 'confirmed', flightDetails: 'pending', transfers: 'needed',
    },
    flights: [
      { dir:'arr', no:'LH 1414', from:'FRA', to:'CLJ', date:'2026-07-16', time:'14:25', pax:9,  partyType:'A-Party', conf:'confirmed' },
      { dir:'arr', no:'KL 1379', from:'AMS', to:'CLJ', date:'2026-07-16', time:'16:10', pax:5,  partyType:'Crew',    conf:'pending'   },
      { dir:'dep', no:'LH 1415', from:'CLJ', to:'FRA', date:'2026-07-18', time:'15:40', pax:14, partyType:'A-Party', conf:'pending'   },
    ],
    internalNotes: '',
  },
  {
    id: 'a02', name: 'Hania Rani',   tier: 'Sub-headliner', origin: 'INT', stage: 'hangar',
    showDate: '2026-07-18', showTime: '21:00', actType: 'Live',
    lead: 'Sofia R.', bookedBy: 'Vlad M.',
    party: 8, crew: 6, rooms: 7,
    hotel: 'banffy', crewHotel: 'platinia',
    tmName: 'Iwo K.', tmEmail: 'iwo@haniarani.com', tmPhone: '+48 600 112 358',
    travelMode: 'Flying',
    status: ['confirmed','confirmed','confirmed','confirmed','confirmed','confirmed','partial','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'confirmed', transfers: 'partial',
    },
    flights: [
      { dir:'arr', no:'LO 583', from:'WAW', to:'CLJ', date:'2026-07-17', time:'12:50', pax:8, partyType:'A-Party', conf:'confirmed' },
      { dir:'dep', no:'LO 584', from:'CLJ', to:'WAW', date:'2026-07-19', time:'14:20', pax:8, partyType:'A-Party', conf:'confirmed' },
    ],
    internalNotes: '',
  },
  {
    id: 'a03', name: 'Bonobo',       tier: 'Headliner',     origin: 'INT', stage: 'mainstage',
    showDate: '2026-07-19', showTime: '00:30', actType: 'Live',
    lead: 'Mara P.', bookedBy: 'Andrei C.',
    party: 22, crew: 14, rooms: 18,
    hotel: 'grand', crewHotel: 'hampton',
    tmName: 'Beth Whitaker', tmEmail: 'beth@ninja-tune.com', tmPhone: '+44 7894 500 882',
    travelMode: 'Mixed',
    status: ['confirmed','partial','partial','partial','pending','idle','idle','idle'],
    fields: {
      partySize: 'partial', tmContact: 'confirmed', rider: 'partial', dietary: 'pending',
      hotelDetails: 'partial', flightDetails: 'pending', transfers: 'needed',
    },
    flights: [
      { dir:'arr', no:'BA 884',  from:'LHR', to:'OTP', date:'2026-07-18', time:'13:00', pax:12, partyType:'A-Party', conf:'partial'  },
      { dir:'arr', no:'TK 1043', from:'IST', to:'CLJ', date:'2026-07-18', time:'15:55', pax:6,  partyType:'A-Party', conf:'pending'  },
    ],
    internalNotes: '',
  },
  {
    id: 'a04', name: 'Floating Points', tier: 'Headliner', origin: 'INT', stage: 'hangar',
    showDate: '2026-07-17', showTime: '02:00', actType: 'DJ',
    lead: 'Sofia R.', bookedBy: 'Andrei C.',
    party: 4, crew: 1, rooms: 3,
    hotel: 'opera', crewHotel: null,
    tmName: 'Ross Allen', tmEmail: 'ross@samsupply.co.uk', tmPhone: '+44 7912 304 220',
    travelMode: 'Flying',
    status: ['confirmed','idle','partial','confirmed','confirmed','partial','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'partial', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'confirmed', transfers: 'partial',
    },
    flights: [
      { dir:'arr', no:'BA 884',  from:'LHR', to:'OTP', date:'2026-07-16', time:'13:00', pax:4, partyType:'A-Party', conf:'confirmed' },
      { dir:'dep', no:'LH 1415', from:'CLJ', to:'FRA', date:'2026-07-18', time:'06:00', pax:4, partyType:'A-Party', conf:'partial'   },
    ],
    internalNotes: '',
  },
  {
    id: 'a05', name: 'Sevdaliza',    tier: 'Sub-headliner', origin: 'INT', stage: 'mainstage',
    showDate: '2026-07-16', showTime: '22:30', actType: 'Live',
    lead: 'Mara P.', bookedBy: 'Vlad M.',
    party: 11, crew: 7, rooms: 9,
    hotel: 'doubletree', crewHotel: 'platinia',
    tmName: 'Yasmin El-Hadi', tmEmail: 'yasmin@sevdaliza.com', tmPhone: '+31 6 2200 8841',
    travelMode: 'Flying',
    status: ['confirmed','confirmed','confirmed','confirmed','partial','idle','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'partial', transfers: 'needed',
    },
    flights: [
      { dir:'arr', no:'KL 1379', from:'AMS', to:'CLJ', date:'2026-07-15', time:'16:10', pax:7, partyType:'A-Party', conf:'confirmed' },
      { dir:'arr', no:'OS 819',  from:'VIE', to:'CLJ', date:'2026-07-15', time:'17:50', pax:4, partyType:'Crew',    conf:'pending'   },
    ],
    internalNotes: '',
  },
  {
    id: 'a06', name: 'Salvador',     tier: 'Support',       origin: 'RO',  stage: 'backyard',
    showDate: '2026-07-17', showTime: '20:00', actType: 'Live',
    lead: 'Andrei C.', bookedBy: 'Andrei C.',
    party: 6, crew: 2, rooms: 4,
    hotel: 'platinia', crewHotel: null,
    tmName: 'Ioana Pop', tmEmail: 'ioana@salvador.ro', tmPhone: '+40 745 112 003',
    travelMode: 'Self-driving',
    status: ['confirmed','confirmed','confirmed','partial','confirmed','confirmed','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'partial',
      hotelDetails: 'partial', flightDetails: 'confirmed', transfers: 'confirmed',
    },
    flights: [],
    internalNotes: '',
  },
  {
    id: 'a07', name: 'KEEP',         tier: 'Support',       origin: 'RO',  stage: 'pingpong',
    showDate: '2026-07-18', showTime: '23:00', actType: 'DJ',
    lead: 'Andrei C.', bookedBy: 'Andrei C.',
    party: 3, crew: 1, rooms: 2,
    hotel: 'platinia', crewHotel: null,
    tmName: 'Tudor V.', tmEmail: 'tudor@keep-music.ro', tmPhone: '+40 723 880 145',
    travelMode: 'Self-driving',
    status: ['confirmed','idle','confirmed','confirmed','confirmed','idle','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'confirmed', transfers: 'pending',
    },
    flights: [],
    internalNotes: '',
  },
  {
    id: 'a08', name: 'Overmono',     tier: 'Headliner',     origin: 'INT', stage: 'hangar',
    showDate: '2026-07-19', showTime: '01:30', actType: 'Live',
    lead: 'Sofia R.', bookedBy: 'Vlad M.',
    party: 9, crew: 5, rooms: 7,
    hotel: 'opera', crewHotel: 'hampton',
    tmName: 'Ed Russell', tmEmail: 'ed@overmono-uk.com', tmPhone: '+44 7700 900008',
    travelMode: 'Flying',
    status: ['confirmed','partial','needed','pending','needed','idle','idle','idle'],
    fields: {
      partySize: 'pending', tmContact: 'confirmed', rider: 'partial', dietary: 'needed',
      hotelDetails: 'pending', flightDetails: 'needed', transfers: 'needed',
    },
    flights: [],
    internalNotes: '',
  },
  {
    id: 'a09', name: 'AURORA',       tier: 'Headliner',     origin: 'INT', stage: 'mainstage',
    showDate: '2026-07-18', showTime: '23:30', actType: 'Live',
    lead: 'Mara P.', bookedBy: 'Vlad M.',
    party: 16, crew: 11, rooms: 13,
    hotel: 'banffy', crewHotel: 'doubletree',
    tmName: 'Anette Rygg', tmEmail: 'anette@aurora-mgmt.no', tmPhone: '+47 920 12 478',
    travelMode: 'Flying',
    status: ['confirmed','confirmed','confirmed','confirmed','confirmed','partial','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'confirmed', transfers: 'partial',
    },
    flights: [
      { dir:'arr', no:'SK 4737', from:'OSL', to:'CLJ', date:'2026-07-17', time:'15:30', pax:16, partyType:'A-Party', conf:'confirmed' },
      { dir:'dep', no:'SK 4738', from:'CLJ', to:'OSL', date:'2026-07-19', time:'17:00', pax:16, partyType:'A-Party', conf:'partial'   },
    ],
    internalNotes: '',
  },
  {
    id: 'a10', name: 'Black Coffee', tier: 'Headliner',     origin: 'INT', stage: 'hangar',
    showDate: '2026-07-16', showTime: '02:30', actType: 'DJ',
    lead: 'Sofia R.', bookedBy: 'Vlad M.',
    party: 5, crew: 2, rooms: 4,
    hotel: 'grand', crewHotel: null,
    tmName: 'Sibu Mabena', tmEmail: 'sibu@blackcoffee.co.za', tmPhone: '+27 82 412 9001',
    travelMode: 'Flying',
    status: ['confirmed','idle','blocked','partial','pending','idle','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'blocked', dietary: 'partial',
      hotelDetails: 'partial', flightDetails: 'pending', transfers: 'needed',
    },
    flights: [],
    internalNotes: '',
  },
  {
    id: 'a11', name: 'Ploho',        tier: 'Sub-headliner', origin: 'INT', stage: 'booha',
    showDate: '2026-07-17', showTime: '23:00', actType: 'Live',
    lead: 'Andrei C.', bookedBy: 'Vlad M.',
    party: 7, crew: 4, rooms: 5,
    hotel: 'platinia', crewHotel: 'hampton',
    tmName: 'Vyacheslav K.', tmEmail: 'slava@ploho-mgmt.com', tmPhone: '+995 599 11 22 33',
    travelMode: 'Nightliner',
    status: ['confirmed','partial','pending','partial','confirmed','idle','idle','idle'],
    fields: {
      partySize: 'partial', tmContact: 'confirmed', rider: 'partial', dietary: 'pending',
      hotelDetails: 'partial', flightDetails: 'confirmed', transfers: 'partial',
    },
    flights: [],
    internalNotes: '',
  },
  {
    id: 'a12', name: 'Berlioz',      tier: 'Support',       origin: 'INT', stage: 'beach',
    showDate: '2026-07-16', showTime: '18:00', actType: 'DJ',
    lead: 'Sofia R.', bookedBy: 'Andrei C.',
    party: 2, crew: 0, rooms: 1,
    hotel: 'opera', crewHotel: null,
    tmName: 'Jean-Marie L.', tmEmail: 'jm@berlioz.fr', tmPhone: '+33 6 14 22 90 11',
    travelMode: 'Flying',
    status: ['confirmed','idle','confirmed','confirmed','confirmed','confirmed','partial','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'confirmed', transfers: 'confirmed',
    },
    flights: [
      { dir:'arr', no:'AF 1284', from:'CDG', to:'OTP', date:'2026-07-15', time:'14:10', pax:2, partyType:'A-Party', conf:'confirmed' },
    ],
    internalNotes: '',
  },
  {
    id: 'a13', name: 'Soartișor',    tier: 'Local',         origin: 'Local', stage: 'stables',
    showDate: '2026-07-17', showTime: '19:00', actType: 'Live',
    lead: 'Andrei C.', bookedBy: 'Andrei C.',
    party: 4, crew: 1, rooms: 0,
    hotel: null, crewHotel: null,
    tmName: 'Direct', tmEmail: 'soartisor@gmail.com', tmPhone: '+40 745 220 110',
    travelMode: 'Self-driving',
    status: ['confirmed','confirmed','confirmed','idle','confirmed','idle','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'confirmed', dietary: 'idle',
      hotelDetails: 'idle', flightDetails: 'idle', transfers: 'idle',
    },
    flights: [],
    internalNotes: '',
  },
  {
    id: 'a14', name: 'Kelela',       tier: 'Headliner',     origin: 'INT', stage: 'hideout',
    showDate: '2026-07-18', showTime: '01:00', actType: 'Live',
    lead: 'Mara P.', bookedBy: 'Andrei C.',
    party: 12, crew: 8, rooms: 9,
    hotel: 'grand', crewHotel: 'platinia',
    tmName: 'Asma Maroof', tmEmail: 'asma@kelela.com', tmPhone: '+1 213 555 8421',
    travelMode: 'Flying',
    status: ['confirmed','confirmed','partial','confirmed','partial','idle','idle','idle'],
    fields: {
      partySize: 'confirmed', tmContact: 'confirmed', rider: 'partial', dietary: 'confirmed',
      hotelDetails: 'confirmed', flightDetails: 'partial', transfers: 'needed',
    },
    flights: [
      { dir:'arr', no:'LH 1414', from:'FRA', to:'CLJ', date:'2026-07-17', time:'14:25', pax:12, partyType:'A-Party', conf:'partial' },
    ],
    internalNotes: '',
  },
];

window.LEADS = ['Mara P.', 'Sofia R.', 'Andrei C.', 'Vlad M.'];

// Festival angels — assigned deterministically per artist as hospitality liaison
window.ANGELS = [
  { name: 'Ioana D.',    phone: '+40 723 991 002', langs: 'EN · RO · FR' },
  { name: 'Bogdan T.',   phone: '+40 728 451 770', langs: 'EN · RO · DE' },
  { name: 'Smaranda V.', phone: '+40 745 220 118', langs: 'EN · RO · ES' },
  { name: 'Tudor L.',    phone: '+40 731 884 905', langs: 'EN · RO · IT' },
  { name: 'Andra M.',    phone: '+40 749 615 332', langs: 'EN · RO · FR' },
  { name: 'Cristi A.',   phone: '+40 722 740 088', langs: 'EN · RO · DE' },
  { name: 'Iulia R.',    phone: '+40 726 559 412', langs: 'EN · RO · ES' },
  { name: 'Matei P.',    phone: '+40 738 902 567', langs: 'EN · RO · FR' },
];

// Assign an angel to every artist (idempotent — safe to call multiple times)
window.ARTISTS.forEach((a, i) => {
  if (!a.angel) {
    const ag = window.ANGELS[i % window.ANGELS.length];
    a.angel  = `${ag.name} (${ag.phone})`;
    a.angelLangs = ag.langs;
  }
});

window.FESTIVAL_INFO = {
  name:     'Electric Castle 12',
  edition:  'EC12',
  dates:    '15–19 July 2026',
  location: 'Banffy Castle, Bonțida, Cluj-Napoca, Romania',
  airport:  'CLJ — Cluj-Napoca International (alt: OTP — Bucharest)',
};
