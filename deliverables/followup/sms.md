# No-Book Follow-Up SMS (2 messages)

Part of the no-book branch in [WIRING.md](../WIRING.md). Both messages stay
under 320 characters after merge fields resolve, with real headroom (counts
below). The full-length GHL widget booking URL (68 chars) is already baked
into both messages and into the counts below.

REBRAND APPLIED: Tall Timbers Realty and Financial Services (2026-07-21).
Values mirror `src/config/funnel.ts`:

| Token | Applied value |
| --- | --- |
| specialist first name (SMS voice) | Adam (Adam C. Cunningham, NMLS #312817) |
| brand.shortName | Tall Timbers |
| brand.lenderCount | 70+ (locked; never any other number) |
| booking link | https://api.leadconnectorhq.com/widget/booking/9CBi2dkCfuszehuLkyA1 |

Compliance notes:
- The funnel's TCPA checkbox (`tcpaCopy` in `funnel.ts`, includes the
  automated-technology clause) is the consent basis. Keep sends between
  8am and 9pm contact-local time.
- "Reply STOP to opt out" stays in BOTH messages. If the GHL location
  auto-appends opt-out language, remove the manual line so it does not double.
- Partial leads (see WIRING.md) have no phone number; GHL skips SMS steps for
  them automatically. No extra branching needed.

---

## SMS 1 · Day 0, evening

Timing: a Wait step set to 6:30pm contact-local. GHL's native behavior when
6:30pm has already passed is to roll to 6:30pm the NEXT day, so an evening
lead gets SMS 1 the following evening. That is the intended build; do not
invent a same-night send for late leads.

```
{{contact.first_name}}, it's Adam at Tall Timbers. Your eligibility summary is sitting in your inbox. When you're ready, pick a call time here: https://api.leadconnectorhq.com/widget/booking/9CBi2dkCfuszehuLkyA1. Reply STOP to opt out.
```

~215 chars raw; ~220 with a typical merged first name.
Deliberately does NOT repeat the no-credit-pull reassurance; the day 1 email
owns that objection. It also names no subject line, so it survives any
Email 1 subject A/B test.

## SMS 2 · Day 4, late morning (10:30am contact-local)

```
{{contact.first_name}}, still holding your DSCR file: {{contact.dscr_goal_label}}, {{contact.dscr_state}}, {{contact.dscr_price_display}}. Worth 30 minutes to price it across 70+ lenders? Grab a time: https://api.leadconnectorhq.com/widget/booking/9CBi2dkCfuszehuLkyA1. If timing's off, all good. Reply STOP to opt out.
```

~250 chars raw with the full URL; ~255 with typical merges. The three
merge fields double as proof we actually read their file, which is the point
of the message.
