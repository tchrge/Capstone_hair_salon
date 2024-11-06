import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || ''
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/api/auth/callback/google')) {
        return `${baseUrl}/google/success`;
      }
      if (url.startsWith('/api/auth/callback/facebook')) {
        return `${baseUrl}/facebook/success`;
      }
      return baseUrl;
    },
    async session({ session, user }) {
      // Customize session here
      session.user = user;
      return session;
    },
  },
};

// Export the handler for Next.js API routes
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
