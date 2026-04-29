// EC12 — Monday.com Column ID Map
// Update these IDs to match your actual Monday.com board columns.
// Find column IDs: open Monday.com API explorer → run the query in config/get-columns.graphql

const MONDAY_CONFIG = {

  // ── ARTISTS BOARD ──────────────────────────────────────────────
  // The main board — one item per artist.
  ARTISTS_BOARD_ID: '',           // e.g. '1234567890'

  ARTIST_COLS: {
    tier:       'text1__1',       // Headliner / Sub-headliner / Support / Local
    lead:       'person',         // Advancing lead (people column)
    bookedBy:   'person2',        // Booked by (people column)
    origin:     'text3__1',       // Int / RO / Local
    partySize:  'numbers',        // A-Party size (number)
    tmName:     'text_tm_name',   // Tour Manager name
    tmEmail:    'email_tm',       // Tour Manager email
    tmPhone:    'phone_tm',       // Tour Manager phone
    dietary:    'long_text02__1', // Dietary requirements
    riderFile:  'files__1',       // Initial rider (file column)
    ccEmail:    'text54__1',      // Monday CC email for artist item

    // 8 advancing status steps
    s0: 'status0__1',   // Step 0: Contract signed
    s1: 'status1__1',   // Step 1: Tech rider
    s2: 'status2__1',   // Step 2: Hospitality rider
    s3: 'status3__1',   // Step 3: Accommodation
    s4: 'status4__1',   // Step 4: Travel
    s5: 'status5__1',   // Step 5: Arrivals
    s6: 'status6__1',   // Step 6: Load-in
    s7: 'status7__1',   // Step 7: Completed

    // Linked boards
    flightsLink:    'connect_boards3__1', // Arrivals (linked flights board)
    hotelsLink:     'board_relation7',    // Hotel (linked hotels board)
    transfersLink:  'connect_boards4__1', // Ground transfers board link
    scheduleLink:   'connect_boards5__1', // Schedule board link

    // Field tracking — three-state per data point: asked → partial → confirmed
    // 'partial' means some sub-information received but not everything
    // (e.g. arrival flight confirmed, departure still pending)
    // Format: { asked, partial, confirmed } — all are date column IDs
    fieldTracking: {
      hotelDetails:  { asked: 'date_hotel_asked',  partial: 'date_hotel_partial',  confirmed: 'date_hotel_conf'  },
      flightDetails: { asked: 'date_flight_asked', partial: 'date_flight_partial', confirmed: 'date_flight_conf' },
      rider:         { asked: 'date_rider_asked',  partial: 'date_rider_partial',  confirmed: 'date_rider_conf'  },
      dietary:       { asked: 'date_diet_asked',   partial: 'date_diet_partial',   confirmed: 'date_diet_conf'   },
      partySize:     { asked: 'date_party_asked',  partial: null,                  confirmed: 'date_party_conf'  },
      tmContact:     { asked: 'date_tm_asked',     partial: null,                  confirmed: 'date_tm_conf'     },
      transfers:     { asked: 'date_trans_asked',  partial: 'date_trans_partial',  confirmed: 'date_trans_conf'  },
    },
  },

  // ── SCHEDULE / PROGRAMME BOARD ─────────────────────────────────
  // One item per performance slot.
  SCHEDULE_BOARD_ID: '',

  SCHEDULE_COLS: {
    stage:         'text_stage',      // Stage name
    date:          'date4',           // Performance date
    startTime:     'hour',            // Start time
    endTime:       'hour2',           // End time
    duration:      'numbers2',        // Duration (mins)
    soundcheck:    'date_soundcheck', // Soundcheck date+time
    artistLink:    'connect_boards1', // Linked artist item
    artistName:    'text_artist',     // Artist name (mirror or direct)
    setType:       'status_set',      // Live / DJ / Back2Back
    notes:         'long_text_notes',
  },

  // ── FLIGHTS BOARD ──────────────────────────────────────────────
  // One item per flight leg (arrival or departure).
  FLIGHTS_BOARD_ID: '',

  FLIGHT_COLS: {
    flightNumber:  'text_flight_no',
    airline:       'text_airline',
    direction:     'status_direction', // Arrival / Departure
    date:          'date4',
    time:          'hour',
    airport:       'text_airport',     // CLJ / OTP / etc.
    terminal:      'text_terminal',
    artistLink:    'connect_boards1',
    passengers:    'text_passengers',  // Names of travellers on this flight
    partyType:     'status_party',     // A-Party / B-Party / Crew / Driver
    groundPickup:  'connect_boards2',  // Linked transfer item
  },

  // ── HOTELS BOARD ───────────────────────────────────────────────
  // One item per hotel booking block per artist.
  HOTELS_BOARD_ID: '',

  HOTEL_COLS: {
    hotelName:     'text_hotel_name',
    tier:          'status_tier',      // A-Party / B-Party / Crew / Driver
    checkIn:       'date_checkin',
    checkOut:      'date_checkout',
    roomCount:     'numbers_rooms',
    roomType:      'text_room_type',
    artistLink:    'connect_boards1',
    liaisonName:   'text_liaison',
    liaisonEmail:  'email_liaison',
    notes:         'long_text_notes',
  },

  // ── GROUND TRANSFERS BOARD ─────────────────────────────────────
  TRANSFERS_BOARD_ID: '',

  TRANSFER_COLS: {
    date:          'date4',
    time:          'hour',
    from:          'text_from',
    to:            'text_to',
    duration:      'text_duration',
    driver:        'text_driver',
    driverPhone:   'phone_driver',
    vehicle:       'text_vehicle',
    seats:         'numbers_seats',
    artistLink:    'connect_boards1',
    flightLink:    'connect_boards2',
    notes:         'text_notes',
  },
};

// Export for use in all components (in Apps Script: just include this file)
if (typeof module !== 'undefined') module.exports = MONDAY_CONFIG;
