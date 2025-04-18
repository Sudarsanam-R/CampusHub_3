import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, don't reveal if user exists
    return NextResponse.json({ message: 'If this email exists, a reset link will be sent.' });
  }
  // Generate token and expiry
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: tokenExpiry } as any,
  });

  // Send email
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'CampusHub <noreply@onresend.com>',
    to: email,
    subject: 'CampusHub Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`
  });
  return NextResponse.json({ message: 'If this email exists, a reset link will be sent.' });
}
