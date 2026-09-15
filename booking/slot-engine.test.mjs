// Plain-node test harness for booking/slot-engine.js — no jest, no test runner deps.
// Run with: node booking/slot-engine.test.mjs

import { DateTime } from 'luxon';
import slotEngine from './slot-engine.js';
const { candidates, busyOverlaps, evaluate, pace, computeSlots } = slotEngine;

let pass = 0, fail = 0;

function assert(cond, msg) {
  if (cond) { pass++; }
  else { fail++; console.error(`FAIL: ${msg}`); }
}

function assertEqual(actual, expected, msg) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  assert(a === e, `${msg}\n  actual:   ${a}\n  expected: ${e}`);
}

// --- Fixed Config for all tests -------------------------------------------------
const CFG = {
  timezone: 'Europe/Lisbon',
  quorumN: 2,
  meetingMin: 30,
  bufferMin: 15,
  slotStepMin: 30,
  minLeadHours: 12,
  horizonDays: 14,
  businessHours: {
    1: [['10:00', '13:00'], ['14:00', '18:00']],
    2: [['10:00', '13:00'], ['14:00', '18:00']],
    3: [['10:00', '13:00'], ['14:00', '18:00']],
    4: [['10:00', '13:00'], ['14:00', '18:00']],
    5: [['10:00', '13:00'], ['14:00', '18:00']],
  },
  pacing: { 0: 2, 1: 3, default: 3 },
  people: [
    { name: 'Alice', email: 'alice@vektrum.agency', calendars: ['alice_cal'] },
    { name: 'Bob', email: 'bob@vektrum.agency', calendars: ['bob_cal'] },
    { name: 'Carol', email: 'carol@vektrum.agency', calendars: ['carol_cal'] },
  ],
  blockingCalendars: ['pt_holidays', 'vektrum_pto'],
  bookingCalendarId: 'vektrum_bookings',
};

// --- Test 1: busyOverlaps basic interval math ------------------------------------
{
  const now = DateTime.fromISO('2026-03-16T09:00:00', { zone: CFG.timezone }); // a Monday
  const st = now.set({ hour: 10, minute: 0 });
  const en = now.set({ hour: 10, minute: 30 });
  const iv = [{ start: st.plus({ minutes: 10 }).toISO(), end: st.plus({ minutes: 40 }).toISO() }];
  assert(busyOverlaps(iv, st, en, 0) === true, 'busyOverlaps: overlapping interval detected');

  const ivFar = [{ start: st.plus({ hours: 5 }).toISO(), end: st.plus({ hours: 6 }).toISO() }];
  assert(busyOverlaps(ivFar, st, en, 0) === false, 'busyOverlaps: non-overlapping interval not flagged');

  // buffer padding pushes a near-miss into overlap
  const ivBufferTest = [{ start: en.plus({ minutes: 5 }).toISO(), end: en.plus({ minutes: 35 }).toISO() }];
  assert(busyOverlaps(ivBufferTest, st, en, 15) === true, 'busyOverlaps: buffer padding causes overlap');
  assert(busyOverlaps(ivBufferTest, st, en, 0) === false, 'busyOverlaps: no overlap without buffer');
}

// --- Test 2: candidates only fall inside business hours + respect minLeadHours --
{
  const now = DateTime.fromISO('2026-03-16T09:00:00', { zone: CFG.timezone }); // Monday
  const cands = candidates(CFG, now);
  assert(cands.length > 0, 'candidates: produces at least one slot');
  const allInBusinessHours = cands.every((c) => {
    const windows = CFG.businessHours[c.start.weekday] || [];
    return windows.some(([s, e]) => {
      const winStart = c.start.set({ hour: +s.slice(0, 2), minute: +s.slice(3, 5), second: 0, millisecond: 0 });
      const winEnd = c.start.set({ hour: +e.slice(0, 2), minute: +e.slice(3, 5), second: 0, millisecond: 0 });
      return c.start >= winStart && c.end <= winEnd;
    });
  });
  assert(allInBusinessHours, 'candidates: all slots fall inside configured business-hour windows');

  const earliestAllowed = now.plus({ hours: CFG.minLeadHours });
  assert(cands.every((c) => c.start >= earliestAllowed), 'candidates: respects minLeadHours');

  const noWeekends = cands.every((c) => c.start.weekday >= 1 && c.start.weekday <= 5);
  assert(noWeekends, 'candidates: never produces weekend slots (no businessHours entry)');
}

// --- Test 3: evaluate() quorum logic ---------------------------------------------
{
  const now = DateTime.fromISO('2026-03-16T09:00:00', { zone: CFG.timezone });
  const slot = { start: now.set({ hour: 10, minute: 0 }), end: now.set({ hour: 10, minute: 30 }) };

  // Nobody busy -> free=3 >= quorumN(2) -> ok
  assertEqual(evaluate(CFG, {}, slot), { ok: true, members: ['alice@vektrum.agency', 'bob@vektrum.agency', 'carol@vektrum.agency'] }, 'evaluate: all free -> ok with all members');

  // Alice busy -> free=2 >= 2 -> still ok, Alice excluded
  const fbOneBusy = { alice_cal: [{ start: slot.start.toISO(), end: slot.end.toISO() }] };
  assertEqual(evaluate(CFG, fbOneBusy, slot), { ok: true, members: ['bob@vektrum.agency', 'carol@vektrum.agency'] }, 'evaluate: one busy -> quorum still met');

  // Alice + Bob busy -> free=1 < 2 -> not ok
  const fbTwoBusy = {
    alice_cal: [{ start: slot.start.toISO(), end: slot.end.toISO() }],
    bob_cal: [{ start: slot.start.toISO(), end: slot.end.toISO() }],
  };
  assertEqual(evaluate(CFG, fbTwoBusy, slot), { ok: false, members: ['carol@vektrum.agency'] }, 'evaluate: two busy -> quorum not met');

  // Blocking calendar busy -> always not ok regardless of people
  const fbBlocked = { pt_holidays: [{ start: slot.start.toISO(), end: slot.end.toISO() }] };
  assertEqual(evaluate(CFG, fbBlocked, slot), { ok: false }, 'evaluate: blocking calendar busy -> not ok, no members key');
}

