import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return new Response(JSON.stringify({ success: false, error: 'Secret key not set.' }), { status: 500 });
  }

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`,
  });
  const data = await verifyRes.json();
  if (data.success) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  return new Response(JSON.stringify({ success: false, error: data['error-codes'] }), { status: 400 });
}
