import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, token, password } = await req.json();
  if (!email || !token || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !('resetToken' in user) || !('resetTokenExpiry' in user) || !user.resetToken || !user.resetTokenExpiry) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }
  if (user.resetToken !== token || user.resetTokenExpiry < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
  return NextResponse.json({ message: 'Password reset successful' });
}
