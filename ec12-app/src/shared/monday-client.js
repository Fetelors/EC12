// ════════════════════════════════════════════════════════════════════════════
// EC12 — Shared Monday.com API Client
// ════════════════════════════════════════════════════════════════════════════
//
// Every component (Artist Overview, Email, Schedule, Arrivals, Itinerary)
// imports this one file instead of each writing its own Monday.com code.
// That means if Monday.com changes their API, we fix it in one place only.
//
// HOW MONDAY.COM'S API WORKS (the short version):
//   Monday uses "GraphQL" — instead of separate URLs for each thing you want,
//   you send ONE request to ONE URL, and describe exactly what you want in
//   the request body. Think of it like ordering at a restaurant: you don't go
//   to different counters for each dish — you give one order that lists everything.
//
//   The URL is always: https://api.monday.com/v2
//   You always POST to it with your API key in the headers.
//   Your "query" is a string that describes what you want back.
//
// HOW THIS FILE IS STRUCTURED:
//   1. Config       — reads your API key + board IDs from browser localStorage
//   2. Core request — the single function that talks to Monday.com
//   3. Fetch helpers — convenience functions to get boards and items
//   4. Write helpers — functions to update, create data in Monday.com
//   5. Value builders — helpers to format data in the shape Monday.com expects
//   6. Value readers  — helpers to extract readable data from Monday.com's responses
//   7. Two-state logic — the "asked / confirmed" system for the Email Draft Center
//
// ════════════════════════════════════════════════════════════════════════════

