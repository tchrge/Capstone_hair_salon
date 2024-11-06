// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
    provider: string; // Ensure this is included
  }

  interface Session {
    user: User; // Use the extended User type
  }
}
