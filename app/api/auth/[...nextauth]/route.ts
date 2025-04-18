import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import FacebookProvider from 'next-auth/providers/facebook'

import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only store if not already present
      if (!user?.email) return false;
      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user.name || user.email.split('@')[0],
            email: user.email,
            password: '', // No password for OAuth
          },
        });
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/';
    },
  },
});

export { handler as GET, handler as POST }