// --- Test 4: pace() caps slots per week and sorts by week offset ----------------
{
  const now = DateTime.fromISO('2026-03-16T09:00:00', { zone: CFG.timezone }); // Monday, week 0
  const mk = (d, h) => ({
    start: now.plus({ days: d }).set({ hour: h, minute: 0, second: 0, millisecond: 0 }),
    end: now.plus({ days: d }).set({ hour: h, minute: 30, second: 0, millisecond: 0 }),
    members: ['alice@vektrum.agency', 'bob@vektrum.agency'],
  });
  // Week 0 (this week): 3 candidate slots, pacing limit is 2
  // Week 1 (next week): 4 candidate slots, pacing limit is 3
  const q = [mk(0, 10), mk(1, 11), mk(2, 12), mk(8, 10), mk(9, 11), mk(10, 12), mk(11, 13)];
  const paced = pace(CFG, now, q);
  const week0 = paced.filter((s) => s.weekOffset === 0);
  const week1 = paced.filter((s) => s.weekOffset === 1);
  assert(week0.length === 2, `pace: week 0 capped at pacing[0]=2 (got ${week0.length})`);
  assert(week1.length === 3, `pace: week 1 capped at pacing[1]=3 (got ${week1.length})`);
  assert(paced.every((s) => typeof s.startUTC === 'string' && typeof s.endUTC === 'string'), 'pace: emits startUTC/endUTC ISO strings');
  assert(paced.every((s) => typeof s.label === 'string' && s.label.length > 0), 'pace: emits a non-empty pt-locale label');
  // paced output should be sorted by week offset ascending
  const offsets = paced.map((s) => s.weekOffset);
  const sorted = [...offsets].sort((a, z) => a - z);
  assertEqual(offsets, sorted, 'pace: output ordered by ascending week offset');
}

// --- Test 5: DST boundary (Europe/Lisbon springs forward 2026-03-29 01:00 -> 02:00) ---
{
  // "now" is the Thursday before the DST-transition weekend, so the Sunday DST jump
  // falls inside the horizon. Business hours only touch weekdays, so DST itself
  // (which lands on a Sunday) shouldn't produce phantom/missing slots, but the walk
  // across day boundaries must not throw or skip days due to a wall-clock length change.
  const now = DateTime.fromISO('2026-03-26T09:00:00', { zone: CFG.timezone }); // Thursday
  const dstSunday = DateTime.fromISO('2026-03-29T00:00:00', { zone: CFG.timezone });
  assert(dstSunday.offset !== dstSunday.plus({ days: 1 }).offset, 'sanity: 2026-03-29 is indeed a DST transition in Europe/Lisbon');

  const cands = candidates(CFG, now);
  assert(cands.length > 0, 'DST: candidates still produced across the transition weekend');

  // Every generated slot must fall on a weekday (no Saturday/Sunday slots, DST or not)
  assert(cands.every((c) => c.start.weekday >= 1 && c.start.weekday <= 5), 'DST: no weekend slots generated around the transition');

  // The Monday right after DST (2026-03-30) must still produce correctly-spaced business-hour slots
  const monAfterDst = cands.filter((c) => c.start.hasSame(DateTime.fromISO('2026-03-30', { zone: CFG.timezone }), 'day'));
  assert(monAfterDst.length > 0, 'DST: Monday after transition still has candidate slots');
  const expectedMonSlots = 6 + 8; // [10:00-13:00) step 30 = 6 slots, [14:00-18:00) step 30 = 8 slots
  assert(monAfterDst.length === expectedMonSlots, `DST: Monday after transition has expected slot count (got ${monAfterDst.length}, expected ${expectedMonSlots})`);

  // Full pipeline through computeSlots must not throw and returns paced results, all free (empty fb)
  const slots = computeSlots(CFG, {}, now);
  assert(Array.isArray(slots) && slots.length > 0, 'DST: computeSlots runs end-to-end across the DST boundary');
  assert(slots.every((s) => !('freeMembers' in s)), 'DST: public payload strips freeMembers');
}

// --- Test 6: computeSlots end-to-end with a partially-busy roster --------------
{
  const now = DateTime.fromISO('2026-03-16T09:00:00', { zone: CFG.timezone });
  const mondaySlot = now.set({ hour: 10, minute: 0, second: 0, millisecond: 0 });
  const fb = {
    // Alice busy all Monday morning -> those slots still qualify (Bob+Carol free = quorum 2)
    alice_cal: [{ start: mondaySlot.toISO(), end: mondaySlot.set({ hour: 13 }).toISO() }],
    // Holiday blocks all of the second business day entirely
    pt_holidays: [{ start: now.plus({ days: 1 }).startOf('day').toISO(), end: now.plus({ days: 1 }).endOf('day').toISO() }],
  };
  const slots = computeSlots(CFG, fb, now);
  assert(slots.length > 0, 'computeSlots: end-to-end produces slots with mixed busy/blocking data');
  const dayAfter = now.plus({ days: 1 });
  const noneOnHoliday = slots.every((s) => !DateTime.fromISO(s.startUTC).setZone(CFG.timezone).hasSame(dayAfter, 'day'));
  assert(noneOnHoliday, 'computeSlots: blocking calendar excludes the entire day for everyone');
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
