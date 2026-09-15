# Vektrum booking — n8n wiring guide

Self-hosted scheduling: one n8n workflow, two webhooks, Google Calendar as the
sole source of truth. No database, no SaaS. This guide wires up
`booking/n8n-workflow.json` and documents every placeholder a human must fill
before it can run.

The slot-selection logic (candidate generation, free/busy evaluation, pacing)
lives in `booking/slot-engine.js` as pure, tested functions. The two Code
nodes below (**Slot engine** and **Re-check slot**) are that same logic
pasted inline, because n8n Code nodes cannot `require()` a project file — the
functions are copy-pasted verbatim, not reimplemented. If you change
`slot-engine.js`, re-paste the updated functions into both Code nodes.

## 1. Prerequisites

- An n8n instance (self-hosted or cloud) reachable at a stable base URL.
- A Google account that owns/has edit access to all calendars referenced
  below — used for both the freeBusy query and creating booking events.
  Spec default: `vektrum.agency@gmail.com`.
- Three Google Calendars (or however many people are on the rotation), a
  shared PT holidays calendar, a Vektrum PTO calendar, and one calendar
  dedicated to holding confirmed booking events.

## 2. Google Cloud / OAuth2 credential

1. In Google Cloud Console, create (or reuse) a project and enable the
   **Google Calendar API** and **Gmail API**.
2. Create an OAuth 2.0 Client ID (type: Web application) and add n8n's OAuth
   redirect URL (shown by n8n when you create the credential in step 3).
3. In n8n, create ONE credential: **Google OAuth2 API**, named e.g.
   `Vektrum Google (booking)`. Under scopes, request exactly:
   - `https://www.googleapis.com/auth/calendar.freebusy`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/gmail.send`
4. Complete the OAuth consent flow as the calendar-owning account
   (`vektrum.agency@gmail.com` or equivalent).
5. Attach this one credential to every HTTP Request / Gmail node in the
   workflow that needs it (see node list below) — do not create per-node
   credentials.

## 3. Workflow shape

Two independent trigger branches inside **one** workflow
(`booking/n8n-workflow.json`):

```
GET /disponibilidade
  Webhook (GET, Respond: "Using Respond to Webhook node")
    -> Config (Code)
    -> Build freeBusy body (Code)
    -> HTTP Request: freeBusy (POST, OAuth2)
    -> Slot engine (Code)
    -> Respond to Webhook (JSON)

