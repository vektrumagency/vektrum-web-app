// Vektrum scheduling — slot engine (pure functions, shared by n8n Code nodes and local tests).
//
// In n8n Code nodes, `DateTime` (Luxon) is a global — do NOT import it there.
// This file works in both environments: it uses the global `DateTime` if present,
// otherwise falls back to `require('luxon').DateTime` (Node/local test harness).
//
// CFG shape (see booking/README.md for what the human must fill in):
// {
//   timezone: 'Europe/Lisbon',
//   quorumN: 2,
//   meetingMin: 30, bufferMin: 15, slotStepMin: 30,
//   minLeadHours: 12, horizonDays: 14,
//   businessHours: { 1:[["10:00","13:00"],["14:00","18:00"]], ... 5: [...] }, // Luxon weekday 1=Mon..5=Fri
//   pacing: { 0:2, 1:3, default:3 },
//   people: [{ name, email, calendars:[ids] }, ...],
//   blockingCalendars: [ptHolidaysId, vektrumPtoId],
//   bookingCalendarId: 'vektrum_bookings_id',
// }

const DateTime = (typeof globalThis.DateTime !== 'undefined')
  ? globalThis.DateTime
  : require('luxon').DateTime;

function hm(s) {
  return { hour: +s.slice(0, 2), minute: +s.slice(3, 5), second: 0, millisecond: 0 };
}

// Generates every candidate meeting slot inside business hours, from now+minLeadHours
// through now+horizonDays, stepped by slotStepMin.
function candidates(CFG, now) {
  const earliest = now.plus({ hours: CFG.minLeadHours });
  const horizon = now.plus({ days: CFG.horizonDays });
  const out = [];
  let day = now.startOf('day');
  while (day < horizon) {
    for (const [s, e] of (CFG.businessHours[day.weekday] || [])) {
      let cur = day.set(hm(s));
      const win = day.set(hm(e));
      while (cur.plus({ minutes: CFG.meetingMin }) <= win) {
        const st = cur, en = cur.plus({ minutes: CFG.meetingMin });
        if (st >= earliest) out.push({ start: st, end: en });
        cur = cur.plus({ minutes: CFG.slotStepMin });
      }
    }
    day = day.plus({ days: 1 });
  }
  return out;
}

// True if any busy interval in `iv` overlaps [st,en] once padded by `buf` minutes on each side.
function busyOverlaps(iv, st, en, buf) {
  return (iv || []).some((x) => {
    const bS = DateTime.fromISO(x.start).minus({ minutes: buf });
    const bE = DateTime.fromISO(x.end).plus({ minutes: buf });
    return st < bE && en > bS;
  });
}

// fb: map of calendarId -> array of {start,end} busy intervals (ISO strings).
// Returns {ok, members} — ok if quorum of people are free and no blocking calendar is busy.
function evaluate(CFG, fb, slot) {
  for (const c of CFG.blockingCalendars) {
    if (busyOverlaps(fb[c], slot.start, slot.end, 0)) return { ok: false };
  }
  let free = 0;
  const members = [];
  for (const p of CFG.people) {
    const busy = p.calendars.some((c) => busyOverlaps(fb[c], slot.start, slot.end, CFG.bufferMin));
    if (!busy) { free++; members.push(p.email); }
  }
  return { ok: free >= CFG.quorumN, members };
}

// Groups qualified slots by week offset from "now"'s week start, caps each week per CFG.pacing,
// and maps to the public payload shape (label rendered server-side, in pt locale).
function pace(CFG, now, q) {
  const ws = now.startOf('week');
  const b = {};
  for (const s of q) {
    const off = Math.floor(s.start.diff(ws, 'weeks').weeks);
    (b[off] ??= []).push(s);
  }
  const out = [];
  for (const off of Object.keys(b).map(Number).sort((a, z) => a - z)) {
    const lim = CFG.pacing[off] ?? CFG.pacing.default;
    b[off].sort((a, z) => a.start - z.start);
    for (const s of b[off].slice(0, lim)) {
      out.push({
        startUTC: s.start.toUTC().toISO(),
        endUTC: s.end.toUTC().toISO(),
        label: s.start.setLocale('pt').toFormat("cccc d 'de' LLL 'às' HH:mm"),
        weekOffset: off,
        freeMembers: s.members,
      });
    }
  }
  return out;
}

// Runs the full pipeline: candidates -> evaluate -> filter ok -> pace.
// Returns the public slot list (freeMembers stripped) — this is what /disponibilidade responds with.
function computeSlots(CFG, fb, now) {
  const qualified = candidates(CFG, now).map((s) => ({ ...s, ...evaluate(CFG, fb, s) })).filter((s) => s.ok);
  return pace(CFG, now, qualified).map(({ freeMembers, ...pub }) => pub);
}

const exportsObj = { hm, candidates, busyOverlaps, evaluate, pace, computeSlots, DateTime };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exportsObj;
}
