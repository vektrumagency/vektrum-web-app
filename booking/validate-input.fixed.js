// ==== Validate input — SELF-CONTAINED (n8n 2.x safe): references no other node. ====
// n8n 2.x throws "Node 'X' hasn't been executed" when $() points at a node that did not
// run in the current execution. In a POST /marcar run the GET branch's Config never runs
// and Config1 runs AFTER this node, so we inline the few constants validation needs.
const CFG = {
  timezone: 'Europe/Lisbon',
  meetingMin: 30,
  slotStepMin: 30,
  horizonDays: 30,
  businessHours: {
    1: [['10:00','13:00'],['14:00','18:00']],
    2: [['10:00','13:00'],['14:00','18:00']],
    3: [['10:00','13:00'],['14:00','18:00']],
    4: [['10:00','13:00'],['14:00','18:00']],
    5: [['10:00','13:00'],['14:00','18:00']]
  }
};
const b = $json.body || {};
const now = DateTime.now().setZone(CFG.timezone);
function fail(reason) { return [{ json: { valid: false, reason } }]; }
if (!b.name || typeof b.name !== 'string' || !b.name.trim()) return fail('missing_name');
if (!b.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return fail('invalid_email');
if (!b.startUTC) return fail('missing_start');
const start = DateTime.fromISO(b.startUTC).setZone(CFG.timezone);
if (!start.isValid) return fail('invalid_start');
if (start <= now) return fail('start_not_future');
const end = start.plus({ minutes: CFG.meetingMin });
const dayStart = start.startOf('day');
const minutesFromMidnight = start.diff(dayStart, 'minutes').minutes;
if (minutesFromMidnight % CFG.slotStepMin !== 0) return fail('not_on_grid');
const hm = (s) => ({ hour: +s.slice(0, 2), minute: +s.slice(3, 5), second: 0, millisecond: 0 });
const windows = CFG.businessHours[start.weekday] || [];
const inWindow = windows.some(([s, e]) => {
  const ws = dayStart.set(hm(s)), we = dayStart.set(hm(e));
  return start >= ws && end <= we;
});
if (!inWindow) return fail('outside_business_hours');
if (start > now.plus({ days: CFG.horizonDays })) return fail('beyond_horizon');
return [{ json: { valid: true, name: b.name.trim(), email: b.email, note: b.note || '', lang: b.lang || 'pt', startUTC: start.toUTC().toISO(), endUTC: end.toUTC().toISO() } }];
