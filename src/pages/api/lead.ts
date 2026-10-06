import type { APIRoute } from 'astro';

export const prerender = false;

// Forwards form submissions server-side to the CRM webhook.
// Set LEAD_WEBHOOK_URL in the environment (Vercel project settings / .env).
// Keeping the webhook out of the browser: Vite strips non-PUBLIC_ vars from
// client code, and same-origin POST avoids every CORS/preflight failure mode.

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad json' }, 400);
  }

  // Honeypot is a LABEL, never a gate (Tanner, 2026-10-06: every complete
  // submit fires the Zap and becomes a lead). A filled trap travels as
  // honeypotFilled: true on the payload and gets one log line; nothing is
  // dropped. The pre-rename trap key is still read for cached bundles.
  const who = () =>
    JSON.stringify({ name: data.firstName, email: data.email ?? data.phone });
  const trap = [data.ff_hp, data.website].find((v) => typeof v === 'string' && v.trim() !== '');
  delete data.ff_hp;
  delete data.website;
  const seconds = Number(data.secondsToComplete);
  data.honeypotFilled = trap !== undefined;
  if (trap !== undefined) {
    console.warn(`[lead] trap filled (${seconds}s), forwarding flagged`, who());
  }

  // TCPA gate, server side. The checkbox in the form is the real UX, but a
  // client-only gate is bypassable and this is a legal consent record, so a
  // lead without affirmative consent never reaches the CRM.
  if (data.tcpaConsent !== true) {
    console.warn('[lead] rejected: missing consent', who());
    return json({ ok: false, error: 'consent required' }, 400);
  }

  // one webhook per lead means a COMPLETE lead: name + email + phone.
  for (const req of ['firstName', 'email', 'phone']) {
    if (String(data[req] ?? '').trim() === '') {
      console.warn(`[lead] rejected: missing ${req}`, who());
      return json({ ok: false, error: `missing ${req}` }, 400);
    }
  }

  // Stamp the consent record with data only the server can vouch for. The
  // browser can claim any timestamp/IP; these are captured at the edge.
  const headers = request.headers;
  data.tcpaConsentIp =
    headers.get('x-vercel-forwarded-for') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    null;
  data.tcpaConsentUserAgent = headers.get('user-agent') ?? null;
  data.tcpaConsentReceivedAt = new Date().toISOString();

  const webhook = import.meta.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error(`[lead] webhook answered ${res.status}`, who());
        return json({ ok: false, error: `webhook ${res.status}` }, 502);
      }
      console.log(
        `[lead] accepted, webhook ${res.status}`,
        JSON.stringify({
          name: data.firstName,
          email: data.email,
          receivedAt: data.tcpaConsentReceivedAt,
          ip: data.tcpaConsentIp,
          seconds,
          honeypotFilled: data.honeypotFilled,
        }),
      );
    } catch (e) {
      console.error('[lead] webhook unreachable', who(), e);
      return json({ ok: false, error: 'webhook unreachable' }, 502);
    }
  } else {
    console.log('[lead] LEAD_WEBHOOK_URL not set; payload:', JSON.stringify(data));
  }

  return json({ ok: true }, 200);
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
