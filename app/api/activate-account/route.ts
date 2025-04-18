import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, token } = await req.json();
  if (!email || !token) {
    return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } }) as any;
  if (!user || user.isActivated || user.activationToken !== token) {
    return NextResponse.json({ error: 'Invalid or already used activation link' }, { status: 400 });
  }
  await prisma.user.update({
    where: { email },
    data: { isActivated: true, activationToken: null } as any,
  });
  return NextResponse.json({ message: 'Account activated successfully' });
}