POST /marcar
  Webhook (POST, Respond: "Using Respond to Webhook node")
    -> Honeypot IF (body._hp non-empty?)
         true  -> Respond fake success (200, no side effects)
         false -> continue
    -> Config1 (Code — this branch's own Config; must run BEFORE Validate input)
    -> Validate input (Code: email regex, slot in future, aligned to grid
       and business hours, within horizon; reads CFG via $('Config1'))
    -> Build freeBusy body — single slot (Code)
    -> HTTP Request: freeBusy recheck (POST, OAuth2)
    -> Re-check slot (Code — reuses evaluate() on the one requested slot)
    -> IF slot still ok
         false -> Slot engine (Code, recompute full list)
                  -> Respond 409 {status:"taken", slots:[...]}
         true  -> HTTP Request: events.insert (POST, OAuth2,
                  ?conferenceDataVersion=1&sendUpdates=all)
                  -> Send confirmation email (Gmail node, OAuth2)
                  -> Respond 200 {status:"confirmed", startUTC, endUTC, meetLink}
```

## 4. Node-by-node notes

### Config (Code node, appears in both branches)

Holds every tunable parameter as one JSON object, `CFG`. **This is the only
place placeholders live** — never hardcode an ID or email in another node.
Fields (see `slot-engine.js` header comment for the authoritative shape):

| Field | Value (spec default) | Placeholder? |
|---|---|---|
| `timezone` | `Europe/Lisbon` | no |
| `quorumN` | `2` | no |
| `meetingMin` / `bufferMin` / `slotStepMin` | `30` / `15` / `30` | no |
| `minLeadHours` / `horizonDays` | `12` / `14` | no |
| `businessHours` | Mon–Fri `[["10:00","13:00"],["14:00","18:00"]]` | no |
| `pacing` | `{0:2, 1:3, default:3}` | no |
| `people` | `[{name, email, calendars:[ids]}]` × 3 | **YES — fill real names/emails/calendar IDs** |
| `blockingCalendars` | `[ptHolidaysId, vektrumPtoId]` | **YES — fill real calendar IDs** |
| `bookingCalendarId` | `vektrum_bookings_id` | **YES — fill real calendar ID** |

A person counts as busy if **any** of their listed calendars is busy.
`blockingCalendars` are checked with zero buffer and, if busy, block the
slot for everyone regardless of quorum (e.g. public holidays, company PTO).

### Build freeBusy body (Code)

Constructs the `freebusy` request body:
```json
{
  "timeMin": "<now, ISO>",
  "timeMax": "<now + horizonDays, ISO>",
  "timeZone": "<CFG.timezone>",
  "items": [{"id": "<calendarId>"}, ... one per person calendar + blockingCalendars]
}
```
For the `/marcar` re-check branch, use the single requested slot padded by
`CFG.bufferMin` instead of the full horizon: `timeMin = slotStart - buffer`,
`timeMax = slotEnd + buffer`.

### HTTP Request: freeBusy

- Method: `POST`
- URL: `https://www.googleapis.com/calendar/v3/freeBusy`
- Authentication: the Google OAuth2 credential from step 2
- Body: JSON from the previous node, `Content-Type: application/json`

### Slot engine (Code)

Pastes in the four pure functions from `slot-engine.js`
(`candidates`, `busyOverlaps`, `evaluate`, `pace`) plus a small driver. Luxon
`DateTime` is a **global** inside n8n Code nodes — do not `require`/`import`
it there. Reads `CFG` via `$('Config').first().json` and the freeBusy
response via `$json.calendars`. Returns
`{ json: { timezone, slots } }` where each slot is
`{ startUTC, endUTC, label, weekOffset }` (member emails are stripped from
the public response). See the full driver snippet in
`booking/n8n-workflow.json` (node "Slot engine") — it is the same code shown
in `booking-plan.md` Deliverable A, kept byte-identical to `slot-engine.js`'s
`computeSlots` pipeline.

### Respond to Webhook (disponibilidade)

Response mode: JSON, body = `{{$json}}`, status 200.

### Honeypot IF (marcar)

Condition: `{{$json.body._hp}}` is not empty. If true, go straight to a
**Respond to Webhook** node returning `{"status":"confirmed"}` with a fake
200 — do not touch calendars, do not send email, do not log the attempt
specially (just silently drop it as if it succeeded, per anti-bot spec).

### Validate input (Code)

Reads `CFG` from this branch's own Config node (**Config1**), which is wired to
run immediately before it. Never reference the `/disponibilidade` branch's
`Config` node from the POST branch — n8n 2.x throws
`Node 'X' hasn't been executed` when `$()` points at a node that did not run in
the current execution.

Checks, in order, and responds 400 on first failure:
1. `name` non-empty string.
2. `email` matches a basic RFC-5322-ish regex.
3. `startUTC` parses as a valid ISO datetime and is strictly in the future
   (`> now + CFG.minLeadHours` recommended, but at minimum `> now`).
4. The slot aligns to the `slotStepMin` grid and falls inside a
   `businessHours` window for its weekday.
5. The slot is within `horizonDays` of now.

### Re-check slot (Code)

Reuses `evaluate(CFG, fb, slot)` from `slot-engine.js` against the single
requested slot (padded freeBusy window from the previous HTTP node). If
`ok` is false, branch into recomputing the full slot list (reuse the same
**Slot engine** logic) and respond 409. If `ok` is true, continue to booking.

**Known limitation (accepted for this volume):** there is a residual
time-of-check/time-of-use race between the re-check and the
`events.insert` call below — two people could theoretically book the same
slot within that narrow window. Not mitigated in v1; documented here per
spec.

### HTTP Request: events.insert

- Method: `POST`
- URL: `https://www.googleapis.com/calendar/v3/calendars/{{ $('Config').first().json.bookingCalendarId }}/events?conferenceDataVersion=1&sendUpdates=all`
- Authentication: the Google OAuth2 credential
- Body:
```json
{
  "summary": "Vektrum × {{name}}",
  "description": "{{note or default text}}",
  "start": {"dateTime": "{{startUTC}}", "timeZone": "Europe/Lisbon"},
  "end":   {"dateTime": "{{endUTC}}",   "timeZone": "Europe/Lisbon"},
  "attendees": [ /* team members returned free for this slot, from Re-check slot's `members` field; lead attendee optional */ ],
  "conferenceData": {"createRequest": {"requestId": "{{a random id}}", "conferenceSolutionKey": {"type": "hangoutsMeet"}}}
}
```

### Send confirmation email (Gmail node)

Uses the same OAuth2 credential (Gmail scope above must be granted on it).
Sends a bilingual (PT default / EN if `lang=en` was passed) branded
confirmation to the requester, including the Google Meet link returned by
`events.insert` (`hangoutMeetLink` or `conferenceData.entryPoints[].uri`)
and the human-readable slot label.

### Respond to Webhook (marcar, success)

JSON `{"status":"confirmed", "startUTC":"...", "endUTC":"...", "meetLink":"..."}`, status 200.

### Respond to Webhook (marcar, taken)

JSON `{"status":"taken", "slots":[...]}` (freshly recomputed list), status 409.

## 5. Placeholders checklist — everything the human must fill before go-live

- [ ] Google OAuth2 credential created and authorized with the three scopes above
- [ ] `CFG.people` — 3 real `{name, email, calendars:[calendarId]}` entries
- [ ] `CFG.blockingCalendars` — real PT-holidays calendar ID + Vektrum PTO calendar ID
- [ ] `CFG.bookingCalendarId` — real calendar ID confirmed events get written to
- [ ] n8n webhook base URL wired into the Next.js proxy routes
      (`app/api/booking/availability/route.ts`, `app/api/booking/book/route.ts`) — out of scope for this package
- [ ] A shared-secret header between the Next.js proxy and these webhooks, if you want to restrict direct access to the n8n URLs (not modeled in the imported JSON — add an IF/Header check node if desired)
- [ ] Gmail "from" name/signature and PT/EN copy in the confirmation email node
- [ ] Timezone assumption `Europe/Lisbon` confirmed correct for all business hours

## 6. Testing after import

1. Trigger `GET /disponibilidade` manually (e.g. curl) and confirm it
   returns a `slots` array shaped like `slot-engine.js`'s `computeSlots`
   output, using real calendar data.
2. Trigger `POST /marcar` with a `startUTC` copied from step 1's response
   and confirm a calendar event + Meet link + email are created.
3. Immediately repeat step 2 with the same slot from a "second browser" to
   confirm the 409 "taken" path re-renders a fresh slot list.
4. Submit `POST /marcar` with `_hp` non-empty and confirm it returns a fake
   200 with no calendar/email side effects.
