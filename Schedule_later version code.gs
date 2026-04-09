// EC12 - Schedule — Code.gs  v5
// ─────────────────────────────────────────────────────────────
// Open via: Google Sheets → Extensions → Apps Script
// Deploy as web app: Execute as Me, Access: Anyone
// ─────────────────────────────────────────────────────────────

const SHEET_NAME      = "Ed's Master"; // Tab name in Ed's Google Sheet
const CHANGELOG_NAME  = 'Change log';   // ← tab where changes are logged
const TIMEZONE        = 'Europe/Bucharest';
const CODE_VERSION    = 'v5b-multichange-changelog';

// ── Canonical stage name map ─────────────────────────────────
var STAGE_CANONICAL = {
  'mainstage':       'MAINSTAGE',
  'hangar':          'HANGAR',
  'backyard':        'Backyard',
  'booha':           'BOOHA',
  'hideout':         'Hideout',
  'the beach':       'The Beach',
  'ping pong stage': 'Ping Pong Stage',
  'ping pong':       'Ping Pong Stage',
  'stables':         'Stables',
  'camping':         'Camping',
};

function _canonicalStage(raw) {
  var key = String(raw || '').trim().toLowerCase();
  return STAGE_CANONICAL[key] || String(raw || '').trim();
}

// ── Serves the timetable HTML ─────────────────────────────────
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('EC12 — Schedule')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Connection test ───────────────────────────────────────────
function testConnection() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss ? ss.getSheetByName(SHEET_NAME) : null;
  return {
    ok:      !!sheet,
    sheet:   sheet ? sheet.getName() : 'NOT FOUND — check SHEET_NAME constant',
    rows:    sheet ? sheet.getLastRow() : 0,
    version: CODE_VERSION
  };
}

