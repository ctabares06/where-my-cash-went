import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@/lib/ormClient/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const client = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: 'postgresql',
  }),
  trustedOrigins: ['http://localhost:5173', 'http://localhost:80'],
  baseURL: process.env.BASE_URL,
  secret: process.env.AUTH_SECRET,
  basePath: '/auth',
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      partitionated: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.SSO_GOOGLE_ID!,
      clientSecret: process.env.SSO_GOOGLE_SECRET!,
    },
  },
});
