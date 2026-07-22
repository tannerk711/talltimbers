# CLAUDE.md. Tall Timbers DSCR Funnel (v2 site)

**The new Tall Timbers DSCR funnel, deploying at `dscr.talltimbersrfs.com`** (decided
2026-07-22; the old multi-page site stays on the apex talltimbersrfs.com until Tanner
decides otherwise). Built 2026-07-21 by cloning `clients/dscr-funnel-template/` (funnel v1,
"private credit house" design) and rebranding it for Tall Timbers. The old site lives in
`clients/tall-timbers/` and stays in the tree because skills and history reference it.
Traffic switches when Google Ads final URLs point at the subdomain (CUTOVER.md Phase E).

## Client facts (locked)

- **Brand:** Tall Timbers Realty and Financial Services (short: Tall Timbers)
- **Domain:** talltimbersrfs.com
- **Specialist:** Adam C. Cunningham, Mortgage Loan Originator, NMLS #312817. Single-broker:
  Adam takes every lead, every state. Never reintroduce per-state routing.
- **Phone:** (888) 931-0211 (every tel: link)
- **Locked proof numbers:** 250+ DSCR/non-QM loans closed, 70+ lender network. Do not inflate.
- **The 15 DSCR hard rules in `clients/tall-timbers/CLAUDE.md` apply to every line of copy
  here.** Highlights: no close-day counts, no rate-shopping language, no "soft pull" claims,
  same-day (never 24-hour) pre-approval, no em-dashes, consultative not gatekeeper.

## Tracking (wired and verified 2026-07-21)

- **Google Ads gtag:** `AW-18132955750`, loaded site-wide from `Layout.astro` via
  `brand.gtagId`.
- **New Lead conversion:** `AW-18132955750/Tbu1CMmLkrUcEObku8ZD`, fired from the
  `/thank-you` inline script ONLY when a real submission exists in sessionStorage
  (`lead-summary`) OR `?demo=1` is present (Tag Assistant verification:
  `https://talltimbersrfs.com/thank-you?demo=1`). Bare visits and bots never fire it. Do not
  simplify into an unconditional call.
- **Hotjar:** site id `6725186`, loaded site-wide from `Layout.astro` via `brand.hotjarId`.
- **Booking calendar:** Adam's GHL widget `9CBi2dkCfuszehuLkyA1`
  (`https://api.leadconnectorhq.com/widget/booking/...`) embedded on `/thank-you` via
  `brand.bookingEmbedUrl`, using the known-good GHL iframe pattern (scrolling="yes",
  capped height, no overflow-hidden wrapper).

## Everything brandable lives in `src/config/funnel.ts`

Name, NMLS, phone, logo path, proof numbers, booking URL, gtag ids, Hotjar id, specialist
(+ headshot), ticker deals, deal-story reviews, FAQs, TCPA copy.

## Lead flow

Form (`FunnelForm.tsx`) → POST `/api/lead` (serverless) → forwards server-side to
`LEAD_WEBHOOK_URL` env var (set in Vercel; never read webhooks in browser code). Payload is
the funnel-template contract documented in `deliverables/WIRING.md` (NOT the old site's flat
Zapier payload; the old Zap's field mapping does not match). Partial captures fire with
`partial: true` after name+email. Honeypot field `website` drops bots server-side.

## Old-site route redirects (in `astro.config.mjs`)

`/lp/georgia-dscr` → `/`, `/lp/florida-dscr` → `/`, `/privacy-policy` → `/privacy`,
`/terms-of-service` → `/legal`. Keep these; live Google Ads final URLs pointed at the old LP
paths until the campaigns are updated.

## Build / QA

- `npm run dev` (port 4321) · `npm run build` must pass before commit.
- `node tools/shoot.mjs <prefix>`: screenshot harness (desktop + mobile emulation + form
  steps + decline + thank-you).
- `node tools/verify-tracking.mjs`: asserts gtag/Hotjar load, conversion gating (bare
  thank-you fires nothing, ?demo=1 and real submits fire the labeled conversion), full
  form submit → /api/lead 200 → redirect → personalization, honeypot value reaching the
  payload, old-route redirects, and mobile booking iframe sizing. All 16 checks passed
  2026-07-21 (after the verification-workflow fixes below).
- Verification workflow findings fixed 2026-07-21: "50 States served" stat replaced with
  "Fast / Closings on clean files" (unlocked claim, contradicted by old EXCLUDED_STATES);
  ticker reframed from invented "Funded $X" amounts to approved deal-story lines;
  footer/legal/privacy rewritten from directory voice to licensed-shop "we" voice (Rule 9);
  thank-you tab title "You're Eligible" → "Eligibility Check Complete"; honeypot moved to
  the always-mounted form shell (it unmounted before submit and could never catch a bot;
  QA tools must exclude `#ff-company` when selecting form inputs).

## Deliverables

`deliverables/` (eligibility email, follow-up emails + SMS, call-prep one-pager, WIRING.md)
are rebranded for Tall Timbers and ready to build in GHL. The funnel copy promises an
eligibility summary email; until Workflow A in WIRING.md exists in GHL, that promise is
unbacked. Wire it before or immediately after cutover.

## Deploy

**Repo:** `github.com/tannerk711/talltimbers`, branch **`dscr-funnel`** (this folder is the
canonical clone; `main` = old site, history grafted under the funnel commits). Push to
`dscr-funnel` and the existing talltimbers Vercel project auto-builds it; the domain
`dscr.talltimbersrfs.com` is assigned to this branch in Vercel domain settings. Env:
`LEAD_WEBHOOK_URL` (set for all environments; branch domains use the Preview scope).
`@astrojs/vercel` adapter handles `/api/lead`. Do NOT push this tree to `main` unless
Tanner says to put the funnel on the apex ("flip main": `git push origin HEAD:main`).

## Lessons Learned

- **[2026-07-21] shoot.mjs path bug:** `new URL().pathname` keeps `%20` for spaces and
  breaks on this workspace path; use `fileURLToPath`. Fixed here; fix upstream in
  dscr-funnel-template if reused.
- **[2026-07-21] gtag config ping vs conversion:** the `viewthroughconversion` request with
  `en=gtag.config` fires on every page load with an Ads tag. Only requests carrying the
  conversion label are real conversions; assert on the label when verifying.
