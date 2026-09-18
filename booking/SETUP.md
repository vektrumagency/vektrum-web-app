# Setup: importing the booking workflow into self-hosted n8n

Target instance: **https://n8n.vektrum.agency** (Docker on VPS, `WEBHOOK_URL=https://n8n.vektrum.agency/`).
This is NOT n8n cloud — redirect URLs and webhook URLs below assume this base.

## 0. Collect these before starting

- [ ] Access to the Google account **vektrum.agency@gmail.com** (or delegated access to it)
- [ ] Access to Google Cloud Console under an org/project you can create OAuth clients in
- [ ] Admin access to https://n8n.vektrum.agency
- [ ] The 3 team members' calendar owners available to share their calendars (5 min each)
- [ ] This repo's `booking/n8n-workflow.json` on the machine you're using to open the n8n UI
- [ ] Ability to set env vars on the Next.js deploy (Vercel project settings)

---

## A. Google Cloud project — APIs + OAuth client

Only Calendar goes through Google OAuth. Confirmation email uses Gmail SMTP
with an App Password (section B.9 below), not the Gmail API — this keeps the
OAuth consent screen down to two "sensitive"-tier scopes (no "restricted"
scopes, so no paid CASA security assessment), and there is no service-account
alternative here: this project has no GCP Organization (personal `@gmail.com`
account), and Google disables service-account key creation by default on
org-less projects with no way to override it short of putting the domain on
Google Workspace. OAuth2 + verification is the practical path.

1. Go to console.cloud.google.com, select or create a project (any name, e.g. "Vektrum Booking").
2. **APIs & Services → Library**: search and **Enable**:
   - Google Calendar API
3. **APIs & Services → OAuth consent screen** (Google Auth Platform):
   - User type: External — Internal isn't available on a personal Gmail account (it requires a Google Workspace org).
   - Fill app name ("Vektrum Booking"), support email, developer contact email.
   - Application home page: `https://vektrum.agency`
   - Application privacy policy link: `https://vektrum.agency/privacidade` — **make sure this page explicitly covers Google Calendar data** (what's read/written, that it's not shared with third parties, retention) before submitting; a policy that only covers the diagnosis-form data will get bounced.
   - Scopes: add the two Calendar scopes from step B.5 below.
4. **Submit for verification** (Testing → Publish app → Google will route you into verification because sensitive scopes are present):
   - Scope justification for each scope (why `calendar.freebusy` / `calendar.events` are needed).
   - A short demo video (~2-3 min) showing the OAuth consent flow and how each scope's data is used in the booking flow.
   - Expect a few days to ~2 weeks for review (sensitive-only scopes, no CASA assessment).
   - **Until this is approved and published**, the consent screen stays in "Testing," which means refresh tokens expire after 7 days — plan to re-run the OAuth flow in n8n weekly until verification completes.
5. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: "n8n booking"
   - Leave "Authorized redirect URIs" empty for now — you'll add it in step B.3 below, then come back and save.
6. Copy the generated **Client ID** and **Client Secret** — you'll paste them into n8n next.

---

## B. n8n — Google OAuth2 credential + Gmail SMTP credential

1. Log into https://n8n.vektrum.agency.
2. **Credentials → Add Credential → Google OAuth2 API**.
3. n8n shows an **OAuth Redirect URL** field (read-only, auto-filled) — something like
   `https://n8n.vektrum.agency/rest/oauth2-credential/callback`. Copy it.
4. Go back to Google Cloud Console → the OAuth client from A.5 → **Authorized redirect URIs → Add URI** → paste the URL from step 3 → **Save**.
5. Back in n8n, fill:
   - **Client ID**: from A.6
   - **Client Secret**: from A.6
   - **Scope**: replace the default with exactly:
     ```
     https://www.googleapis.com/auth/calendar.freebusy https://www.googleapis.com/auth/calendar.events
     ```
6. Name the credential something identifiable, e.g. `Vektrum Google Calendar (booking)`. Click **Sign in with Google**.
7. Complete the consent flow **as vektrum.agency@gmail.com**. Approve both requested scopes.
8. Confirm the credential shows "Connected" / green status in n8n. Do not create a second credential — every HTTP Request node that talks to Calendar reuses this one.
9. **Credentials → Add Credential → SMTP** (for the confirmation email, separate from the credential above):
   - First, generate a Gmail App Password: on the Google account for `vektrum.agency@gmail.com`, go to **Security → 2-Step Verification** (must be enabled) → **App passwords** → create one named "n8n booking" → copy the 16-character password.
   - In n8n: Host `smtp.gmail.com`, Port `465`, SSL/TLS on, User `vektrum.agency@gmail.com`, Password = the app password just generated.
   - Name the credential `Vektrum Gmail SMTP (booking)`. Test/save.

---

## C. Team calendar prep

For each of the 3 people on the rotation:

1. They open Google Calendar → **Settings** (gear icon) → click their calendar under "Settings for my calendars" on the left.
2. **Share with specific people or groups → Add people** → enter `vektrum.agency@gmail.com` → permission **"See only free/busy (hide details)"** → Send.
3. Scroll to **Integrate calendar** → copy the **Calendar ID** (looks like an email address, or `xxxx@group.calendar.google.com` for secondary calendars). Save these 3 IDs — they go into `CFG.people[].calendars` in step D.

