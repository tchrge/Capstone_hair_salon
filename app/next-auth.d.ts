import NextAuth from 'next-auth';
import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend the default session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Add custom properties here
      email: string;
      name: string;
      picture: string;
    } & DefaultSession['user'];
  }
}

// Extend the JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string; // Add custom properties here
    email: string;
    name: string;
    picture: string;
  }
}
