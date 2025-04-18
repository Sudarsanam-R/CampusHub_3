import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } }) as any;
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.isActivated) {
    return NextResponse.json({ error: 'Account not activated. Please check your email for the activation link.' }, { status: 403 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Send login alert email via Resend
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const loginTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    await resend.emails.send({
      from: 'CampusHub <noreply@onresend.com>',
      to: email,
      subject: 'CampusHub Login Alert',
      html: `<p>Your account was just logged in at <strong>${loginTime}</strong> from IP: <strong>${ip}</strong>. If this wasn't you, please reset your password immediately.</p>`
    });
  } catch (e) {
    console.error('Error sending login alert email:', e);
  }

  // Optionally: create a session or JWT here for real authentication
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
