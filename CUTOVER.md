# Tall Timbers Funnel Cutover Checklist (Tanner-side steps)

**Plan (updated 2026-07-22):** the funnel lives at **dscr.talltimbersrfs.com**. The old site
stays on the apex (talltimbersrfs.com) untouched for now, so there is nothing to roll back;
traffic switches when the Google Ads final URLs point at the subdomain.

**Code location:** branch `dscr-funnel` on the existing repo
`github.com/tannerk711/talltimbers` (pushed 2026-07-22; `main` still holds the old site,
whose full history is preserved). The existing Vercel project auto-builds the branch as a
preview deployment on every push.

**Already done in code, zero action needed:** phone (888) 931-0211 everywhere, logo +
favicon + Adam's headshot, Google tag AW-18132955750 site-wide, New Lead conversion
(AW-18132955750/Tbu1CMmLkrUcEObku8ZD) firing on thank-you for real leads + ?demo=1 only,
Hotjar 6725186 site-wide, Adam's booking calendar (9CBi2dkCfuszehuLkyA1) embedded on
thank-you, privacy + legal pages, full compliance sweep against the 15 DSCR rules, and
/lp/georgia-dscr + /lp/florida-dscr redirects (useful if the apex ever points here too).

---

## Phase A. Vercel settings (5 min, one time)

- [ ] 1. The branch is already pushed; the existing talltimbers Vercel project builds it
      automatically (check Deployments for the `dscr-funnel` preview build).
- [ ] 2. In that Vercel project: Settings > Environment Variables > add
      `LEAD_WEBHOOK_URL` and apply it to **all environments** (the subdomain will serve a
      branch deployment, which uses the Preview scope). Two options:
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

- [ ] 4. Same Vercel project > Settings > Domains > add `dscr.talltimbersrfs.com`, then
      edit the domain and set **Git Branch: `dscr-funnel`**. That serves the funnel branch
      on the subdomain while `main` (the old site) keeps serving the apex. No new Vercel
      project needed.
- [ ] 5. If Vercel asks for DNS: add a CNAME record for `dscr` pointing to
      `cname.vercel-dns.com` wherever talltimbersrfs.com's DNS lives. (If the domain's
      nameservers are already Vercel's, this is automatic.) The apex and the old site are
      NOT touched.
- [ ] 6. Spot-check live: `dscr.talltimbersrfs.com` shows the funnel; `/privacy`,
      `/legal`, and `/call-prep` load.
      (Alternative later: to put the funnel on the apex too, tell Claude "flip main"; the
      branch fast-forwards onto `main` in one push and the old site stays in history.)

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
      `talltimbersrfs.com/lp/...` pages to `https://dscr.talltimbersrfs.com/`. This is the
      moment the new funnel starts getting traffic; until then the old LPs keep running.
      Keep URL suffixes/UTMs; the funnel captures gclid + all utm_* automatically.
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

**Rollback:** the old site never moves. If anything looks wrong, point the Ads final URLs
back at the old LP pages; done.
