import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationToken = require('crypto').randomBytes(32).toString('hex');

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        activationToken,
        isActivated: false
      } as any,
    });
    // Send activation email via Resend
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const activationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/activate?token=${activationToken}&email=${encodeURIComponent(email)}`;
      await resend.emails.send({
        from: 'CampusHub <noreply@onresend.com>',
        to: email,
        subject: 'Activate your CampusHub account',
        html: `<p>Welcome to CampusHub! Please <a href="${activationUrl}">activate your account</a> to get started.</p>`
      });
    } catch (e) {
      console.error('Error sending activation email:', e);
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint failed
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    if (process.env.NODE_ENV !== 'production') {
      // Log and return error for debugging
      console.error('Register User Error:', error);
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
