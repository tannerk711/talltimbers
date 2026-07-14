# DSCR Funnel Template

**The master DSCR funnel template going forward.** Built fresh 2026-07-13 with zero reuse of prior DSCR site/funnel patterns, as a Fable 5 capability demonstration and a fundamentally better funnel than the current production one.

## The baseline this exists to beat

Current production funnel (dscr.promortgagefunding.com, Pro Mortgage Funding, DSCR - MI/CA campaign):

| Metric | April 2026 | May 2026 | Jul 2-8 2026 |
| --- | --- | --- | --- |
| LP conversion rate | 8.72% | 8.15% | n/a |
| Cost per lead | $70.16 | ~$80 | ~$85 |
| Avg CPC | $6.12 | n/a | n/a |
| CTR | 4.93% | n/a | n/a |

Targets: conversion rate 12-15%+, CPL under $50, and higher lead quality (loan size + down payment + equity data captured that the old funnel never asked for).

## Stack

Astro 5 + React 19 islands + Tailwind v4 (via `@tailwindcss/vite`) + GSAP (ScrollTrigger) + `@astrojs/vercel` adapter. Static output; only `/api/lead` runs serverless.

- `npm run dev`: port 4321
- `npm run build`: must pass before any commit

## Design system ("private credit house")

- Ink green `#0f231c` / warm paper `#f6f2e9` / brass `#b0873a`. Tokens in `src/styles/global.css` `@theme`.
- Type: **Fraunces** (display, variable w/ SOFT+WONK axes), **Hanken Grotesk** (body), **Fragment Mono** (data labels). Loaded via Google Fonts in `Layout.astro`.
- Signature elements: hero 3D property scene (pointer-tilt arch image + floating rent/payment/DSCR ledger chips), animated DSCR gauge (SVG needle sweep 0.80→1.30 on scroll), funded-deal marquee ticker, brass count-up stats band, film grain on dark sections.

## How to rebrand for a client (the whole point)

1. Edit **`src/config/funnel.ts`**: brand name, NMLS, phone, address, proof numbers, funded-deal ticker rows, reviews, FAQs, specialist, booking embed URL, gtag IDs. Every customer-facing token lives here.
2. Swap `public/images/hero-property.webp` + `aerial-golden.webp` (fal-generated; regenerate per client vibe). Keep WebP, keep filenames.
3. Set `LEAD_WEBHOOK_URL` env var (Vercel project settings): GHL inbound webhook. `/api/lead` forwards server-side (Astro/Vite secrets rule: never read webhooks in browser code).
4. Replace `privacy.astro` / `legal.astro` placeholder copy.
5. Colors: change the `@theme` tokens in `global.css` if the client needs a different palette.

## Funnel architecture

LP (`index.astro`) → 8-step form (`FunnelForm.tsx`, React island in hero) → `/thank-you`.

Form flow: goal → property type → credit band (<620 = soft-stop screen) → price/value slider ($150K-$2M) → conditional step (purchase: down % · refi/cashout: mortgage balance → shows equity · bridge: rehab budget) → state (type-ahead) → name+email → phone + TCPA + submit.

Conversion engineering built in:
- Auto-advance on option click, back link, brass progress bar, scenario summary chips at phone step
- gclid + UTM capture to sessionStorage → submitted with lead
- Honeypot field (`website`): bots get a silent 200 and are dropped in `/api/lead`
- `dataLayer` events: `funnel_start`, `funnel_step`, `lead_submit` (wire GA4/Ads to these)
- `secondsToComplete` submitted for lead-quality scoring
- Thank-you personalizes from sessionStorage (name + scenario chips), fires `brand.gtagConversion` if set
- Mobile sticky bottom CTA appears when the form card scrolls out of view

## Gotchas learned building this

- **Tailwind v4 `translate-*` utilities set the CSS `translate` property, not `transform`.** Toggling visibility from JS must set `el.style.translate`, not `el.style.transform`, or the class value silently wins.
- ffmpeg-style path args in filters break on Windows drive-letter colons; run from the working dir with relative paths.
- Bare headless-Chrome `--screenshot` at mobile widths clamps window width (~500px) and produces false overflow horrors; use puppeteer-core viewport emulation for honest mobile shots.
- GHL booking iframe embed on thank-you already applies the known fix: `scrolling="yes"`, height `min(1060px, calc(100vh - 120px))`, no `overflow-hidden` wrapper.

## Deliverables (the promise chain, built 2026-07-13)

The funnel promises the lead three things in its own copy: an eligibility
summary email in their inbox, a strategy call priced across the lender
network, and reply-to-book. `deliverables/` holds the assets that make those
promises real the moment `/api/lead` fires:

- **`deliverables/eligibility-summary-email.html`**: the core promise. GHL-ready
  HTML email (600px tables, inline CSS, light mode, image-free), personalized
  scenario ledger via `{{contact.dscr_*}}` merge fields, pre-qualification read,
  educational DSCR math (illustration only, never a quote), book-the-call CTA.
  Subject + 2 variants in the header comment.
- **`deliverables/followup/`**: no-book branch. Day 1 email (hard pull /
  commitment objection), day 3 email (the 1.25x worked example), day 5 email
  (last note), plus `sms.md` (day 0 evening + day 4, both under 320 chars).
- **`deliverables/call-prep-onepager.html`**: print-master prep sheet (letter,
  one page). Live auto-branded twin ships in the funnel at **`/call-prep`**
  (`src/pages/call-prep.astro`); keep copy changes in sync between the two.
- **`deliverables/WIRING.md`**: payload-to-GHL field map + the A/B/C workflow
  build (inbound webhook, immediate email 1, booked-goal exit, follow-up
  timing). Written to be executed in one pass with the ghl-mcp or by a VA.

These are TEMPLATE MASTERS. Never push them into a GHL location until Tanner
names a client. Rebrand tokens are listed at the top of each file and mirror
`src/config/funnel.ts`, so rebranding the funnel and the emails is one checklist.

**Payload note:** `FunnelForm.tsx` submits display-ready strings alongside raw
values (`goalLabel`, `priceDisplay`, `scenarioDetail`, `equity*`, etc.) so GHL
never formats numbers, and fires a `partial: true` capture the moment a lead
advances past name+email (no phone yet) so the promised summary email still
sends to phone-step abandoners. Workflow A must allow re-entry and tag-guard
Email 1 (see WIRING.md Step 3). If you change form fields, update WIRING.md's
table and the sample payload in the same commit.

## Deploy

Vercel. Root = this folder. Framework preset Astro; the `@astrojs/vercel` adapter handles `/api/lead`. Set `LEAD_WEBHOOK_URL`. Custom domain per client.

## Lessons Learned

- **[2026-07-13] Tailwind v4 translate toggle:** JS show/hide of a `translate-y-full` element via `style.transform` does nothing: v4 uses the `translate` property. Set `style.translate`.
- **[2026-07-13] Em-dash rule applied late:** wrote em-dashes through all funnel copy and caught it only near the end, costing a full sweep. Apply MEMORY.md hard rules at generation time, not cleanup time.
