import NextAuth, { User } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user?: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }
}
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { adminTable, vendorTable } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.SESSION_MAX_AGE || "2592000", 10), // Default to 30 days if not set
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        // Fetch user by email
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          const user = await db
            .select()
            .from(adminTable)
            .where(eq(adminTable.email, credentials.email.toString()))
            .limit(1);

          if (user.length === 0) {
            throw new Error("Account does not exist");
          }

          // Validate password
          const isPasswordValid = await compare(
            credentials.password.toString(),
            user[0].password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid Password");
          }

          // Return user object if authentication is successful
          return {
            id: user[0].adminId.toString(),
            role: user[0].role,
            email: user[0].email,
            name: user[0].name,
          } as User;
        } else {
          const user = await db
            .select()
            .from(vendorTable)
            .where(eq(vendorTable.email, credentials.email.toString()))
            .limit(1);
  
          if (user.length === 0) {
            throw new Error("Account does not exist");
          }
  
          // Validate password
          const isPasswordValid = await compare(
            credentials.password.toString(),
            user[0].password
          );
  
          if (!isPasswordValid) {
            throw new Error("Invalid Password");
          }

          if(user[0].status === 'ACTIVE') {
            // Return user object if authentication is successful
            return {
              id: user[0].vendorId.toString(),
              role: user[0].role,
              email: user[0].email,
              name: user[0].name,
            } as User;
          } else {
            throw new Error("Account is not active");
          }
  
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  trustHost: true
});
