import { NextResponse } from 'next/server';

/**
 * Stub newsletter subscription endpoint.
 *
 * Currently logs the email to the server log so nothing is lost during
 * the launch window. Replace the inner block with the real ESP call
 * (Resend / Buttondown / ConvertKit / etc.) once the funnel work begins.
 *
 * Validates only the basics: shape and obvious bot patterns.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const email = (payload as { email?: unknown })?.email;
  if (typeof email !== 'string') {
    return NextResponse.json({ error: 'missing_email' }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();
  if (trimmed.length < 5 || trimmed.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  // TODO: forward to ESP. For now just log so the address isn't lost.
  console.log('[newsletter] subscribe', { email: trimmed, ts: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