// We wrap everything in an IIFE (Immediately Invoked Function Expression).
// This is a pattern that keeps all our variables private — nothing inside
// can be accidentally overwritten by other scripts on the page.
// The `MondayClient` variable at the end is the only thing exposed publicly.
const MondayClient = (() => {

  // ── 1. CONFIG ─────────────────────────────────────────────────────────────
  //
  // We store the API key and board IDs in the browser's localStorage.
  // localStorage is like a small key-value database that lives in the browser
  // and persists between page refreshes (unlike normal JS variables which reset).
  //
  // We store everything under one key ('ec12_cfg') as a JSON object,
  // so the user only has to configure once via the settings panel.

  const ENDPOINT  = 'https://api.monday.com/v2';  // Monday's single API endpoint
  const API_VER   = '2024-01';                     // which version of their API to use

  // cfg() reads the saved config from localStorage every time it's called.
  // We re-read each time (instead of caching) so changes in the settings panel
  // take effect immediately without needing a page refresh.
  function cfg() {
    try {
      return JSON.parse(localStorage.getItem('ec12_cfg') || '{}');
    } catch {
      return {}; // if the stored value is somehow broken JSON, return empty object
    }
  }

  function apiKey() { return cfg().apiKey || ''; }

  // ready() is used by components to check "can I even talk to Monday right now?"
  // before trying to fetch data. If false, show a "please configure API key" message.
  function ready() { return !!apiKey(); }


  // ── 2. CORE REQUEST ───────────────────────────────────────────────────────
  //
  // This is the ONE function that actually talks to Monday.com.
  // Everything else in this file calls this function.
  //
  // Parameters:
  //   gql       — the GraphQL query string (what you want to fetch or change)
  //   variables — optional object of variables referenced inside the query
  //               (using variables instead of string-building prevents injection bugs)

  async function query(gql, variables = {}) {
    if (!ready()) throw new Error('Monday.com API key not configured.');

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': apiKey(),   // Monday uses the API key directly as the auth header
        'API-Version':   API_VER,    // tells Monday which version of their API we expect
      },
      body: JSON.stringify({
        query:     gql,
        variables: variables,
      }),
    });

    // fetch() only throws on network failure — a 400/500 response still "succeeds"
    // so we have to check the HTTP status ourselves.
    if (!response.ok) {
      throw new Error(`Monday.com API returned HTTP ${response.status}`);
    }

    const json = await response.json();

    // Monday.com can return HTTP 200 but still include errors in the response body.
    // This happens when the GraphQL query itself has a problem (wrong field name, etc.)
    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    return json.data; // the actual data we asked for lives under `.data`
  }


  // ── 3. FETCH HELPERS ──────────────────────────────────────────────────────
  //
  // These are convenience wrappers around query() for the most common reads.

  // fetchBoard: get all items from a board, with whichever columns you specify.
  //
  // Why specify column IDs? Monday boards can have 50+ columns.
  // Fetching all of them every time would be slow and wasteful.
  // We only ask for the columns each component actually needs.
  //
  // Parameters:
  //   boardId   — the numeric ID of the Monday.com board (from the URL)
  //   columnIds — array of column ID strings, e.g. ['status0__1', 'text1__1']
  //               pass an empty array to get ALL columns (slower, use sparingly)

  async function fetchBoard(boardId, columnIds = []) {
    if (!boardId) throw new Error('fetchBoard: boardId is required.');

    // Build the column_values part of the query.
    // If we have specific IDs, filter to just those. Otherwise get everything.
    const colSelector = columnIds.length
      ? `column_values(ids: ${JSON.stringify(columnIds)}) { id text value }`
      : `column_values { id text value }`;

    // limit: 500 means fetch up to 500 items per request.
    // EC12 won't have more than ~200 artists so this is safe for now.
    // If you ever exceed 500, you'd need pagination (items_page has a cursor for this).
    const gql = `{
      boards(ids: [${boardId}]) {
        items_page(limit: 500) {
          items {
            id
            name
            ${colSelector}
          }
        }
      }
    }`;

    const data = await query(gql);
    return data?.boards?.[0]?.items_page?.items || [];
    // The ?. is "optional chaining" — if any part of the chain is null/undefined,
    // it returns undefined instead of throwing an error. The || [] means
    // "if we got undefined, return an empty array instead".
  }

  // fetchItem: get a single item by its ID.
  // Used when you already know which artist/flight/hotel you're looking at
  // (e.g. clicking into an artist's detail panel).

  async function fetchItem(itemId, columnIds = []) {
    const colSelector = columnIds.length
      ? `column_values(ids: ${JSON.stringify(columnIds)}) { id text value }`
      : `column_values { id text value }`;

    const gql = `{
      items(ids: [${itemId}]) {
        id
        name
        ${colSelector}
      }
    }`;

    const data = await query(gql);
    return data?.items?.[0] || null;
  }


  // ── 4. WRITE HELPERS ──────────────────────────────────────────────────────
  //
  // In GraphQL, reads are called "queries" and writes are called "mutations".
  // These helpers wrap the most common write operations.

  // updateColumn: change the value of one column on one item.
  //
  // Parameters:
  //   boardId  — which board the item is on
  //   itemId   — which item (artist, flight, etc.) to update
  //   columnId — which column to change (e.g. 'status0__1')
  //   value    — the new value, formatted using the val.* helpers below

  async function updateColumn(boardId, itemId, columnId, value) {
    // $board, $item, $col, $val are GraphQL variables — they get filled in
    // from the `variables` object we pass to query(). This is safer than
    // building the string directly (avoids injection if values contain quotes).
    const gql = `
      mutation($board: ID!, $item: ID!, $col: String!, $val: JSON!) {
        change_column_value(
          board_id:  $board,
          item_id:   $item,
          column_id: $col,
          value:     $val
        ) { id }
      }
    `;

    return query(gql, {
      board: String(boardId),   // Monday expects IDs as strings in variables
      item:  String(itemId),
      col:   columnId,
      val:   JSON.stringify(value), // Monday expects the value as a JSON *string*
    });
  }

  // updateColumns: change multiple columns at once in a single API call.
  // More efficient than calling updateColumn() in a loop.
  //
  // Parameters:
  //   columnValues — plain object: { columnId: value, columnId: value, ... }
  //                  e.g. { 'date_asked': { date: '2026-04-29' }, 'text_tm': 'John' }

  async function updateColumns(boardId, itemId, columnValues) {
    const gql = `
      mutation($board: ID!, $item: ID!, $vals: JSON!) {
        change_multiple_column_values(
          board_id:      $board,
          item_id:       $item,
          column_values: $vals
        ) { id }
      }
    `;

    return query(gql, {
      board: String(boardId),
      item:  String(itemId),
      vals:  JSON.stringify(columnValues),
    });
  }

  // createItem: add a new row to a board.
  // Used when a new flight or hotel booking needs to be logged.
  //
  // Parameters:
  //   name         — the item name (the first column, always required in Monday)
  //   columnValues — object of initial column values (same format as updateColumns)

  async function createItem(boardId, name, columnValues = {}) {
    const gql = `
      mutation($board: ID!, $name: String!, $vals: JSON!) {
        create_item(
          board_id:      $board,
          item_name:     $name,
          column_values: $vals
        ) { id }
      }
    `;

    return query(gql, {
      board: String(boardId),
      name:  name,
      vals:  JSON.stringify(columnValues),
    });
  }


  // ── 5. COLUMN VALUE BUILDERS (val.*) ──────────────────────────────────────
  //
  // Monday.com requires values to be in specific shapes depending on column type.
  // A "text" column just wants a string. A "date" column wants { date: 'YYYY-MM-DD' }.
  // A "people" column wants { personsAndTeams: [{ id: 123, kind: 'person' }] }.
  //
  // These helpers mean you never have to remember those shapes — just call val.date('2026-07-01').

  const val = {

    // text / number columns — just a plain string
    text:   (v) => String(v),
    number: (v) => String(v),

    // date column — Monday expects { date: 'YYYY-MM-DD' }
    // Example: val.date('2026-07-01')
    date: (d) => ({ date: d }),

    // status column (coloured label dropdowns) — Monday expects { label: 'Done' }
    // The label must exactly match one of the options set up in Monday.
    // Example: val.status('Confirmed')
    status: (label) => ({ label }),

    // email column — Monday expects both an email address and display text
    // Example: val.email('tm@agency.com', 'Tour Manager')
    email: (address, displayText) => ({
      email: address,
      text:  displayText || address, // if no display text given, use the address itself
    }),

    // phone column — Monday expects a phone number + country code
    // 'RO' is Romania — change if artists are from elsewhere
    // Example: val.phone('+40721234567')
    phone: (number) => ({
      phone:            number,
      countryShortName: 'RO',
    }),

    // people column — links to Monday.com user accounts by their internal ID
    // ids is an array of Monday user IDs (found via the API or team settings)
    // Example: val.people([12345678])
    people: (ids) => ({
      personsAndTeams: ids.map(id => ({ id, kind: 'person' })),
    }),

  };


  // ── 6. COLUMN VALUE READERS ───────────────────────────────────────────────
  //
  // When Monday.com sends data back to us, each column comes as:
  //   { id: 'status0__1', text: 'Done', value: '{"index":1,"label":"Done"}' }
  //
  // `.text` is always a human-readable string.
  // `.value` is a raw JSON string with extra detail (useful for some column types).
  //
  // These helpers extract the right thing for each column type.

  // colMap: converts the raw array of column_values into a keyed object.
  // Monday returns: [{ id: 'col_a', text: 'hi' }, { id: 'col_b', text: '5' }]
  // colMap gives us: { col_a: { id: 'col_a', text: 'hi' }, col_b: { id: 'col_b', text: '5' } }
  // This makes lookups like cv['col_a'].text much easier.
  function colMap(item) {
    const cv = {};
    (item.column_values || []).forEach(col => {
      cv[col.id] = col;
    });
    return cv;
  }

  // read: get the plain text value of any column. Works for most column types.
  function read(cv, colId) {
    return cv[colId]?.text || null;
  }

  // readNum: get a column's value as a number (for number/count columns).
  // Returns null if empty or non-numeric rather than NaN.
  function readNum(cv, colId) {
    const n = parseFloat(read(cv, colId));
    return isNaN(n) ? null : n;
  }

  // readDate: extract just the YYYY-MM-DD date string from a date column.
  // Monday returns dates in different formats depending on context,
  // so we use a regex to reliably extract the date portion.
  function readDate(cv, colId) {
    const text = read(cv, colId);
    if (!text) return null;
    const match = text.match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : null;
  }

  // readPerson: get the name of the person from a people/person column.
  // Monday stores this in the .value JSON, not in .text directly.
  function readPerson(cv, colId) {
    try {
      const parsed = JSON.parse(cv[colId]?.value || '{}');
      // personsAndTeams is an array; we take the first person's name
      return parsed?.personsAndTeams?.[0]?.name || read(cv, colId) || null;
    } catch {
      return read(cv, colId); // fall back to .text if JSON parsing fails
    }
  }

  // readEmail: get the email address from an email column.
  // Monday stores the address in .value JSON rather than .text.
  function readEmail(cv, colId) {
    try {
      const parsed = JSON.parse(cv[colId]?.value || '{}');
      return parsed?.email || read(cv, colId) || null;
    } catch {
      return read(cv, colId);
    }
  }


  // ── 7. TWO-STATE LOGIC (asked / confirmed) ────────────────────────────────
  //
  // This is the core logic for the Email Draft Center.
  //
  // For each piece of information we need from an artist's team (hotel details,
  // flight info, dietary requirements, etc.), Monday.com has TWO date columns:
  //
  //   • askedColId     — the date we first requested this info (we fill this in)
  //   • confirmedColId — the date they confirmed it (we fill this when they reply)
  //
  // The possible states and what they mean:
  //   'not_asked'  — we haven't requested this info yet → Email Draft Center shows "Request" button
  //   'asked'      — we asked, but haven't heard back  → shows "Chase" button + how many days ago
  //   'confirmed'  — they gave us the info             → shows the confirmed value, no action needed
  //
  // Why dates instead of just a checkbox?
  //   Dates let us calculate "how long ago did we ask?" so we know when to chase.
  //   A checkbox only tells us yes/no, not how overdue something is.

  // twoStateStatus: read the current state for one data point.
  // Returns: 'not_asked' | 'asked' | 'partial' | 'confirmed'
  //
  // The optional partialColId is a third date column stamped when some — but not
  // all — of a field's sub-information has come back (e.g. arrival flight confirmed
  // but departure still pending). If that column has a date and confirmed does not,
  // the field is 'partial'.
  function twoStateStatus(cv, askedColId, confirmedColId, partialColId) {
    if (readDate(cv, confirmedColId))                    return 'confirmed';
    if (partialColId && readDate(cv, partialColId))      return 'partial';
    if (readDate(cv, askedColId))                        return 'asked';
    return 'not_asked';
  }

  // markAsked: write today's date into the "asked" column.
  // Called when you click "Request" in the Email Draft Center.
  function markAsked(boardId, itemId, askedColId) {
    const today = new Date().toISOString().slice(0, 10); // gives 'YYYY-MM-DD'
    return updateColumn(boardId, itemId, askedColId, val.date(today));
  }

  // markConfirmed: write today's date into the "confirmed" column,
  // and optionally also write the confirmed value into a data column.
  //
  // Example: when a TM confirms the flight number, we:
  //   1. write today's date to 'date_flight_conf'  (confirms it's done)
  //   2. write the flight number to 'text_flight_no' (stores the actual value)
  //
  // Parameters:
  //   confirmedColId — the date column that records when it was confirmed
  //   valueColId     — (optional) the data column to write the actual value into
  //   value          — (optional) the actual confirmed value

  function markConfirmed(boardId, itemId, confirmedColId, valueColId, value) {
    const today   = new Date().toISOString().slice(0, 10);
    const updates = { [confirmedColId]: val.date(today) }; // always stamp the confirmed date

    // If a value column and value were provided, include them in the same update call
    if (valueColId && value !== undefined) {
      updates[valueColId] = typeof value === 'string' ? val.text(value) : value;
    }

    // updateColumns sends everything in one API call (more efficient than two calls)
    return updateColumns(boardId, itemId, updates);
  }

  // daysSince: how many days ago was a date? Used to show "Asked 5 days ago".
  function daysSince(dateString) {
    if (!dateString) return null;
    const then = new Date(dateString);
    const now  = new Date();
    return Math.floor((now - then) / (1000 * 60 * 60 * 24));
  }


  // ── PUBLIC API ────────────────────────────────────────────────────────────
  //
  // This is what other files can access when they do: MondayClient.fetchBoard(...)
  // Everything not listed here stays private inside the IIFE above.

  return {
    // Status check
    ready,

    // Core
    query,

    // Reads
    fetchBoard,
    fetchItem,

    // Writes
    updateColumn,
    updateColumns,
    createItem,

    // Readers — use these to extract data from Monday responses
    colMap,
    read,
    readNum,
    readDate,
    readPerson,
    readEmail,

    // Writers — use these to build values before sending to Monday
    val,

    // Two-state system — asked / confirmed logic
    twoState: {
      status:        twoStateStatus,
      markAsked:     markAsked,
      markConfirmed: markConfirmed,
      daysSince:     daysSince,
    },
  };

})(); // ← the () at the end immediately runs the function and assigns the result to MondayClient