Then, in the vektrum.agency@gmail.com account itself:

4. **Create calendar** (left sidebar "+" → Create new calendar) named **Vektrum Bookings**. This is where confirmed events land. Copy its Calendar ID (Settings → that calendar → Integrate calendar) → this is `CFG.bookingCalendarId`.
5. Create or identify a **PTO calendar** (e.g. "Vektrum PTO") that all 3 people's time off gets marked on. Copy its Calendar ID → this is one entry in `CFG.blockingCalendars`.
6. Add/subscribe a **Portugal public holidays** calendar (Google has a public one: "Holidays in Portugal" — add via "Browse calendars of interest" or "Subscribe to calendar" using `en.portuguese#holiday@group.v.calendar.google.com`). Copy its Calendar ID → the other entry in `CFG.blockingCalendars`.
7. Make sure vektrum.agency@gmail.com has at least free/busy visibility into every calendar it needs to query (it owns Bookings/PTO already; holidays calendar is public; the 3 people's calendars were shared in step C.2).

You should now have: 3 person calendar IDs, 1 PTO calendar ID, 1 PT-holidays calendar ID, 1 bookings calendar ID — 6 IDs total.

---

## D. Import the workflow and fill the Config node

1. In n8n: **Workflows → Add workflow → ⋯ menu → Import from File** → select this repo's `booking/n8n-workflow.json`.
2. Open every **HTTP Request** node (freeBusy, freeBusy recheck, freeBusy for 409, events.insert) → **Credential** dropdown → select `Vektrum Google Calendar (booking)` from step B.6. There are 4 such nodes; none should be left on "None". Separately, open the **Send confirmation email** node (type "Send Email") → **Credential** dropdown → select `Vektrum Gmail SMTP (booking)` from step B.9.
3. Open the **Config** node (appears in both the `/disponibilidade` and `/marcar` branches — edit one, then repeat in the other, or copy/paste the whole node). Fill:
   - `people`: 3 entries, `{name, email, calendars: [<calendar ID from C.3>]}` — one array entry per person, using the real name/email of each team member.
   - `blockingCalendars`: `[<PT-holidays ID from C.6>, <PTO ID from C.5>]`
   - `bookingCalendarId`: `<Vektrum Bookings ID from C.4>`
   - Leave `timezone`, `quorumN`, `meetingMin`, `bufferMin`, `slotStepMin`, `minLeadHours`, `horizonDays`, `businessHours`, `pacing` as shipped unless you deliberately want different behavior.
4. (Optional, recommended) If you want to restrict who can call the raw n8n webhooks directly (bypassing the Next.js proxy), add an **IF node** right after each Webhook node checking header `x-booking-secret` equals a chosen secret string, routing failures to a 401 Respond node. The Next.js proxy (see section F) already sends this header — pick a secret value now and use it in both places.
5. Save the workflow.

---

## E. Activate and smoke-test

1. Toggle the workflow **Active** (top-right switch in the workflow editor). This registers the real (non-test) webhook paths.
2. Live webhook URLs are:
   - `https://n8n.vektrum.agency/webhook/disponibilidade` (GET)
   - `https://n8n.vektrum.agency/webhook/marcar` (POST)
   (The `/webhook-test/...` paths only work while a workflow is open and "listening" in the editor — use `/webhook/...` for the activated, always-on version.)
3. Test availability:
   ```bash
   curl -s https://n8n.vektrum.agency/webhook/disponibilidade | jq
   ```
   Expect `{"timezone":"Europe/Lisbon","slots":[...]}`. If you added the header check in D.4, add `-H "x-booking-secret: <your secret>"`.
4. Copy one `startUTC` value from the response, then test booking:
   ```bash
   curl -s -X POST https://n8n.vektrum.agency/webhook/marcar \
     -H "content-type: application/json" \
     -H "x-booking-secret: <your secret>" \
     -d '{"name":"Test User","email":"test@example.com","startUTC":"<paste value>"}'
   ```
   Expect `{"status":"confirmed","startUTC":"...","endUTC":"...","meetLink":"..."}`, a new event in the Vektrum Bookings calendar with a Meet link, and a confirmation email at `test@example.com`.
5. Repeat step 4 immediately with the same `startUTC` — expect `{"status":"taken","slots":[...]}` with HTTP 409.
6. Test the honeypot: repeat step 4 with `"_hp":"anything"` added to the JSON body — expect a fake `{"status":"confirmed"}` 200 with no new calendar event and no email sent.

---

## F. Next.js side

Set these env vars on the Vercel project (Project Settings → Environment Variables, or `vercel env add`):

| Var | Value |
|---|---|
| `N8N_BOOKING_BASE` | `https://n8n.vektrum.agency/webhook` |
| `N8N_BOOKING_SECRET` | the same secret string used in the header check from D.4 (any value if you skipped D.4 — the proxy always sends it, but n8n will just ignore it if no IF node checks it) |

The Booker client component never calls n8n directly — it calls the app's own proxy routes, which forward to n8n with the secret header attached:
- `app/api/booking/availability/route.ts` → `GET {N8N_BOOKING_BASE}/disponibilidade`
- `app/api/booking/book/route.ts` → `POST {N8N_BOOKING_BASE}/marcar`

After setting the env vars, redeploy so the new values take effect, then load `/marcar` in the deployed app and confirm the slot list loads and a real booking completes end-to-end.
