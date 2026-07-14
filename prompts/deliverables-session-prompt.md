# Session prompt: build the funnel's promised deliverables

Paste everything below into a fresh Fable 5 chat.

---

Open clients/dscr-funnel-template (the master DSCR funnel built 2026-07-13). Read its
CLAUDE.md and src/config/funnel.ts first. Your job this session: build every deliverable
asset the funnel PROMISES the lead, so the promise chain is real the moment a form submits.

WHAT THE FUNNEL PROMISES (from its own copy):
- Contact step: "Your eligibility summary lands in your inbox"
- CTA: "Get My Eligibility Results"
- Thank-you page: "reply to the email we just sent to lock in a time", a strategy call
  where we price the scenario across 100+ lenders, and a pre-approval letter within ~24h
  (that last one is the human broker's doc, not yours)

WHAT THE LEAD PAYLOAD CONTAINS (from /api/lead): firstName, email, phone, goal (purchase /
refinance / cashout / bridge), propertyType, credit band, price, downPayment + downPct
(purchase), balance (refi/cashout, equity derivable), rehab (bridge), state, gclid + UTMs,
secondsToComplete, submittedAt.

BUILD THESE, in clients/dscr-funnel-template/deliverables/:

1. ELIGIBILITY SUMMARY EMAIL (the core promise). GHL-ready HTML email, personalized with
   merge fields: recap their exact scenario (goal, property type, credit band, price,
   down payment or equity, state), an eligibility verdict framed as "based on your answers
   you pre-qualify", a plain-English read of THEIR DSCR math (what rent would need to
   cover at their price point, shown as an educational example, never a rate quote), and
   one CTA: book the call (booking link token) with phone as the alternate. Subject line
   plus 2 variants. Design: translate the funnel's ink-green/paper/brass system into
   email-safe HTML (600px, tables, inline CSS, Georgia + Helvetica fallbacks, light mode,
   image-light so GHL can send it reliably).

2. NO-BOOK FOLLOW-UP MINI-SEQUENCE. 3 emails + 2 SMS for leads who submit but never book:
   day 0 evening SMS, day 1 email (objection: "is this a hard pull / am I committed"),
   day 3 email (show the math: what a 1.25x deal looks like), day 5 email (last call,
   direct invite). Same design system. SMS under 320 chars each.

3. STRATEGY-CALL PREP ONE-PAGER. A print-ready HTML page (PDF-able) the summary email
   links to: "What to have ready for your call" - property address or target market, rent
   estimate or lease, ballpark credit, entity/LLC status, timeline. Make it feel like a
   private-bank client onboarding sheet, same design tokens as the funnel.

4. WIRING DOC (deliverables/WIRING.md). Table mapping every /api/lead payload field to a
   GHL custom field name, then the workflow: inbound webhook -> map fields -> send email 1
   immediately -> booking check -> follow-up branch. Written so a future Claude session
   with the ghl-mcp (or a VA) can execute it in one pass. Note that the ghl-mcp server and
   the ghl-email-template skill exist for pushing templates into a location when I name a
   client; do NOT push anywhere this session, these are template masters.

RULES:
- Read foundation/copywriting-tanner-style/golden-rules.md before writing any copy and
  obey it: invite and self-select, never hard sell, show over tell, say only what we can
  back up. No fabricated numbers anywhere.
- Every brandable token (company name, NMLS, phone, booking URL, address) as an obvious
  placeholder consistent with src/config/funnel.ts values, listed once at the top of
  each file, so rebranding stays config-style.
- Compliance on every email: NMLS line, physical address, unsubscribe, equal housing,
  "not a commitment to lend" line. Educational examples only, no rate or approval promises.
- No em-dashes anywhere: copy, code, chat.
- Verify visually: render each HTML asset in Chrome (puppeteer or headless screenshot),
  review desktop + a 375px-wide mobile pass, iterate at least twice on each, and check the
  email at 600px in both a white and a dark background preview.
- When done: commit into the existing repo in that folder, update the client CLAUDE.md
  with a Deliverables section, and open the eligibility summary email preview in Chrome.

The funnel makes the promise in about 60 seconds. These assets are what make the promise
true. Match their quality to the funnel: this is the part of the machine the lead actually
receives.
