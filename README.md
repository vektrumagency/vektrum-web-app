# Vektrum Web App

Vektrum's marketing website and Order2Party client tooling, hosted on Vercel.

**`vektrum.agency`** — bilingual (EN / PT-PT) landing page for Vektrum's automation consulting services.  
**`order2party.vektrum.agency`** — PIN-gated Excel upload portal and WooCommerce category review UI for the Order2Party client.

> This repo (`vektrum-web-app`) is the active version. `vektrum-web` is an older fork from `dbaltaza/vektrum-web`.

## Stack

- Next.js 16.1.6 (App Router), React 19, TypeScript 5.9
- Tailwind CSS 3.4, PostCSS
- `@vercel/blob` 2.3.3 for category review persistence
- Hosted on Vercel

## Setup

```bash
npm install
```

Create `.env.local`:

```
ADMIN_PANEL_PASSWORD=
ORDER2PARTY_PORTAL_PIN=
ORDER2PARTY_ORCHESTRATOR_URL=
ORDER2PARTY_ORCHESTRATOR_SECRET=
BLOB_READ_WRITE_TOKEN=        # Vercel Blob token
ORDER2PARTY_MAX_FILE_MB=4
ORDER2PARTY_ORCHESTRATOR_TIMEOUT_MS=25000
SUPABASE_URL=                 # Same Supabase project as vektrum-crm
SUPABASE_SERVICE_ROLE_KEY=    # Newsletter subscribe/unsubscribe only
```

```bash
npm run dev     # http://localhost:3000
npm run build   # next build --webpack
npm run start
```

## Routes

| Route | Description |
|---|---|
| `/` | Vektrum marketing landing page |
| `/admin` | Runtime content editor (password-protected) |
| `/order2party` | Excel upload portal (PIN-gated) |
| `/order2party/categories` | WooCommerce category review UI |
| `/newsletter/unsubscribe` | Token-based unsubscribe link (from the email footer) |

## Architecture

**Runtime-mutable content without a database.** `lib/runtime-config.ts` holds an in-memory singleton initialized from `lib/site-config.ts`. Admin edits via `PUT /api/admin/config` update it at runtime but reset on server restart.

**All copy in `lib/site-config.ts`.** Full EN + PT-PT content typed via `SiteConfig`. Locale resolved from `?lang=en` query param; default is `pt-PT`.

**Subdomain routing.** `next.config.ts` rewrites `order2party.vektrum.agency/*` → `/order2party/*` — one deployment, two domains.

**Category review persistence.** Decisions stored as a single JSON file on Vercel Blob (`order2party/category-review-v1.json`) with localStorage fallback in the client.

**Newsletter is the one exception to "no database".** The subscribe form lives inline in `components/site-footer.tsx` (`components/newsletter-footer-form.tsx`, every page that renders `SiteFooter`), not a standalone page. It and `/newsletter/unsubscribe` write directly to the `newsletter_subscribers` table in vektrum-crm's Supabase project (`lib/supabase/server.ts`, service-role key, server-only). Drafting and sending issues happens entirely in vektrum-crm — this app only ever touches the subscriber list.

> Note: `lib/content.ts` is dead code. `app/order2party/categories` route has no auth guard — see TODO comments in `page.tsx` and `categories/review/route.ts`.
