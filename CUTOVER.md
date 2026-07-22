# Tall Timbers Funnel Cutover Checklist (Tanner-side steps)

**Status (2026-07-22): FUNNEL IS LIVE ON VERCEL PRODUCTION at
https://talltimbers.vercel.app** (the project's public alias; slider drag fix verified
live). **Important discovery:** the apex talltimbersrfs.com is Adam's AgentFire realty
site behind Cloudflare, so it was never ours and never changes. The ONLY remaining
plumbing is the dscr subdomain (Phase B) and pointing ads at it (Phase E). Old site's
last commit is `97ff274` in the repo history if ever needed.

**Code location:** `github.com/tannerk711/talltimbers`, production branch `main`
(`dscr-funnel` branch kept in sync). Every push to `main` auto-deploys.

**Already done in code, zero action needed:** phone (888) 931-0211 everywhere, logo +
favicon + Adam's headshot, Google tag AW-18132955750 site-wide, New Lead conversion
(AW-18132955750/Tbu1CMmLkrUcEObku8ZD) firing on thank-you for real leads + ?demo=1 only,
Hotjar 6725186 site-wide, Adam's booking calendar (9CBi2dkCfuszehuLkyA1) embedded on
thank-you, privacy + legal pages, full compliance sweep against the 15 DSCR rules, and
/lp/georgia-dscr + /lp/florida-dscr redirects (useful if the apex ever points here too).

---

## Phase A. Vercel settings (5 min, DO THIS FIRST)

- [ ] 1. Confirm the production deployment succeeded (Vercel > Deployments > latest on
      `main`) and talltimbersrfs.com shows the funnel.
- [ ] 2. **URGENT if any ads are live:** Settings > Environment Variables > add
      `LEAD_WEBHOOK_URL`, all environments, then redeploy. Until it exists, form submits
      are accepted but go nowhere. Two options:
      - **Option A (recommended): a new GHL inbound webhook.** You get this URL when you
        build Workflow A in Phase D. Until it is set, leads only log server-side, so do
        Phase D before sending traffic.
      - **Option B (fastest): the existing Zapier catch hook**
        `https://hooks.zapier.com/hooks/catch/7361629/4ovjjmn/`. WARNING: the new funnel
        sends DIFFERENT field names than the old site (see `deliverables/WIRING.md` payload
        table), so you must remap the Zap's fields once, and the Zap will also receive
        partial leads (`partial: true` = name+email only, no phone yet). Filter or route
        those in the Zap.
- [ ] 3. On the Vercel URL: submit one test lead all the way through. Confirm it arrives
      wherever `LEAD_WEBHOOK_URL` points, and the thank-you page shows your name, your
      scenario chips, and Adam's calendar.

## Phase B. Add the subdomain (5 min)

- [ ] 4. Vercel project (talltimbers, team ai-wizard-junk) > Settings > Domains > add
      `dscr.talltimbersrfs.com`.
- [ ] 5. In the talltimbersrfs.com DNS (Cloudflare; the apex is Adam's AgentFire site, so
      Adam or whoever holds the Cloudflare login adds this): CNAME record, name `dscr`,
      target `cname.vercel-dns.com`, **proxy OFF (DNS-only / grey cloud)**. Nothing else
      in the zone changes; the apex site is untouched.
- [ ] 6. Spot-check live: `dscr.talltimbersrfs.com` shows the funnel; `/privacy`,
      `/legal`, and `/call-prep` load. (Until then the funnel is reachable at
      https://talltimbers.vercel.app for testing and demos.)

## Phase C. Tracking check (5 min)

- [ ] 7. Open `https://dscr.talltimbersrfs.com/thank-you?demo=1` with Google Tag
      Assistant: the New Lead conversion should fire. (Same tag + same conversion action
      as the old site, so Google Ads keeps counting without changes.)
- [ ] 8. Hotjar dashboard, site 6725186: confirm recordings from the new subdomain appear.
      If the Hotjar site has an allowed-domains list, add dscr.talltimbersrfs.com to it.

## Phase D. GHL wiring (30-45 min, backs the email promise)

The funnel tells every lead "your eligibility summary lands in your inbox." The email and
follow-ups are written and rebranded in `deliverables/`; they just need to exist in GHL.

- [ ] 9. Build Workflow A/B/C exactly as written in `deliverables/WIRING.md` (inbound
      webhook trigger, field mapping, immediate eligibility email, booked-goal exit,
      day 1/3/5 follow-ups + 2 SMS). Fastest path: tell Claude "wire the Tall Timbers
      funnel workflows in GHL per WIRING.md" (ghl-mcp is installed), then review.
- [ ] 10. Put the inbound webhook URL from step 9 into `LEAD_WEBHOOK_URL` (Phase A) and
      redeploy (Vercel > Deployments > Redeploy, or just push any commit).
- [ ] 11. One full live test on dscr.talltimbersrfs.com: real submission > contact in GHL
      with mapped fields > eligibility email arrives > book a slot on the thank-you
      calendar > appointment shows on Adam's calendar.

## Phase E. Point the traffic (THE actual switch, 10 min)

- [ ] 12. In Adam's Google Ads account: change the ads' final URLs from the old
      `talltimbersrfs.com/lp/...` pages to `https://dscr.talltimbersrfs.com/`. Ads already
      reach the funnel via the /lp/* redirects on the apex, so this is cleanup for Quality
      Score, not a blocker. Keep URL suffixes/UTMs; the funnel captures gclid + all utm_*
      automatically.
- [ ] 13. Over the next few days, watch conversions in Ads. Counting stays "One";
      nothing else to change. Compare CPL vs the old 8.72% @ $70 baseline.

## Phase F. Afterwards

- [ ] 14. Tell Adam the new booking flow is live (leads now see his calendar immediately
      after submitting).
- [ ] 15. Decide the apex's future: keep the old site at talltimbersrfs.com, or point the
      apex at this project too later (the /lp/* redirects are already in place if so).
- [ ] 16. Optional: film the before/after for the channel. The funnel-vs-old-site story
      (and the conversion numbers once they accrue) is exactly your build-in-public lane.

---

**Rollback:** the old site is commit `97ff274` in the same repo. If anything looks wrong,
tell Claude "roll back the tall timbers site" and main gets reverted to it in one push;
Vercel redeploys the old site in about a minute.
