# Session prompt: build dscr-funnel-template-2

Paste everything below into a fresh Fable 5 chat. If the v1 dev server is running, tell it to kill port 4321 first.

---

Create a new client folder called dscr-funnel-template-2. We're building a second, completely
original DSCR funnel: landing page, multi-step lead form, and thank-you page. This is a sister
template to clients/dscr-funnel-template (v1), but it must be visually and conceptually
DIFFERENT from v1 in every way that matters. Do not open or reuse v1's code, layout, palette,
typography, or signature elements. The only thing you may read from v1 is its CLAUDE.md, for
the baseline metrics and the "Gotchas" section.

HARD DIFFERENTIATION RULES (v1 used these, you must not):
- Palette: v1 = deep ink green + ivory paper + brass. Commit to a different palette.
- Type: v1 = Fraunces + Hanken Grotesk + Fragment Mono. Pick different, characterful fonts.
- Aesthetic: v1 = "private credit house" luxury editorial, dark hero + light body. Choose a
  genuinely different direction and commit hard (ideas, not mandates: Swiss-fintech modernist,
  blueprint/architectural drafting, warm analog California, kinetic data-desk brutalism,
  night-terminal luxe).
- Signature elements: v1 = arched 3D property photo with floating rent/payment/DSCR ledger
  chips, brass DSCR gauge, funded-deal marquee ticker. Invent your own signature moments:
  a different 3D tactic, a different way to visualize the rent-covers-payment math, a
  different social proof mechanic.
- Form presentation: v1 = ivory card in the hero's right column. Use a different
  high-converting paradigm (full-viewport step takeover, conversational, split-screen,
  your call).

WHAT STAYS (proven mechanics + infrastructure):
- Stack: Astro 5 + React islands + Tailwind v4 + GSAP + @astrojs/vercel adapter, dev on
  port 4321, deployable to Vercel.
- Funnel: Google Ads visitor -> LP -> multi-step form -> thank-you with booking embed slot.
- Form flow: goal / property type / credit band (below 620 = soft-stop screen) / price-value
  slider $150K-$2M / conditional money step (down % for purchase, balance-to-equity for refi
  and cash-out, rehab budget for bridge) / state type-ahead / name+email / phone LAST with
  TCPA consent copy.
- Conversion engineering: auto-advance on select, back link, progress indicator, scenario
  summary chips at the phone step, gclid+UTM capture, honeypot field, dataLayer events
  (funnel_start, funnel_step, lead_submit), secondsToComplete in the payload, mobile sticky
  CTA when the form is out of view, sessionStorage personalization on the thank-you page,
  gtag conversion placeholder.
- Server-side lead forwarding via /api/lead reading LEAD_WEBHOOK_URL from env. Never read
  the webhook URL in browser code.
- Every brandable token in one config file (the src/config/funnel.ts pattern) so rebranding
  a client is config + two images only.
- Compliance: NMLS footer block, nmlsconsumeraccess link, equal housing mark, privacy/legal
  stub pages, TCPA at the phone step.

THE NUMBERS TO BEAT (my real production funnel, from my Google Ads account):
- April 2026: 8.72% LP conversion, $70.16/lead, $6.12 avg CPC, 4.93% CTR
- May 2026: 8.15% conversion, ~$80/lead
Targets: 12-15%+ conversion, under $50/lead, richer lead-quality data.

PROCESS:
- Generate original hero/section imagery with the fal MCP (flux-pro), matched to YOUR
  aesthetic, converted to WebP.
- Mobile-first: most ad traffic is mobile. Verify with puppeteer-core mobile emulation
  against installed Chrome (bare headless --screenshot lies at mobile widths). A working
  harness you may adapt: clients/dscr-funnel-template/tools/shoot.mjs.
- npm run build after each logical unit, zero errors before continuing.
- Minimum three full iteration passes: screenshot desktop + mobile + every form step +
  the decline branch + thank-you, review with a fine-toothed comb, fix, repeat.
- No em-dashes anywhere: copy, code comments, chat.
- Known gotchas: Tailwind v4 translate-* utilities set the CSS `translate` property, so JS
  visibility toggles must set el.style.translate, not transform. GHL booking iframes need
  scrolling="yes", height min(reported, 100vh - 120px), and no overflow-hidden wrapper.
- When done: git init + commit, write the client CLAUDE.md (baseline, design system,
  rebrand steps, lessons), and open localhost:4321 in Chrome.

You have total creative freedom inside those rails. The goal: a funnel that looks nothing
like v1, is unforgettable in its own right, and converts DSCR Google Ads traffic even
harder. Show me what a second, fully individualized Fable 5 funnel looks like.