// ── Normalise string for comparison ──────────────────────────
function _norm(s) {
  return String(s || '').replace(/\u2013|\u2014/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
}

// ── Extract time fraction (strips date component) ────────────
function _timeFrac(v) {
  if (v === null || v === '' || v === undefined) return null;
  var n = Number(v);
  if (isNaN(n)) return null;
  return n > 1 ? n % 1 : n;
}

// ── Changeover row? ───────────────────────────────────────────
function _isChangeover(artist) {
  var a = _norm(artist);
  return a === 'change' || a === 'changeover' || a === 'big break change';
}

// ── Load row? ─────────────────────────────────────────────────
function _isLoadRow(artist) {
  var a = _norm(artist);
  return a === 'load in' || a === 'load out' || a.indexOf('load') === 0;
}

// ── Friendly time string for changelog ───────────────────────
function _fmtMins(m) {
  var v = ((m % 1440) + 1440) % 1440;
  return ('0' + Math.floor(v / 60)).slice(-2) + ':' + ('0' + (v % 60)).slice(-2);
}

// ── READ: fetch all acts ──────────────────────────────────────
function getActs() {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return { ok: false, error: 'Sheet "' + SHEET_NAME + '" not found. Check SHEET_NAME in Code.gs.' };

    var data = sheet.getDataRange().getValues();
    var acts = [];
    var curStage = '', curDate = null, curEnd = null, prevKey = '';

    for (var i = 1; i < data.length; i++) {
      var colA = String(data[i][0] || '').trim();
      var colB = data[i][1];
      var colC = data[i][2];
      var colD = data[i][3];
      var colF = data[i][5];
      var colG = data[i][6];

      if (colA !== '') curStage = _canonicalStage(colA);

      if (colB instanceof Date) {
        curDate = Utilities.formatDate(colB, TIMEZONE, 'yyyy-MM-dd');
      }

      var key = curStage + '|' + curDate;
      if (key !== prevKey) { curEnd = null; prevKey = key; }

      if (colC === null || colC === '' || isNaN(Number(colC))) continue;
      var durMins = Math.round(Number(colC) * 1440);
      if (durMins <= 0) continue;

      var artist = String(colF || '').trim();
      if (!artist) continue;

      var frac      = _timeFrac(colD);
      var startMins = frac !== null ? Math.round(frac * 1440) : curEnd;
      if (startMins === null || curDate === null) continue;

      var endMins = startMins + durMins;
      curEnd = endMins;

      if (_isLoadRow(artist)) continue;

      if (_isChangeover(artist)) {
        acts.push({
          stage:  curStage,
          date:   curDate,
          artist: 'Change',
          start:  startMins,
          end:    endMins,
          sfx:    '',
          layer:  'changeover',
          _id:    'chg|' + curStage + '|' + curDate + '|' + startMins
        });
        continue;
      }

      acts.push({
        stage:  curStage,
        date:   curDate,
        artist: artist,
        start:  startMins,
        end:    endMins,
        sfx:    String(colG || '').trim(),
        layer:  'live',
        _id:    curStage + '|' + curDate + '|' + artist
      });
    }

    return { ok: true, acts: acts, count: acts.length, version: CODE_VERSION };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

// ── WRITE: apply all changes in one atomic pass ───────────────
// option: 'cascade'  → formula chain cascades naturally
// option: 'isolated' → insert changeover in gap so next act stays fixed
//
// Multi-change safety:
//   1. Changeovers are handled first (duration only, no row inserts)
//   2. Live acts sorted by origStartMins ascending
//   3. All act start/duration writes happen first
//   4. Row insertions (isolated only) processed bottom-to-top
//      to avoid row-number shifts affecting earlier changes
//   5. Single flush() at the very end
function updateActs(changes, option) {
  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var sht = ss.getSheetByName(SHEET_NAME);
    if (!sht) return { ok: false, error: 'Sheet "' + SHEET_NAME + '" not found.' };

    // Split into changeovers and live acts
    var chgChanges  = changes.filter(function(c) { return _isChangeover(c.artist || ''); });
    var liveChanges = changes.filter(function(c) { return !_isChangeover(c.artist || ''); });

    // Sort live changes by original start time ascending
    liveChanges.sort(function(a, b) {
      return (a.origStartMins || a.newStartMins) - (b.origStartMins || b.newStartMins);
    });

    var errors = [];
    var written = []; // {rowNum, change} for isolated row-insert pass

    // ── Pass 1: update all changeover durations ───────────────
    chgChanges.forEach(function(ch) {
      var result = _applyChangeoverUpdate(sht, ch);
      if (!result.ok) errors.push(result.error);
    });

    // ── Pass 2: read sheet once, find all target rows ─────────
    var data = sht.getDataRange().getValues();
    var rowStages = [], cur = '';
    for (var i = 0; i < data.length; i++) {
      var v = String(data[i][0] || '').trim();
      if (v) cur = v;
      rowStages[i] = cur;
    }

    liveChanges.forEach(function(ch) {
      var ns  = Number(ch.newStartMins);
      var ne  = Number(ch.newEndMins);
      var stg = _norm(String(ch.stage  || ''));
      var dt  = String(ch.date   || '').trim();
      var art = _norm(String(ch.artist || ''));

      // Find target row
      var targetRow = -1;
      for (var i = 1; i < data.length; i++) {
        if (_norm(rowStages[i]) !== stg) continue;
        if (_norm(data[i][5])   !== art) continue;
        var rd = data[i][1];
        var ds = rd instanceof Date
          ? Utilities.formatDate(rd, TIMEZONE, 'yyyy-MM-dd')
          : String(rd).substring(0, 10);
        if (ds !== dt) continue;
        targetRow = i;
        break;
      }

      if (targetRow < 0) {
        errors.push('Row not found: ' + ch.stage + ' / ' + ch.artist + ' / ' + dt);
        return;
      }

      var sr = targetRow + 1; // 1-indexed sheet row
      // Write start time and duration
      sht.getRange(sr, 3).setValue((ne - ns) / 1440);
      sht.getRange(sr, 4).setValue((ns % 1440) / 1440);

      written.push({ sr: sr, targetRow: targetRow, ch: ch, ns: ns, ne: ne, stg: stg, dt: dt });
    });

    // ── Pass 3: isolated row insertions, bottom-to-top ────────
    // Processing bottom-to-top means row inserts above don't shift
    // the row numbers of not-yet-processed entries.
    if (option === 'isolated') {
      // Sort descending by sheet row so we insert from bottom up
      written.sort(function(a, b) { return b.sr - a.sr; });

      // Re-read sheet after all the writes in pass 2
      SpreadsheetApp.flush();
      var data2     = sht.getDataRange().getValues();
      var rowStages2 = [], cur2 = '';
      for (var i = 0; i < data2.length; i++) {
        var v = String(data2[i][0] || '').trim();
        if (v) cur2 = v;
        rowStages2[i] = cur2;
      }

      written.forEach(function(w) {
        var ne = w.ne;
        // Find next live act in same stage block after the moved act
        // Use fresh data to account for any already-inserted rows above
        var nextRow = -1;
        for (var j = w.targetRow + 1; j < data2.length; j++) {
          if (_norm(rowStages2[j]) !== w.stg) break;
          var na = String(data2[j][5] || '').trim();
          if (!na || _isLoadRow(na)) continue;
          if (_isChangeover(na)) continue;
          nextRow = j;
          break;
        }

        if (nextRow < 0) return;

        var nextFrac  = _timeFrac(data2[nextRow][3]);
        var nextStart = nextFrac !== null ? Math.round(nextFrac * 1440) : -1;
        var gap       = nextStart > 0 ? nextStart - ne : 0;

        if (gap <= 0) return;

        // Check if changeover already exists between moved act and next act
        var existingChgRow = -1;
        for (var k = w.targetRow + 1; k < nextRow; k++) {
          if (_isChangeover(String(data2[k][5] || '').trim())) {
            existingChgRow = k;
            break;
          }
        }

        if (existingChgRow >= 0) {
          // Update existing changeover duration
          sht.getRange(existingChgRow + 1, 3).setValue(gap / 1440);
        } else {
          // Insert new changeover row immediately after the moved act
          sht.insertRowAfter(w.sr);
          var newR = w.sr + 1;
          var df = sht.getRange(w.sr, 2).getFormula() || sht.getRange(w.sr, 2).getValue();
          if (typeof df === 'string' && df.startsWith('=')) {
            sht.getRange(newR, 2).setFormula(df);
          } else {
            sht.getRange(newR, 2).setValue(df);
          }
          sht.getRange(newR, 3).setValue(gap / 1440);
          sht.getRange(newR, 4).setFormula('=E' + w.sr);
          sht.getRange(newR, 5).setFormula('=D' + newR + '+C' + newR);
          sht.getRange(newR, 6).setValue('Change');
          sht.getRange(w.sr, 3, 1, 3).copyFormatToRange(sht, 3, 5, newR, newR);
        }
      });
    }

    // ── Pass 4: write to Change log tab ──────────────────────
    _writeChangeLog(ss, changes, option);

    SpreadsheetApp.flush();

    if (errors.length > 0) {
      return { ok: false, error: errors.join(' | ') };
    }
    return { ok: true, updated: written.length + chgChanges.length };

  } catch(e) {
    return { ok: false, error: e.message };
  }
}

// ── Write entries to the Change log tab ──────────────────────
function _writeChangeLog(ss, changes, option) {
  try {
    var logSheet = ss.getSheetByName(CHANGELOG_NAME);

    // Create the tab if it doesn't exist
    if (!logSheet) {
      logSheet = ss.insertSheet(CHANGELOG_NAME);
      logSheet.getRange(1, 1, 1, 8).setValues([[
        'Timestamp', 'User', 'Stage', 'Date', 'Artist',
        'Old start', 'New start → end', 'Save mode'
      ]]);
      logSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      logSheet.setFrozenRows(1);
    }

    var now  = new Date();
    var user = Session.getActiveUser().getEmail() || 'unknown';
    var rows = changes.map(function(ch) {
      return [
        now,
        user,
        ch.stage   || '',
        ch.date    || '',
        ch.artist  || '',
        ch.origStartMins !== undefined ? _fmtMins(ch.origStartMins) : '—',
        _fmtMins(ch.newStartMins) + ' → ' + _fmtMins(ch.newEndMins),
        option || 'cascade'
      ];
    });

    if (rows.length > 0) {
      var lastRow = logSheet.getLastRow();
      logSheet.getRange(lastRow + 1, 1, rows.length, 8).setValues(rows);
      // Format timestamp column
      logSheet.getRange(lastRow + 1, 1, rows.length, 1)
        .setNumberFormat('yyyy-mm-dd hh:mm:ss');
    }
  } catch(e) {
    // Non-fatal — don't block the save if changelog write fails
    Logger.log('Changelog write failed: ' + e.message);
  }
}

// ── Update a changeover duration only ────────────────────────
function _applyChangeoverUpdate(sht, change) {
  var data = sht.getDataRange().getValues();
  var rowStages = [], cur = '';
  for (var i = 0; i < data.length; i++) {
    var v = String(data[i][0] || '').trim();
    if (v) cur = v;
    rowStages[i] = cur;
  }

  var stg   = _norm(String(change.stage || ''));
  var dt    = String(change.date  || '').trim();
  var ns    = Number(change.newStartMins);
  var ne    = Number(change.newEndMins);
  var origS = change.origStartMins !== undefined ? Number(change.origStartMins) : ns;

  for (var i = 1; i < data.length; i++) {
    if (_norm(rowStages[i]) !== stg) continue;
    if (!_isChangeover(String(data[i][5] || '').trim())) continue;
    var rd = data[i][1];
    var ds = rd instanceof Date
      ? Utilities.formatDate(rd, TIMEZONE, 'yyyy-MM-dd')
      : String(rd).substring(0, 10);
    if (ds !== dt) continue;
    var rowFrac = _timeFrac(data[i][3]);
    if (rowFrac === null) continue;
    var rowStart = Math.round(rowFrac * 1440);
    if (Math.abs(rowStart - origS) > 10) continue;

    sht.getRange(i + 1, 3).setValue((ne - ns) / 1440);
    return { ok: true, row: i + 1, type: 'changeover' };
  }

  return { ok: false, error: 'Changeover row not found: ' + change.stage + ' / ' + dt };
}
